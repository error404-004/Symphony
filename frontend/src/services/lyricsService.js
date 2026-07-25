/**
 * lyricsService.js
 *
 * Fetches lyrics for a track from the LRCLIB API (https://lrclib.net).
 * Tries an exact match first (track + artist + album + duration), then
 * falls back to a fuzzy search if no exact match is found. Results are
 * cached in memory per track to avoid refetching on repeat plays.
 */

import { parseLRC } from '../utils/parseLRC';

const LRCLIB_BASE = 'https://lrclib.net/api';
const cache = new Map();

function cacheKey({ trackName, artistName, albumName, duration }) {
  return [trackName, artistName, albumName, duration]
    .map((v) => (v ?? '').toString().toLowerCase().trim())
    .join('::');
}

async function fetchExactMatch({ trackName, artistName, albumName, duration }) {
  const params = new URLSearchParams({
    track_name: trackName,
    artist_name: artistName,
  });
  if (albumName) params.set('album_name', albumName);
  if (duration) params.set('duration', String(Math.round(duration)));

  const res = await fetch(`${LRCLIB_BASE}/get?${params.toString()}`);
  if (!res.ok) return null;
  return res.json();
}

async function fetchBestSearchMatch({ trackName, artistName }) {
  const params = new URLSearchParams({
    track_name: trackName,
    artist_name: artistName,
  });

  const res = await fetch(`${LRCLIB_BASE}/search?${params.toString()}`);
  if (!res.ok) return null;

  const results = await res.json();
  return Array.isArray(results) && results.length ? results[0] : null;
}

/**
 * @param {Object} track
 * @param {string} track.trackName
 * @param {string} track.artistName
 * @param {string} [track.albumName]
 * @param {number} [track.duration] Track duration in seconds
 * @returns {Promise<{ synced: {time:number,text:string}[] | null, plain: string | null } | null>}
 *   `null` when no lyrics could be found for the track.
 */
export async function getLyrics({ trackName, artistName, albumName, duration }) {
  if (!trackName || !artistName) return null;

  const key = cacheKey({ trackName, artistName, albumName, duration });
  if (cache.has(key)) return cache.get(key);

  let data = null;

  try {
    data = await fetchExactMatch({ trackName, artistName, albumName, duration });
  } catch {
    data = null;
  }

  if (!data) {
    try {
      data = await fetchBestSearchMatch({ trackName, artistName });
    } catch {
      data = null;
    }
  }

  if (!data || (!data.syncedLyrics && !data.plainLyrics)) {
    cache.set(key, null);
    return null;
  }

  const result = {
    synced: data.syncedLyrics ? parseLRC(data.syncedLyrics) : null,
    plain: data.plainLyrics || null,
  };

  cache.set(key, result);
  return result;
}

export default { getLyrics };