import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useChapters } from "../hooks/useQuranAPI";

function Search() {
  //const [searchInput, setSearchInput] = useState("");
  const [filteredChapters, setFilteredChapters] = useState([]);
  const { data: chaptersData } = useChapters();
  const { translation, recitation } = useLocation();
  const [searchParams, setSearchParams] = useState({
    surahNumber: "",
    verseNumber: "",
    chapterSearch: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState(131);
  const [translations, setTranslations] = useState([]);
  const versesPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    if (chaptersData?.chapters) {
      setFilteredChapters(chaptersData.chapters);
    }

    const fetchTranslations = async () => {
      try {
        const response = await fetch(
          "https://api.quran.com/api/v4/translations"
        );
        const data = await response.json();
        setTranslations(data.translations || []); // Ensure we have an empty array if no translations
      } catch (err) {
        console.error("Error fetching translations:", err);
        setError("Failed to load translations. Please try again.");
      }
    };

    fetchTranslations();
  }, [searchParams.chapterSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTranslationChange = (e) => {
    const value = e.target.value;
    setSelectedTranslation(value);
  };

  // Remove hyphens and spaces
  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[-\s]+/g, "");
  };

  const handleChapterSearchChange = (e) => {
    const value = e.target.value; // Get the latest input value
    setSearchParams((prev) => ({ ...prev, chapterSearch: value })); // Update state

    if (!value.trim()) {
      setFilteredChapters(chaptersData?.chapters || []);
      return;
    }

    const isArabic = /[\u0600-\u06FF]/.test(value); // Check if the input contains Arabic characters
    const normalizedInput = normalizeText(value);

    const filtered = chaptersData?.chapters.filter((chapter) => {
      const normalizedEnglish = normalizeText(chapter.name_complex);
      const normalizedArabic = normalizeText(chapter.name_arabic);

      return isArabic
        ? normalizedArabic.includes(normalizedInput) // Search in Arabic name
        : normalizedEnglish.includes(normalizedInput); // Search in English name
    });

    setFilteredChapters(filtered);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setPage(1);

    const surah = parseInt(searchParams.surahNumber);
    const verse = parseInt(searchParams.verseNumber);
    const chapter = searchParams.chapterSearch.trim().toLowerCase();

    if (chapter) {
      // Fetch results by chapter name or number
      const chapterData = chapters.find(
        (ch) =>
          ch.name_complex.toLowerCase().includes(chapter) ||
          ch.id === parseInt(chapter)
      );
      if (!chapterData) {
        setError("Chapter not found");
        return;
      }
      const chapterKey = chapterData.id;
      setLoading(true);
      try {
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${chapterKey}?translations=${selectedTranslation}&language=en&recitation=${recitation}`;
        const response = await fetch(url);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Failed to fetch verses. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }
    // Search by surah and verse logic
    if (!surah || surah < 1 || surah > 114) {
      setError("Please enter a valid surah number (1-114)");
      return;
    }

    if (verse && (verse < 1 || verse > 286)) {
      setError("Please enter a valid verse number.");
      return;
    }

    const verseKey = verse ? `${surah}:${verse}` : null;

    setLoading(true);
    try {
      const url = verse
        ? `https://api.quran.com/api/v4/verses/by_key/${verseKey}?translations=${selectedTranslation}&language=en&recitation=${recitation}`
        : `https://api.quran.com/api/v4/verses/by_chapter/${surah}?translations=${selectedTranslation}&language=en&recitation=${recitation}`;

      const response = await fetch(url);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to fetch verses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paginate = (array, pageNumber) => {
    const startIndex = (pageNumber - 1) * versesPerPage;
    return array.slice(startIndex, startIndex + versesPerPage);
  };

  const totalPages = Math.ceil(
    (results?.pagination?.total_records || 0) / versesPerPage
  );
  const paginatedVerses = paginate(results?.verses || [], page);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Search</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Chapter Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search for a Chapter (English or Arabic)
              </label>

              <input
                type="text"
                value={searchParams.chapterSearch}
                onChange={handleChapterSearchChange}
                className="w-full p-2 border rounded"
                placeholder="Enter chapter name (e.g., Al-Fatihah or الفاتحة)"
                dir="auto" // Automatically adjusts direction based on input
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surah Number (1-114)
              </label>
              <input
                type="number"
                value={searchParams.surahNumber}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    surahNumber: e.target.value,
                  }))
                }
                min="1"
                max="114"
                className="w-full p-2 border rounded"
                placeholder="Enter surah number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verse Number (optional)
              </label>
              <input
                type="number"
                value={searchParams.verseNumber}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    verseNumber: e.target.value,
                  }))
                }
                min="1"
                className="w-full p-2 border rounded"
                placeholder="Enter verse number (optional)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>

      {results && (results.verse || results.verses?.length > 0) ? (
        <div className="space-y-6 mb-6">
          {results?.verses?.length > 0 && (
            <div className="text-gray-600 mb-4">
              <span>{results?.pagination?.total_records} verses found</span>
            </div>
          )}

          {results.verse ? (
            <div
              key={results.verse.id}
              className="bg-white p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-gray-600">
                  Surah {results.verse.chapter_id}, Verse{" "}
                  {results.verse.verse_key}
                </span>
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  ▶ Play
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Translation
                </label>
                <select
                  onChange={handleTranslationChange}
                  value={selectedTranslation}
                  className="w-full p-2 border rounded"
                >
                  {Array.isArray(translations) &&
                    translations.map((translation) => (
                      <option key={translation.id} value={translation.id}>
                        {translation.name}
                      </option>
                    ))}
                </select>
              </div>

              {selectedTranslation && (
                <p className="text-gray-700 mt-4">
                  {
                    results.verse.translations?.find(
                      (t) => t.id === selectedTranslation
                    )?.text
                  }
                </p>
              )}
            </div>
          ) : (
            paginatedVerses.map((verse) => (
              <div key={verse.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-gray-600">
                    Surah {verse.chapter_id}, Verse {verse.verse_key}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    ▶ Play
                  </button>
                </div>

                <p className="text-2xl mb-4 font-arabic text-right" dir="rtl">
                  {verse.text_uthmani_simple}
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Translation
                  </label>
                  <select
                    onChange={handleTranslationChange}
                    value={selectedTranslation}
                    className="w-full p-2 border rounded"
                  >
                    {translations ? (
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

                {selectedTranslation && (
                  <p className="text-gray-700 mt-4">
                    {
                      verse.translations?.find(
                        (t) => t.id === selectedTranslation
                      )?.text
                    }
                  </p>
                )}
              </div>
            ))
          )}

          {results.verses?.length > versesPerPage && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="self-center text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-600">No verses found</div>
      )}
    </div>
  );
}

export default Search;
