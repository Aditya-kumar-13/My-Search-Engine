const { client } = require("./db");
const fs = require("fs");
const fuzzysort = require('fuzzysort');
let vocabulary = [];

async function loadVocabulary() {
  const db = client.db('Kumar_Engine');
  const invertedIndexCollection = db.collection('inverted_index');
  const terms = await invertedIndexCollection.find({}, { projection: { term: 1 } }).toArray();
  vocabulary = terms.map(t => t.term);
}

module.exports = { rankDocuments, loadVocabulary };


const synonyms = JSON.parse(fs.readFileSync("./synonyms.json", "utf8"));

const k = 1.5;
const b = 0.75;

function idf_BM25(totalDocs, docsWithTerm) {
  if (docsWithTerm === 0) return 0;
  return Math.log(1 + (totalDocs - docsWithTerm + 0.5) / (docsWithTerm + 0.5));
}

function bm25Score(freq, docLength, avgDocLength, idf) {
  return idf * ((freq * (k + 1)) / (freq + k * (1 - b + b * (docLength / avgDocLength))));
}

async function rankDocuments(query) {
  console.time("rankDocuments");

  const db = client.db('Kumar_Engine');
  const metadataCollection = db.collection('doc_metadata');
  const invertedIndexCollection = db.collection('inverted_index');

  const rawTerms = query.toLowerCase().split(/\W+/).filter(Boolean);

  // 🔍 Spell Correction
  const correctedTerms = rawTerms.map(term => {
    const res = fuzzysort.go(term, vocabulary);
    return res.length > 0 ? res[0].target : term;
  });

  // 🔁 Synonym Expansion
  const expandedTermsSet = new Set(correctedTerms);
  for (const term of correctedTerms) {
    if (synonyms[term]) {
      synonyms[term].forEach(syn => expandedTermsSet.add(syn));
    }
  }

  const terms = Array.from(expandedTermsSet);
  const scores = {};
  const indexDocs = await invertedIndexCollection.find({
    term: { $in: terms }
  }).toArray();

  const docIds = new Set();
  indexDocs.forEach(entry => {
    Object.keys(entry.postings).forEach(id => docIds.add(parseInt(id)));
  });

  const relevantDocIds = [...docIds];
  const docMetadataArr = await metadataCollection.find({
    doc_id: { $in: relevantDocIds }
  }).toArray();

  const docMetadata = Object.fromEntries(docMetadataArr.map(doc => [doc.doc_id, doc]));
  const totalDocs = 40000;

  const avgDocLength =
    docMetadataArr.reduce((sum, doc) => sum + (doc.length || 0), 0) / docMetadataArr.length || 1;

  const originalTerms = new Set(rawTerms);
  for (const indexEntry of indexDocs) {
    const term = indexEntry.term;
    const postings = indexEntry.postings;
    const termIdf = idf_BM25(totalDocs, Object.keys(postings).length);

    for (const docId in postings) {
      const intDocId = parseInt(docId);
      const freq = postings[docId];
      const docLength = docMetadata[intDocId]?.length || 1;
      const isSynonym = !originalTerms.has(term) && !correctedTerms.includes(term);
      const score = bm25Score(freq, docLength, avgDocLength, termIdf) * (isSynonym ? 0.7 : 1);
      scores[intDocId] = (scores[intDocId] || 0) + score;
    }
  }

  const rankedDocs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)  // ✅ Limit to top 100
    .map(([docId, score]) => ({
      docId: parseInt(docId),
      score,
      ...docMetadata[parseInt(docId)]
    }));


  console.timeEnd("rankDocuments");
  return {
    rankedDocs,
    suggestion: correctedTerms.join(" ") !== rawTerms.join(" ") ? correctedTerms.join(" ") : null
  };
}
