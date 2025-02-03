import React from "react";
import Highlighter from "react-highlight-words";

const AyahDetails = ({ result, chapter, searchTerm }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-500">
          Surah {chapter.name_simple} {result.verse_key}
        </span>
      </div>

      <Highlighter
        highlightClassName="bg-yellow-200"
        searchWords={[searchTerm]}
        autoEscape={true}
        textToHighlight={result.text}
        className="text-2xl font-arabic text-right text-gray-900 leading-relaxed block"
      />
    </div>
  );
};

export default AyahDetails;
