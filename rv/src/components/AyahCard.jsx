import React, { useState, useEffect } from "react";
import AudioPlayer2 from "./AudioPlayer2";
import AyahDetails from "./AyahDetails";
import TranslationDropdown from "../components/TranslationDropDown";
import Translation from "./Translation"; // Import the Translation component

const AyahCard = ({ result, chapter, searchTerm }) => {
  // Define selectedTranslation state here
  const [selectedTranslation, setSelectedTranslation] = useState("131"); // Default translation ID

  // Handle the change in selected translation
  const handleTranslationChange = (e) => {
    const value = e.target.value;
    setSelectedTranslation(value); // Update the selected translation
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <AyahDetails result={result} chapter={chapter} searchTerm={searchTerm} />
      <AudioPlayer2
        verse_key={result.verse_key}
        result={result}
        chapter={chapter}
        searchTerm={searchTerm}
      />
      {/* Translation Dropdown */}
      <TranslationDropdown
        selectedTranslation={selectedTranslation}
        handleTranslationChange={handleTranslationChange}
      />

      {/* Display Translation */}
      <Translation
        verse_key={result.verse_key}
        result={result}
        chapter={chapter}
        searchTerm={searchTerm}
        selectedTranslation={selectedTranslation}
        handleTranslationChange={handleTranslationChange}
      />
    </div>
  );
};

export default AyahCard;
