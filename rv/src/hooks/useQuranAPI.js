import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const BASE_URL = "https://api.quran.com/api/v4";

export function useTranslations() {
  return useSWR(`${BASE_URL}/resources/translations`, fetcher);
}

export function useRecitations() {
  return useSWR(`${BASE_URL}/resources/recitations`, fetcher);
}

export function useSearch(query, translation, page = 1, perPage = 10) {
  return useSWR(
    query
      ? `${BASE_URL}/search?q=${query}&size=${perPage}&page=${page}&translations=${translation}`
      : null,
    fetcher
  );
}

export function useChapters() {
  return useSWR(`${BASE_URL}/chapters`, fetcher);
}

// Fetch Audio File for Specific Verse Key
export function useAudioFiles(verseKey) {
  const audioFilesUrl = verseKey
    ? `${BASE_URL}/audio_files?verse_key=${verseKey}`
    : null;

  const { data, error } = useSWR(audioFilesUrl, fetcher);

  return {
    data,
    error,
    isLoading: !data && !error,
  };
}
