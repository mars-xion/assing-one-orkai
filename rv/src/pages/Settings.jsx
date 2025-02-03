import { useState } from "react";
import { useRecitations } from "../hooks/useQuranAPI";
import TranslationDropdown from "../components/TranslationDropDown";

function Settings({ setTranslation, setRecitation }) {
  // Fetch recitations data, and handle errors
  const { data: recitations, error: recitationError } = useRecitations();

  // Initialize state variables
  const [selectedTranslation, setSelectedTranslation] = useState(
    localStorage.getItem("preferredTranslation") || "131" // Default to "131" if no value is saved
  );
  const [selectedRecitation, setSelectedRecitation] = useState(
    localStorage.getItem("preferredRecitation") || "1"
  );

  // State to track if the settings were saved
  const [isSaved, setIsSaved] = useState(false);

  // Handle the change in selected translation
  const handleTranslationChange = (e) => {
    const value = e.target.value;
    setSelectedTranslation(value); // Update the selected translation
  };

  // Handle the change in selected recitation
  const handleRecitationChange = (e) => {
    const value = e.target.value;
    setSelectedRecitation(value);
  };

  // Handle the save action
  const handleSave = () => {
    // Save the selected values to localStorage
    localStorage.setItem("preferredTranslation", selectedTranslation);
    localStorage.setItem("preferredRecitation", selectedRecitation);

    // Update the shared state for translation and recitation
    setTranslation(selectedTranslation);
    setRecitation(selectedRecitation);

    // Show confirmation message for 3 seconds
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  if (recitationError) {
    return <div className="text-red-600">Error loading data</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-[#1a365d] mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Translation */}
        <TranslationDropdown
          selectedTranslation={selectedTranslation}
          handleTranslationChange={handleTranslationChange}
          isSettingsPage={true} // This prop helps to customize the label for the settings page
        />

        {/* Recitation Settings */}
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

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-600 text-gray-600 rounded hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>

        {/* Confirmation Message */}
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
