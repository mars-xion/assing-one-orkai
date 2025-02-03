import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, isLoading }) => {
  return (
    <form onSubmit={handleSearch} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a verse..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 bg-gray-600 text-black font-medium rounded-md hover:bg-gray-700 disabled:bg-gray-300 transition-all"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
