import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const BASE_URL = "https://api.quran.com/api/v4";

export function useTranslations() {
  return useSWR(`${BASE_URL}/resources/translations`, fetcher);
}

export function useTranslations2(translation_id, verse_key) {
  // Initialize queryParams as an empty array
  let queryParams = [];

  // Construct the query string based on the optional parameters
  if (verse_key) queryParams.push(`verse_key=${verse_key}`);

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  return useSWR(
    translation_id
      ? `${BASE_URL}/quran/translations/${translation_id}${queryString}`
      : null,
    fetcher
  );
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

export function useA(recitation_id, ayah_key) {
  return useSWR(
    query ? `${BASE_URL}/recitations/1/by_ayah/${verse_id}` : null,
    fetcher
  );
}

export function useAyahAudio(recitation_id, ayah_key, verse_key) {
  let queryParams = [];
  if (verse_key) queryParams.push(`verse_key=${verse_key}`);

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  return useSWR(
    recitation_id && ayah_key
      ? `${BASE_URL}/recitations/${recitation_id}${ayah_key}${queryString}`
      : null,
    fetcher
  );
}
