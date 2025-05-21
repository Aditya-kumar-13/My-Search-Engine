const fs = require('fs');
const path = require('path');

const invertedIndex = JSON.parse(fs.readFileSync(path.join(__dirname, '../Data/inverted_index.json'), 'utf8'));
const docMetadata = JSON.parse(fs.readFileSync(path.join(__dirname, '../Data/doc_metadata.json'), 'utf8'));

const totalDocs = Object.keys(docMetadata).length;

// Term Frequency (TF): freq of term in doc / total terms in doc
function tf(term, docId) {
  if (!invertedIndex[term] || !invertedIndex[term][docId]) return 0;
  const termFreq = parseInt(invertedIndex[term][docId], 10);
  const docLength = docMetadata[docId]?.length || 1; // fallback to 1 to avoid div by zero
  return termFreq / docLength;
}

// Inverse Document Frequency (IDF): log(total docs / docs with term)
function idf(term) {
  if (!invertedIndex[term]) return 0;
  const docsWithTerm = Object.keys(invertedIndex[term]).length;
  if (docsWithTerm === 0) return 0;
  return Math.log(totalDocs / docsWithTerm);
}

function rankDocuments(query) {
  const terms = query.toLowerCase().split(/\W+/);
  const scores = {};

  for (const term of terms) {
    if (!invertedIndex[term]) continue;

    const termIdf = idf(term);

    for (const docId of Object.keys(invertedIndex[term])) {
      const termTf = tf(term, docId);
      const score = termTf * termIdf;
      scores[docId] = (scores[docId] || 0) + score;
    }
  }

  const rankedDocs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([docId, score]) => ({ docId, score }));

  const resultsWithMetadata = rankedDocs.map(({ docId, score }) => {
  const metadata = docMetadata[docId] || {};
    return {
      docId,
      score,
      ...metadata
    };
  });
  return resultsWithMetadata;
}

module.exports = { rankDocuments };
