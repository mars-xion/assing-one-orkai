// pages/Search.jsx
import { useState } from "react";
import useSWR from "swr";

function Search2() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/search?q=${searchTerm}&size=20`
      );
      const data = await response.json();
      console.log("Search results:", data); // Debug log
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-[#1a365d] mb-8">Search Quran</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search verses..."
            className="flex-1 border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {isSearching ? (
        <p>Loading...</p>
      ) : searchResults ? (
        <div className="space-y-4">
          {searchResults.search?.results?.map((result, index) => (
            <div key={index} className="border p-4 rounded bg-white shadow">
              <p className="text-lg mb-2 font-arabic">{result.text}</p>
              <p className="text-sm text-gray-600">
                Chapter {result.verse_key}
              </p>
              {result.translations && result.translations[0] && (
                <p className="mt-2 text-gray-700">
                  {result.translations[0].text}
                </p>
              )}
            </div>
          ))}
          {searchResults.search?.total_results === 0 && <p>No results found</p>}
        </div>
      ) : (
        <p className="text-gray-600">
          Enter your search terms above to find verses
        </p>
      )}

      {/* Debug section */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p>Debug Info:</p>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(searchResults, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default Search2;
