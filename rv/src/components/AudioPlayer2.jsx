import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";
import { useA } from "../hooks/useQuranAPI"; // Import the hooks

const AudioPlayer2 = ({ result, verse_key, recitation_id, ayahKey }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  const {
    data: ayahAudioData,
    error: ayahAudioError,
    isLoading: ayahAudioLoading,
  } = useA(recitation_id);

  useEffect(() => {
    console.log("Data:", ayahAudioData);
    // translationsData.translations[0].text
    console.log("audiofile", ayahAudioData);

    console.log("Verse Key in useEffect:", result.verse_key); // Log to check if it's being passed correctly
    if (ayahAudioLoading) {
      return <div>Loading audio...</div>;
    } else if (ayahAudioError) {
      return <div>Error loading audio</div>;
    } else if (ayahAudioData) {
      const audio = ayahAudioData?.audio_files?.find ? (
        (ayah) => ayah.verse_key === result.verse_key
      ) : (
        <div>not avaliable</div>
      );
      setAudioUrl(audio ? `https://verses.quran.com/${audio.url}` : null);
    }
  }, [ayahAudioData, ayahAudioError, ayahAudioLoading, result.verse_key]);

  return (
    <div className="w-full max-w-full mx-auto mt-6">
      {audioUrl && (
        <ReactAudioPlayer src={audioUrl} controls className="w-full" />
      )}
    </div>
  );
};

export default AudioPlayer2;
