import React, { useState, useEffect } from 'react';

const SearchEngine = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [searchTime, setSearchTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
const resultsPerPage = 10;


  // Mock search function for demonstration
  const mockResults = {
  "react tutorials": [
    {
      docId: 1,
      url: "https://reactjs.org",
      title: "React – A JavaScript library for building user interfaces",
      snippet: "React makes it painless to create interactive UIs...",
      links_count: 45,
      score: 0.95,
    },
    {
      docId: 2,
      url: "https://create-react-app.dev",
      title: "Create React App",
      snippet: "Set up a modern web app by running one command...",
      links_count: 23,
      score: 0.87,
    },
  ],
  "node.js": [
    {
      docId: 3,
      url: "https://nodejs.org",
      title: "Node.js",
      snippet: "Node.js® is a JavaScript runtime built on Chrome's V8...",
      links_count: 40,
      score: 0.91,
    },
  ],
  "python basics": [
    {
      docId: 4,
      url: "https://docs.python.org/3/tutorial/",
      title: "Python 3 Tutorial — Python Docs",
      snippet: "This tutorial introduces the reader informally to the basic concepts...",
      links_count: 30,
      score: 0.88,
    },
  ],
};

const handleSearch = async (e) => {
  e.preventDefault();
  if (!query.trim()) return;

  setIsLoading(true);
  setCurrentPage(1); // reset to first page on new search

  setHasSearched(true);
  const startTime = Date.now();

  const normalizedQuery = query.toLowerCase().trim();

  if (mockResults[normalizedQuery]) {
    // Use mock results
    setTimeout(() => {
      setResults(mockResults[normalizedQuery]);
      setSearchTime((Date.now() - startTime) / 1000);
      setIsLoading(false);
    }, 700); // Simulated delay
  } else {
    // Fallback to real API
    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      // console.log(data)
      setResults(data.results.slice(0, 100)); // Only top 100 results
      setSuggestion(data.suggestion)
      setSearchTime((Date.now() - startTime) / 1000);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }
};


  const popularSearches = [
    'React tutorials', 'JavaScript ES6', 'CSS Grid', 'Node.js', 'Python basics',
    'Machine Learning', 'Web Development', 'API integration'
  ];

  const handlePopularSearch = (searchTerm) => {
    setQuery(searchTerm);
    handleSearch({ preventDefault: () => {} });
  };
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <a href="/">Kumar Engine</a>
                
              </h1>
            </div>
            {/* <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Images</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Videos</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">News</a>
            </nav> */}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Section */}
        <div className={`transition-all duration-500 ${hasSearched ? 'pt-8' : 'pt-20'}`}>
          {!hasSearched && (
            <div className="text-center mb-12 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-4">
                Search the web with <span className="font-semibold text-blue-600">Kumar Engine</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Discover information, find answers, explore the internet
              </p>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="w-full px-6 py-4 text-md md:text-lg border-2 border-gray-200 rounded-full 
                           focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100
                           shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm
                           hover:shadow-xl"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !query.trim()}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-full hover:from-blue-700 hover:to-purple-700 
                           focus:outline-none focus:ring-4 focus:ring-blue-100
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 flex items-center space-x-2
                           shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          {!hasSearched && (
            <div className="text-center mb-12 animate-fade-in-up">
              <p className="text-gray-600 mb-4">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(search)}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full 
                             text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700
                             transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="pb-12">
          {/* Did you mean suggestion */}
          {suggestion && suggestion !== query && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                Did you mean:{" "}
                <button
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-800 underline"
                >
                  {suggestion}
                </button>
                ?
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center space-x-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xl text-gray-600">Searching the web...</div>
              </div>
              <div className="mt-4">
                <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          

          {!isLoading && results.length > 0 && (
            <div className="animate-fade-in">
              <div className="mb-6 text-sm text-gray-600">
                About {results.length} results ({searchTime.toFixed(2)} seconds)
              </div>
              <div className="space-y-6">
                {paginatedResults.map((result, index) => (
                  <div 
                    key={result.docId} 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md 
                             transition-all duration-200 border border-gray-100 hover:border-blue-200
                             animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 ">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Score: {Math.floor(result.score * 10000) / 10000}

                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {result.links_count} links
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium ">
                      <a
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                      >
                        {result.title}
                      </a>
                    </h3>
                    <a 
                        href={result.url} 
                        className="text-xs sm:text-sm text-green-700 hover:text-green-800 break-all"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {result.url}
                      </a>
                    <p className="text-sm sm:text-base md:text-md text-gray-700 leading-relaxed">
                      {result.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {!isLoading &&totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap mb-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-full border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-full border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}


          {/* No Results */}
          {!isLoading && hasSearched && results.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-800 mb-4">No results found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any results for "<strong>{query}</strong>". 
                Try different keywords or check your spelling.
              </p>
              <div className="space-y-4">
                <div className="text-left max-w-md mx-auto">
                  <h4 className="font-semibold text-gray-800 mb-2">Search tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your spelling and try again</li>
                    <li>• Try more general keywords</li>
                    <li>• Use fewer keywords</li>
                    <li>• Try synonyms or related terms</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setQuery('');
                    setHasSearched(false);
                    setResults([]);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 
                           transition-colors shadow-md hover:shadow-lg"
                >
                  Start New Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; Built by Aditya Kumar Sharma.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default SearchEngine;