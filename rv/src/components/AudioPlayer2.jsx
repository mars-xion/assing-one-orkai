import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import { useA } from "../hooks/useQuranAPI"; // Import the hooks

const AudioPlayer2 = ({ result, verse_key, recitation_id, ayahKey }) => {
  const {
    data: ayahAudioData,
    error: ayahAudioError,
    isLoading: ayahAudioLoading,
  } = useA(verse_key);
  console.log("vk", verse_key);
  const audio = ayahAudioData?.audio_files?.find(
    (ayah) => ayah.verse_key === result.verse_key
  );
  console.log("audio", audio?.url);
  console.log(`https://verses.quran.com/${audio?.url}`);
  const audioT = `https://verses.quran.com/${audio?.url}`;

  return (
    <div className="w-full max-w-full mx-auto mt-6">
      <ReactAudioPlayer
        src={audio ? `https://verses.quran.com/${audio.url}` : null}
        controls
        className="w-full"
      />
    </div>
  );
};

export default AudioPlayer2;
