import React, { useState } from 'react';
import './SearchEngine.css';
import axios from 'axios';

const SearchEngine = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
   const [hasSearched, setHasSearched] = useState(false);

  const handleSearch =async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true); 
    try {
      const response = await axios.post('http://localhost:5000/search', {query});
      // console.log(response);
      setResults(response.data.results)
      setIsLoading(false)
    

  } catch (err) {
    console.error(err);
  }
    
  };

  return (
    <div className="search-app">
      <div className="search-container">
        <h1 className="search-title">Kumar Engine</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the web..."
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <div className="search-spinner"></div>
              ) : (
                <svg className="search-icon" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              )}
            </button>
          </div>
        </form>

        <div className="search-results">
  {isLoading ? (
    <div className="loading-indicator">
      <div className="spinner"></div>
      <p>Searching the web...</p>
    </div>
  ) : results.length > 0 ? (
    <>
      <div className="results-stats">{results.length} results found</div>
      {results.map((result) => (
        <div key={result.docId} className="result-item">
          <div className="result-content">
            <a href={result.url} className="result-url">{result.url}</a>
            <h3 className="result-title">
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </h3>
            <p className="result-description">{result.snippet}</p>
            <div className="result-meta">
              <span className="link-count">{result.links_count} links</span>
            </div>
            <div className="result-meta">
              <span className="link-count">Score: {result.score}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  ) : (
            hasSearched && (
              <div className="no-results">
                <p>No results found for your search.</p>
              </div>
            ))}
</div>

      </div>
    </div>
  );
};

export default SearchEngine;