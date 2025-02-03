import { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import ReactAudioPlayer from "react-audio-player";
import {
  useSearch,
  useTranslations,
  useChapters,
  useAudioFiles,
  useRecitationAyahs,
} from "../hooks/useQuranAPI";

function Search3() {
  const [recitationId, setRecitationId] = useState(1); // Example recitation ID
  const [chapterNumber, setChapterNumber] = useState(1); // Example chapter number (Surah Al-Fatiha)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState(131);
  const [page, setPage] = useState(1);
  const versesPerPage = 5;

  // Fetch translations
  const { data: translationsData } = useTranslations();

  // Fetch chapters
  const { data: chaptersData } = useChapters();

  // Fetch audio files
  const { data: audioFilesData } = useAudioFiles();

  // Fetch recitations for the given recitationId and chapterNumber
  const {
    data: audioData,
    error: audioerror,
    isLoading: audioIsLoading,
  } = useQuranApi(recitationId, chapterNumber);

  // Fetch search results
  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearch(searchTerm, selectedTranslation, page, versesPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleTranslationChange = (e) => {
    setSelectedTranslation(e.target.value);
  };

  // Prepare chapters map for quick lookup
  const chaptersMap =
    chaptersData?.chapters?.reduce((acc, chapter) => {
      acc[chapter.id] = chapter;
      return acc;
    }, {}) || {};

  // Prepare translations for dropdown
  const translations = translationsData?.translations || [];

  // Function to fetch the audio file URL for each verse
  const getAudioUrlForVerse = (verseKey) => {
    const audioFile = audioFilesData?.audio_files.find(
      (file) => file.verse_key === verseKey
    );
    return audioFile ? `https://verses.quran.com/audio/${audioFile.url}` : null;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-[#1a365d] mb-8">
        Quran Chapters Search
      </h1>

      {/* Search Input */}
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

      {/* Error Message */}
      {error && (
        <p className="text-red-600 font-medium text-center">
          {error.message || "Failed to fetch search results"}
        </p>
      )}

      {/* Total Results */}
      {searchResults?.search?.results?.length > 0 && (
        <p className="text-center font-medium text-gray-600 mb-4">
          Found {searchResults.search.results.length} results for "{searchTerm}"
        </p>
      )}

      {/* Results */}
      {!isLoading && searchResults?.search?.results?.length ? (
        <div className="space-y-6">
          {searchResults.search.results.map((result, index) => {
            // Extract chapter number from verse key
            const chapterNumber = result.verse_key.split(":")[0];
            // Get chapter details
            const chapter = chaptersMap[chapterNumber] || {};

            return (
              <div key={index} className="p-5 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Surah {chapter.name_simple} {result.verse_key}
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* Audio Player */}
                    {result.words.map((word, wordIndex) => {
                      // Construct the full audio URL
                      const audioUrl = `https://verses.quran.com/AbdulBaset/Mujawwad/mp3/${word.audio_url}.mp3`;
                      return (
                        <div key={wordIndex}>
                          <ReactAudioPlayer src={audioUrl} controls />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Highlighted Text */}
                <Highlighter
                  highlightClassName="bg-yellow-200"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={result.text}
                  className="text-2xl font-arabic text-right text-gray-900 leading-relaxed block"
                />

                {/* Translation Dropdown */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Translation
                  </label>
                  <select
                    onChange={handleTranslationChange}
                    value={selectedTranslation}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    {translations.length > 0 ? (
                      translations.map((translation) => (
                        <option key={translation.id} value={translation.id}>
                          {translation.name}
                        </option>
                      ))
                    ) : (
                      <option>No translations available</option>
                    )}
                  </select>
                </div>

                {/* Display Selected Translation */}
                {result.translations?.find(
                  (t) => t.id === selectedTranslation
                ) ? (
                  <Highlighter
                    highlightClassName="bg-yellow-200"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={
                      result.translations.find(
                        (t) => t.id === selectedTranslation
                      ).text
                    }
                    className="mt-4 text-gray-700 text-lg block"
                  />
                ) : (
                  <p className="text-gray-500 mt-2">
                    Translation not available.
                  </p>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {searchResults.search.total_pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-600 text-black rounded-md hover:bg-gray-700 transition-all disabled:opacity-50"
                disabled={page === 1}
              >
                ⬅ Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {searchResults.search.total_pages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.min(prev + 1, searchResults.search.total_pages)
                  )
                }
                className="px-4 py-2 bg-gray-600 text-black rounded-md hover:bg-gray-700 transition-all disabled:opacity-50"
                disabled={page === searchResults.search.total_pages}
              >
                Next ➡
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          {isLoading ? "Searching..." : "No results found"}
        </p>
      )}
    </div>
  );
}

export default Search3;
