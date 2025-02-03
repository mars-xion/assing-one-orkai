import React, { useState, useEffect } from "react";
import { useTranslations } from "../hooks/useQuranAPI";

const TranslationDropdown = ({
  selectedTranslation,
  handleTranslationChange,
  isSettingsPage,
}) => {
  const { data: translationsData, error: translationError } = useTranslations();
  const [translations, setTranslations] = useState([]);

  // Update translations when data is fetched
  useEffect(() => {
    if (translationsData) {
      setTranslations(translationsData.translations); // Set translations data once it's fetched
    }
  }, [translationsData]);

  if (translationError) {
    return <div className="text-red-600">Error loading translations</div>;
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {isSettingsPage
          ? "Select Translation for Settings"
          : "Select Translation"}
      </label>
      <select
        onChange={handleTranslationChange}
        value={selectedTranslation}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
      >
        {translations.length > 0 ? (
          translations.map((translation) => (
            <option key={translation.id} value={translation.id}>
              {translation.language_name} ({translation.name})
            </option>
          ))
        ) : (
          <option>No translations available</option>
        )}
      </select>
    </div>
  );
};

export default TranslationDropdown;
