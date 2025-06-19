const { rankDocuments } = require('../Ranking');

// Mock the MongoDB client and collections
jest.mock('../db', () => ({
  client: {
    db: () => ({
      collection: (name) => ({
        find: () => ({
          toArray: async () => {
            if (name === 'doc_metadata') {
              return [
                { doc_id: 1, title: 'All About Cars', length: 100, url: 'http://car.com', snippet: 'Info about cars', links_count: 5 },
                { doc_id: 2, title: 'Automobile Basics', length: 120, url: 'http://auto.com', snippet: 'Auto details', links_count: 3 }
              ];
            } else if (name === 'inverted_index') {
              return [
                {
                  term: 'car',
                  postings: {
                    1: 5,
                    2: 2
                  }
                }
              ];
            }
            return [];
          }
        })
      })
    })
  }
}));

test('ranks documents by BM25 score for query "car"', async () => {
  const results = await rankDocuments('car');

  // It should return two documents
  expect(results.length).toBe(2);

  // Document 1 should rank higher because of higher term frequency
  expect(results[0].docId).toBe(1);
  expect(results[0].score).toBeGreaterThan(results[1].score);

  // Document 2 should be second
  expect(results[1].docId).toBe(2);

  // Ensure extra metadata is preserved
  expect(results[0]).toHaveProperty('url');
  expect(results[0]).toHaveProperty('snippet');
  expect(results[0]).toHaveProperty('title');
});
