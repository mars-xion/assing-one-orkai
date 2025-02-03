import React from "react";
import ReactAudioPlayer from "react-audio-player";

const AudioPlayer = ({ verseKey }) => {
  // Function to create the key URL for each verse
  function convertToVN(verseKey) {
    // Split the verse_key by ':'
    const [surah, verse] = verseKey.split(":");

    // Format surah and verse to ensure they're 3 digits long
    const formattedSurah = surah.padStart(3, "0");
    const formattedVerse = verse.padStart(3, "0");

    // Combine formatted surah and verse to create vn
    return `${formattedSurah}${formattedVerse}`;
  }
  const vn = convertToVN(verseKey); // Function from the parent to generate verse number
  const audioUrl = `https://verses.quran.com/AbdulBaset/Mujawwad/mp3/${vn}.mp3`;

  return (
    <div className="w-full max-w-full mx-auto mt-6">
      <ReactAudioPlayer src={audioUrl} controls className="w-full" />
    </div>
  );
};

export default AudioPlayer;
