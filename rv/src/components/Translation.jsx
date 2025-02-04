import React, { useState, useEffect } from "react";
import { useTranslations2, useSearch } from "../hooks/useQuranAPI"; // Import the hooks

const Translation = ({ result, selectedTranslation, verse_key }) => {
  const [translationText, setTranslationText] = useState("");

  // Get translations data from the useTranslations hook
  const {
    data: translationsData,
    error: translationsError,
    isLoading: translationIsLoading,
  } = useTranslations2(
    selectedTranslation, // Pass translation_id
    verse_key
  );

  // Use useSearch hook to fetch verse translation
  const { data: searchData } = useSearch(result.verse_key, selectedTranslation); // Pass verse_key and selectedTranslation ID

  useEffect(() => {
    console.log(translationsData);
    console.log("Verse Key in useEffect:", result.verse_key); // Log to check if it's being passed correctly

    if (!result.verse_key) {
      console.error("Verse key is missing!");
      return; // Return early if there's no verseKey
    }

    if (translationIsLoading) {
      setTranslationText("Loading translation...");
      return;
    } else if (translationsError) {
      setTranslationText("Error fetching translation.");
      return;
    } else if (translationsData) {
      // Log the translations data for debugging
      console.log(translationsData);
      console.log("Verse Key:", verse_key);
      console.log("Selected Translation:", selectedTranslation);

      // Find the translation for the given verse_key and selectedTranslation
      const translation = translationsData?.translations?.find(
        (t) => t.verse_key === result.verse_key //&&
        //t.resource_id === parseInt(selectedTranslation)
      );
      const translationt = translationsData.translations[0].text;

      setTranslationText(
        translation ? translation.text : "Translation not available"
      );
      console.log(translationt);
      setTranslationText(translationt);
    }
  }, [
    searchData,
    translationsData,
    translationsError,
    translationIsLoading,
    result.verse_key,
    selectedTranslation,
  ]); // Re-fetch when data or selectedTranslation changes

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Translation:</h3>
      <p>{translationText}</p>
    </div>
  );
};

export default Translation;
