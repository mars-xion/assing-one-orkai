import AyahCard from "./AyahCard";
import Pagination from "./Pagination";

function SearchResults({
  searchResults,
  isLoading,
  searchTerm,
  selectedTranslation,
  setSelectedTranslation,
  page,
  setPage,
  chaptersData,
  translationsData,
}) {
  if (isLoading)
    return <p className="text-center text-gray-600">Searching...</p>;
  if (!searchResults?.search?.results.length)
    return <p className="text-center text-gray-600">No results found</p>;

  return (
    <div className="space-y-6">
      <p className="text-center font-medium text-gray-600 mb-4">
        Found {searchResults.search.results.length} results for "{searchTerm}"
      </p>
      {searchResults.search.results.map((result, index) => (
        <AyahCard
          key={index}
          result={result}
          selectedTranslation={selectedTranslation}
          setSelectedTranslation={setSelectedTranslation}
          chaptersData={chaptersData}
          translationsData={translationsData}
        />
      ))}
      {searchResults.search.total_pages > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={searchResults.search.total_pages}
        />
      )}
    </div>
  );
}

export default SearchResults;
