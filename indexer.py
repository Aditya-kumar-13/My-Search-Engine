import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
from collections import defaultdict, Counter
import re

# Download NLTK data if not already
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

def load_documents(file_path):
    """Load and validate raw documents"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if not isinstance(data, list):
                raise ValueError("Input data should be a list of documents")
            return data
    except Exception as e:
        print(f"Error loading {file_path}: {str(e)}")
        return []

def preprocess_text(text):
    """Clean and tokenize text"""
    if not text:
        return []
    
    text = re.sub(r'\s+', ' ', text.lower().strip())
    tokens = word_tokenize(text)
    
    stop_words = set(stopwords.words('english'))
    punctuation = set(string.punctuation)
    return [t for t in tokens if t not in stop_words and t not in punctuation and len(t) > 1]

def build_index(documents):
    """Build TF-supporting inverted index and metadata"""
    inverted_index = defaultdict(dict)
    metadata = []
    
    for doc_id, doc in enumerate(documents):
        text = doc.get('first_paragraph', '')
        title = doc.get('title', '')
        url = doc.get('url', '')
        links_count = doc.get('links_count', 0)
        
        title_tokens = preprocess_text(title)
        content_tokens = preprocess_text(text)
        all_tokens = title_tokens * 2 + content_tokens  # Title has more weight
        
        token_freq = Counter(all_tokens)  # Count term frequencies

        for token, freq in token_freq.items():
            inverted_index[token][doc_id] = freq  # Store frequency per document
        
        metadata.append({
            'doc_id': doc_id,
            'title': title,
            'url': url,
            'snippet': text[:200] + ('...' if len(text) > 200 else ''),
            'links_count': links_count,
            'token_count': len(all_tokens)  # Needed for TF calculation
        })
    
    return dict(inverted_index), metadata

def save_data(inverted_index, metadata, index_path, meta_path):
    """Save index and metadata"""
    try:
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump(inverted_index, f, indent=2, ensure_ascii=False)
        
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        print(f"Saved index to {index_path} and metadata to {meta_path}")
    except Exception as e:
        print(f"Error saving data: {str(e)}")

def main():
    INPUT_FILE = 'Data/raw_data.json'
    INDEX_FILE = 'Data/inverted_index.json'
    META_FILE = 'Data/doc_metadata.json'
    
    documents = load_documents(INPUT_FILE)
    if not documents:
        print("No documents loaded - check your input file")
        return
    
    inverted_index, doc_metadata = build_index(documents)
    save_data(inverted_index, doc_metadata, INDEX_FILE, META_FILE)
    
    print(f"Indexing complete! Processed {len(documents)} documents.")

if __name__ == "__main__":
    main()
