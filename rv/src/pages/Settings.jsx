// Settings.js
import { useState } from "react";
import { useTranslations, useRecitations } from "../hooks/useQuranAPI"; // import the hooks

function Settings({ setTranslation, setRecitation }) {
  const { data: translations, error: translationError } = useTranslations();
  const { data: recitations, error: recitationError } = useRecitations();
  const [selectedTranslation, setSelectedTranslation] = useState(
    localStorage.getItem("preferredTranslation") || "131"
  );
  const [selectedRecitation, setSelectedRecitation] = useState(
    localStorage.getItem("preferredRecitation") || "1"
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleTranslationChange = (e) => {
    const value = e.target.value;
    setSelectedTranslation(value);
  };

  const handleRecitationChange = (e) => {
    const value = e.target.value;
    setSelectedRecitation(value);
  };

  const handleSave = () => {
    localStorage.setItem("preferredTranslation", selectedTranslation);
    localStorage.setItem("preferredRecitation", selectedRecitation);
    setTranslation(selectedTranslation); // Update the shared state
    setRecitation(selectedRecitation); // Update the shared state
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  if (translationError || recitationError) {
    return <div className="text-red-600">Error loading data</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-[#1a365d] mb-8">Settings</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Translation</h2>
          <select
            value={selectedTranslation}
            onChange={handleTranslationChange}
            className="w-full border p-2 rounded"
          >
            {translations ? (
              translations.translations.map((translation) => (
                <option key={translation.id} value={translation.id}>
                  {translation.name} ({translation.language_name})
                </option>
              ))
            ) : (
              <option>No translations available</option>
            )}
          </select>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Recitation</h2>
          <select
            value={selectedRecitation}
            onChange={handleRecitationChange}
            className="w-full border p-2 rounded"
          >
            {recitations ? (
              recitations.recitations.map((recitation) => (
                <option key={recitation.id} value={recitation.id}>
                  {recitation.reciter_name}
                </option>
              ))
            ) : (
              <option>No recitations available</option>
            )}
          </select>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>

        {isSaved && (
          <div className="mt-4 text-green-600">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
