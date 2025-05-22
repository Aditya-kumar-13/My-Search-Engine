```markdown
# My-Search-Engine

## Description

This project is a search engine that crawls web pages, indexes their content, and provides search results based on user queries. It utilizes a web crawler to gather data from Wikipedia and BBC News, processes the data to create an index, and presents search results through a React-based frontend. The backend, built with Node.js, handles search queries, calculates TF-IDF scores, and retrieves relevant document metadata.  The data is stored and retrieved efficiently using MongoDB.

## Features

*   **Web Crawling:** Crawls Wikipedia (50 pages, depth 3) and BBC News (4 pages) to gather article data.
*   **Data Extraction:** Extracts title, URL, first paragraph, and link count from Wikipedia articles and title, URL, and content from BBC News articles.
*   **Data Combination:** Combines data from different sources into a unified format.
*   **Indexing:** Creates an inverted index mapping words to document IDs and frequencies.
*   **Search Functionality:**
    *   Tokenizes user queries using NLTK.
    *   Calculates TF-IDF scores for each document.
    *   Sorts search results based on TF-IDF scores.
*   **Frontend:** React frontend for user interaction and displaying search results.
*   **Backend:** Node.js backend for handling search requests and processing data.
*   **Database:** MongoDB integration for storing and retrieving the inverted index and document metadata.
*   **Deployment:** Frontend deployed on Vercel, backend deployed on Render.

## Technologies Used

*   **Frontend:** React, Vite
*   **Backend:** Node.js
*   **Database:** MongoDB
*   **Crawling/NLP:** Python, NLTK
*   **Other:** JavaScript

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    ```

4.  **Set up MongoDB:**

    *   Ensure you have MongoDB installed and running.
    *   Create a `.env` file in both the `backend` and `frontend` directories to store your MongoDB connection string and other environment variables.

    ```
    # .env (backend)
    MONGODB_URI=<your_mongodb_connection_string>
    ```

    ```
    # .env (frontend)
    VITE_BACKEND_URL=<your_backend_url> #Example: http://localhost:3000
    ```

5.  **Run the crawler (optional, if you want to regenerate the data):**

    *   Navigate to the `wiki_crawler` directory.
    *   Install the required Python packages.
        ```bash
        cd wiki_crawler
        pip install scrapy nltk
        ```
    *   Run the spiders.  You'll need to adapt the spider execution based on your specific setup (e.g., using `scrapy crawl wikipedia` and `scrapy crawl bbc`).  Refer to the Scrapy documentation for details.

6.  **Run the combiner and indexer (if you ran the crawler):**

    *   Navigate back to the root directory.
    *   Run the combiner: `node combiner.js`
    *   Run the indexer: `python indexer.py`

7.  **Upload data to MongoDB (if you ran the crawler):**

    *   You'll need to write a script (or use a tool like `mongoimport`) to upload `inverted_index.json` and `doc_metadata.json` to MongoDB collections named `inverted_index` and `doc_metadata`, respectively.

8.  **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

9.  **Start the frontend development server:**

    ```bash
    cd frontend
    npm run dev
    ```

## Usage

1.  Open your web browser and navigate to the frontend URL (usually `http://localhost:5173` during development).
2.  Enter your search query in the search bar.
3.  Press Enter or click the search button.
4.  The search results will be displayed, showing the title, URL, and a snippet from each matching document.

## License

MIT License
```