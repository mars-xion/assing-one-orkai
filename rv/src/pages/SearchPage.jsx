import React, { useState } from "react";
import {
  useSearch,
  useTranslations,
  useChapters,
  useAudioFiles,
} from "../hooks/useQuranAPI";
import SearchBar from "../components/SearchBar";
import AyahCard from "../components/AyahCard";
import Pagination from "../components/Pagination";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState(131);
  const [page, setPage] = useState(1);
  const versesPerPage = 5;

  const { data: translationsData } = useTranslations();
  const { data: chaptersData } = useChapters();
  const { data: audioFilesData } = useAudioFiles();

  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearch(searchTerm, selectedTranslation, page, versesPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const chaptersMap =
    chaptersData?.chapters?.reduce((acc, chapter) => {
      acc[chapter.id] = chapter;
      return acc;
    }, {}) || {};

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-[#1a365d] mb-8">
        Quran Chapters Search
      </h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />

      {error && (
        <p className="text-red-600 font-medium text-center">
          {error.message || "Failed to fetch search results"}
        </p>
      )}

      {searchResults?.search?.results?.length > 0 && (
        <p className="text-center font-medium text-gray-600 mb-4">
          Found {searchResults.search.results.length} results for "{searchTerm}"
        </p>
      )}

      {!isLoading && searchResults?.search?.results?.length ? (
        <div className="space-y-6">
          {searchResults.search.results.map((result, index) => {
            const chapterNumber = result.verse_key.split(":")[0];
            const chapter = chaptersMap[chapterNumber] || {};

            return (
              <AyahCard
                key={index}
                result={result}
                chapter={chapter}
                searchTerm={searchTerm}
                selectedTranslation={selectedTranslation}
                setSelectedTranslation={setSelectedTranslation}
              />
            );
          })}
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={searchResults.search.total_pages}
          />
        </div>
      ) : (
        <p className="text-center text-gray-600">
          {isLoading ? "Searching..." : "No results found"}
        </p>
      )}
    </div>
  );
};

export default SearchPage;
