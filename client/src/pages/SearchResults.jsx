import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchBlogs } from '../services/api';
import { Search } from 'lucide-react'; // Import Search icon

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch results whenever the URL query param changes
  useEffect(() => {
    const currentQuery = searchParams.get('query') || '';
    setQuery(currentQuery);
    if (currentQuery.trim() === '') {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await searchBlogs(currentQuery);
        setResults(response.data);
        setError('');
      } catch (err) {
        console.error('Error searching blogs:', err);
        setError('Failed to load search results.');
      }
    };
    fetchResults();
  }, [searchParams]);

  // When user submits a new search, update URL query param to trigger useEffect
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    setSearchParams({ query: query.trim() });
  };

  const handlePostClick = (postId) => {
    navigate(`/blogs/${postId}`);
  };

  return (
    <div className="flex justify-center min-h-screen px-3 py-6 bg-gray-100 sm:px-4 sm:py-10">
      <div className="w-full max-w-5xl p-4 bg-white rounded-lg sm:p-6">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-md sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 p-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <h2 className="mb-4 text-xl font-bold sm:text-2xl sm:mb-6">
          Search Results for: "{query}"
        </h2>

        {error && <p className="mb-3 text-sm text-red-500 sm:mb-4 sm:text-base">{error}</p>}

        {results.length > 0 ? (
          <div className="space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {results.map((post) => (
              <div
                key={post._id}
                onClick={() => handlePostClick(post._id)}
                className="px-4 py-3 transition duration-200 bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer sm:px-6 sm:py-5 sm:hover:shadow-lg sm:hover:bg-gray-50"
              >
                <h4 className="mb-1 text-xl font-semibold text-gray-800 sm:text-2xl sm:mb-2">
                  {post.title}
                </h4>
                <div
                  className="text-sm leading-relaxed text-gray-700 sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: post.content.substring(0, 160) + '...',
                  }}
                />
                <p className="mt-2 text-xs text-gray-500 sm:text-sm sm:mt-3">
                  Posted by {post.author?.username || 'Unknown'} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 sm:text-base">No matching posts found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;