const { client } = require('./db');

function tf(termFreq, docLength) {
  return termFreq / (docLength || 1); // avoid divide by zero
}

function idf(totalDocs, docsWithTerm) {
  if (docsWithTerm === 0) return 0;
  return Math.log(totalDocs / docsWithTerm);
}

async function rankDocuments(query) {
  const db = client.db('Kumar_Engine'); 
  const metadataCollection = db.collection('doc_metadata');
  const invertedIndexCollection = db.collection('inverted_index');

  const terms = query.toLowerCase().split(/\W+/);

  const scores = {};

  const docMetadataArr = await metadataCollection.find().toArray();
  const docMetadata = {};
  for (const doc of docMetadataArr) {
    docMetadata[doc.doc_id] = doc;
  }
  const totalDocs = docMetadataArr.length;

  // Fetch all relevant terms from the index
  const indexDocs = await invertedIndexCollection.find({
    term: { $in: terms }
  }).toArray();

  for (const indexEntry of indexDocs) {
    const term = indexEntry.term;
    const postings = indexEntry.postings;
    const termIdf = idf(totalDocs, Object.keys(postings).length);

    for (const docId in postings) {
      const freq = postings[docId];
      const docLength = docMetadata[docId]?.length || 1;
      const score = tf(freq, docLength) * termIdf;
      scores[docId] = (scores[docId] || 0) + score;
    }
  }
  const rankedDocs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([docId, score]) => {
      return {
        docId,
        score,
        ...docMetadata[docId]
      };
    });

  return rankedDocs;
}

module.exports = { rankDocuments };
