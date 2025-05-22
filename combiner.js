const fs = require('fs');
const path = require('path');

const rawPath = path.join('.', 'Data/raw_data.json');
const bbcPath = path.join('.', 'Data/bbc_articles.json');
const outputPath = path.join('.', 'Data/combined_data.json');

const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));
const bbcData = JSON.parse(fs.readFileSync(bbcPath, 'utf-8'));

// Normalize BBC data
const normalizedBBC = bbcData.map(item => ({
  title: item.title ?? 'BBC Article',
  first_paragraph: item.content.slice(0, 1000),
  url: item.url,
  links_count: 0
}));

// Combine both
const combined = [...rawData, ...normalizedBBC];

// Save to new file
fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2), 'utf-8');

console.log('Combined dataset saved as combined_data.json');
