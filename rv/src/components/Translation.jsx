import React, { useState, useEffect } from "react";
import { useTranslations, useSearch } from "../hooks/useQuranAPI"; // Import the hooks

const Translation = ({ result, selectedTranslation }) => {
  const [translationText, setTranslationText] = useState("");

  // Get translations data from the useTranslations hook
  //const { data: translationsData, error: translationsError } =
  //useTranslations();

  // Use useSearch hook to fetch verse translation
  const { data, error, isLoading } = useSearch(
    result.verse_key,
    selectedTranslation
  ); // Pass verse_key and selectedTranslation ID

  // Fetch the translation text when selectedTranslation or result changes
  /* useEffect(() => {
    const fetchTranslation = async () => {
      if (!translationsData) return; // Wait for translations data to be available

      try {
        // Find the translation from the data using the selectedTranslation ID
        const translation = translationsData.translations?.find(
          (t) => t.id === parseInt(selectedTranslation)
        );

        if (!translation) {
          setTranslationText("Translation not found.");
          return;
        }

        const verseKey = result.verse_key; // e.g., "1:1"
        const translationId = selectedTranslation; // Selected translation ID
        const { data } = await useSearch(verseKey, translationId); // Fetch the verse translation using useSearch

        // Find the specific translation text
        const selectedTranslationText = data?.verse?.translations?.find(
          (t) => t.resource_id === parseInt(selectedTranslation)
        );

        if (selectedTranslationText) {
          setTranslationText(selectedTranslationText.text); // Set the translation text
        } else {
          setTranslationText("Translation not available.");
        }
      } catch (error) {
        console.error("Error fetching translation:", error);
        setTranslationText("Error fetching translation");
      }
    };

    fetchTranslation();
  }, [selectedTranslation, result, translationsData]); // Re-fetch when selectedTranslation, result, or translationsData changes
*/

  useEffect(() => {
    if (isLoading) {
      setTranslationText("Loading translation...");
    } else if (error) {
      setTranslationText("Error fetching translation");
    } else if (data) {
      // Extract the translation text based on the selected translation ID
      const translation = data.verse.translations?.find(
        (t) => t.resource_id === parseInt(selectedTranslation)
      );

      if (translation) {
        setTranslationText(translation.text); // Set the translation text
      } else {
        setTranslationText("Translation not available");
      }
    }
  }, [data, error, isLoading, result.verse_key, selectedTranslation]); // Re-fetch when data or selectedTranslation changes

  // Handle errors in fetching translations
  /*if (translationsError) {
    return <div>Error loading translations</div>;
  }*/

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Translation:</h3>
      <p>{translationText}</p>
    </div>
  );
};

export default Translation;
