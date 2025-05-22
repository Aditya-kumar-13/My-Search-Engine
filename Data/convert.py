import json

with open('inverted_index.json', 'r', encoding='utf-8') as f:
    inverted_index = json.load(f)

# Convert to array format
converted = []
for term, postings in inverted_index.items():
    converted.append({
        "term": term,
        "postings": postings
    })

# Save the array-formatted index to a new JSON file
with open('inverted_index_array.json', 'w', encoding='utf-8') as f:
    json.dump(converted, f, indent=2, ensure_ascii=False)
