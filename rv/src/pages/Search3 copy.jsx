import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";

function Search3() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState(131);
  const [chapterAudios, setChapterAudios] = useState({});
  const versesPerPage = 5;

  // Fetch available translations
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(
          "https://api.quran.com/api/v4/translations"
        );
        const data = await response.json();
        setTranslations(data.translations || []);
      } catch (err) {
        console.error("Error fetching translations:", err);
        setError("Failed to load translations.");
      }
    };
    fetchTranslations();
  }, []);

  // Fetch audio for a specific chapter
  const fetchChapterAudio = async (chapterNumber) => {
    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/chapter-audio/1/${chapterNumber}`
      );
      const data = await response.json();

      // Update chapter audios state
      setChapterAudios((prev) => ({
        ...prev,
        [chapterNumber]: data.audio_files[0]?.audio_url,
      }));
    } catch (err) {
      console.error(`Error fetching audio for chapter ${chapterNumber}:`, err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/search?q=${searchTerm}&size=50&translations=${selectedTranslation}`
      );
      const data = await response.json();
      const results = data.search.results || [];
      setSearchResults(results);
      setPage(1);

      // Fetch audio for unique chapters in the results
      const uniqueChapters = [
        ...new Set(results.map((result) => result.verse_key.split(":")[0])),
      ];

      uniqueChapters.forEach(fetchChapterAudio);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (e) => {
    setSelectedTranslation(e.target.value);
  };

  const paginate = (array, pageNumber) => {
    const startIndex = (pageNumber - 1) * versesPerPage;
    return array.slice(startIndex, startIndex + versesPerPage);
  };

  const totalPages = Math.ceil((searchResults?.length || 0) / versesPerPage);
  const paginatedVerses = paginate(searchResults || [], page);

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
            disabled={loading}
            className="px-5 py-3 bg-gray-600 text-black font-medium rounded-md hover:bg-gray-700 disabled:bg-gray-300 transition-all"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Total Results */}
      {searchResults?.length > 0 && (
        <p className="text-center font-medium text-gray-600 mb-4">
          Found {searchResults.length} results for "{searchTerm}"
        </p>
      )}

      {/* Error Message */}
      {error && <p className="text-red-600 font-medium text-center">{error}</p>}

      {/* Results */}
      {loading ? (
        <p className="text-center font-medium text-gray-600">Loading...</p>
      ) : searchResults?.length ? (
        <div className="space-y-6">
          {paginatedVerses.map((result, index) => {
            // Extract chapter number from verse key
            const chapterNumber = result.verse_key.split(":")[0];
            // Get chapter audio URL if available
            const chapterAudioUrl = chapterAudios[chapterNumber];

            return (
              <div key={index} className="p-5 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Surah {result.verse_key}
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* Verse Audio */}
                    <audio
                      controls
                      className="w-32"
                      src={`https://verses.quran.com/audio/wbw/${result.verse_key.replace(
                        ":",
                        "_"
                      )}.mp3`}
                    >
                      Your browser does not support the audio element.
                    </audio>

                    {/* Chapter Audio */}
                    {chapterAudioUrl && (
                      <audio controls className="w-32" src={chapterAudioUrl}>
                        Your browser does not support the audio element.
                      </audio>
                    )}
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
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all disabled:opacity-50"
                disabled={page === 1}
              >
                ⬅ Previous
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all disabled:opacity-50"
                disabled={page === totalPages}
              >
                Next ➡
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">No results found</p>
      )}
    </div>
  );
}

export default Search3;
