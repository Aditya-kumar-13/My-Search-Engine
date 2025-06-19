
# 🔍 Kumar Engine – Full Stack Search Engine

Kumar Engine is a high-performance search engine that crawls, indexes, and ranks web content using BM25. It features typo correction, synonym expansion, pagination, and a responsive TailwindCSS-based UI. The system is built using Scrapy, Python, Node.js, React, and MongoDB.

## 🌐 Live Links

- **Frontend**: [https://kumar-engine.vercel.app](https://kumar-engine.vercel.app)  
- **Backend**: [https://kumar-search-api.onrender.com](https://kumar-search-api.onrender.com)

---

## 🚀 Features

- 🕷️ **Web Crawling**: Used Scrapy to crawl 40,000+ Wikipedia pages and BBC News articles.
- 🧠 **BM25 Ranking**: Switched from TF-IDF to BM25 for better relevance scoring.
- ⚡ **Performance Optimized**: Reduced query time from 1–2 minutes to under 2 seconds by limiting DB reads and using efficient indexes.
- 📝 **Typo Suggestion**: Suggests corrections for misspelled queries using edit distance.
- 🔁 **Synonym Support**: Automatically expands queries with relevant synonyms (e.g., "car" → "automobile").
- 📃 **Pagination**: Displays only top 100 results with numbered pagination and Prev/Next.
- 🧪 **Unit Testing**: 98%+ test coverage on backend logic using Jest.
- 💅 **Responsive UI**: Built with React + TailwindCSS for modern, animated interface.
- 🌐 **Deployed**: Frontend on Vercel, Backend on Render, MongoDB Atlas used for storage.

---

## 🧰 Tech Stack

| Layer       | Technology                        |
|-------------|------------------------------------|
| Frontend    | React, Vite, TailwindCSS           |
| Backend     | Node.js, Express.js                |
| Crawler     | Python, Scrapy, NLTK               |
| Database    | MongoDB Atlas                      |
| Testing     | Jest (backend logic)               |
| Hosting     | Vercel (frontend), Render (backend)|

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/My-Search-Engine.git
cd My-Search-Engine
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:
```
MONGODB_URI=<your_mongodb_uri>
```

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create `Frontend/.env`:
```
VITE_BACKEND_URL=https://kumar-search-api.onrender.com
```

---

## 🕷️ Optional: Crawl & Re-index Data

```bash
cd wiki_crawler
pip install scrapy nltk

# Run spiders
scrapy crawl wikipedia
scrapy crawl bbc

# Combine + Index data
cd ..
node combiner.js
python indexer.py
```

Upload `inverted_index.json` and `doc_metadata.json` to your MongoDB using a script or mongoimport.

---

## ▶️ Run Locally

```bash
# Start backend
cd Backend
npm start

# In another terminal, start frontend
cd ../Frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## ✅ Testing

```bash
cd Backend
npm run coverage
```

Expected coverage:
```
Statements   : 98%
Functions    : 100%
Lines        : 100%
```

---

## 📌 Example Search Flow

1. User searches for "vehcle"
2. System suggests: "Did you mean vehicle?"
3. Query expanded with synonyms like "automobile", "car"
4. BM25 ranking applied
5. Top 100 results shown with pagination

---

## 🖼️ Screenshots

_(Include screenshots like homepage, results with suggestions, and pagination if desired.)_

---

## 📄 License
