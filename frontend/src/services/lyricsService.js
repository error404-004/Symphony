/**
 * lyricsService.js
 *
 * High-performance lyrics service powered by LRCLIB (https://lrclib.net).
 *
 * Features:
 *  - Smart track title & artist cleaning (strips "(feat. ...)", "[Official Audio]", "- Title Track", etc.).
 *  - Multi-tiered lookup strategy (Exact Get -> Clean Exact Get -> Search by Clean Query -> Search by Track Name).
 *  - Prioritizes synced lyrics over plain lyrics.
 *  - In-memory caching per track key.
 *  - Script normalization: converts any Gurmukhi/Punjabi Unicode characters into Hindi Devanagari script.
 */

import { parseLRC } from '../utils/parseLRC';

const LRCLIB_BASE = 'https://lrclib.net/api';
const cache = new Map();

/**
 * Strips common YouTube/Music noise from track titles (e.g. "(feat. ...)", "[Official Audio]", "- Title Track")
 */
function cleanTrackName(track) {
  if (!track) return '';
  return track
    .replace(/\s*[\(\[](feat|ft|official|lyric|audio|from|title track|sped up|slowed|remix|version|video)[^\]\)]*[\)\]]/gi, '')
    .replace(/\s*-\s*title track.*/gi, '')
    .replace(/\s*-\s*official.*/gi, '')
    .replace(/\|.*/, '')
    .replace(/\b(feat|ft)\b.*/gi, '')
    .trim();
}

/**
 * Extracts primary artist name
 */
function cleanArtistName(artist) {
  if (!artist) return '';
  return artist
    .split(/[,&;]|\b(feat|ft|with)\b/i)[0]
    .replace(/topic/gi, '')
    .trim();
}

/**
 * Converts any Gurmukhi script characters to Devanagari (Hindi) script
 */
function fixScript(text) {
  if (!text) return text;
  return text.replace(/[\u0A00-\u0A7F]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code === 0x0A70) return '\u0902'; // Tippi -> Anusvara
    if (code === 0x0A71) return '';       // Addak -> remove
    return String.fromCharCode(code - 0x0100);
  });
}

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

async function fetchSearchQuery(query) {
  if (!query || !query.trim()) return null;
  const params = new URLSearchParams({ q: query.trim() });
  const res = await fetch(`${LRCLIB_BASE}/search?${params.toString()}`);
  if (!res.ok) return null;

  const results = await res.json();
  if (!Array.isArray(results) || !results.length) return null;

  // Prefer entries with syncedLyrics over plainLyrics
  const syncedMatch = results.find((r) => r.syncedLyrics && r.syncedLyrics.trim().length > 0);
  if (syncedMatch) return syncedMatch;

  const plainMatch = results.find((r) => r.plainLyrics && r.plainLyrics.trim().length > 0);
  return plainMatch || results[0];
}

/**
 * Fetches lyrics with multi-tiered fallback strategy.
 */
export async function getLyrics({ trackName, artistName, albumName, duration }) {
  if (!trackName) return null;

  const key = cacheKey({ trackName, artistName, albumName, duration });
  if (cache.has(key)) return cache.get(key);

  const cleanedTrack = cleanTrackName(trackName);
  const cleanedArtist = cleanArtistName(artistName);

  let data = null;

  // Tier 1: Exact match with raw track & artist
  if (artistName) {
    try {
      data = await fetchExactMatch({ trackName, artistName, albumName, duration });
    } catch {
      data = null;
    }
  }

  // Tier 2: Exact match with cleaned track & cleaned artist
  if ((!data || (!data.syncedLyrics && !data.plainLyrics)) && cleanedTrack && cleanedArtist) {
    try {
      data = await fetchExactMatch({ trackName: cleanedTrack, artistName: cleanedArtist, duration });
    } catch {
      data = null;
    }
  }

  // Tier 3: Search with clean track + clean artist
  if ((!data || (!data.syncedLyrics && !data.plainLyrics)) && cleanedTrack) {
    try {
      data = await fetchSearchQuery(`${cleanedTrack} ${cleanedArtist}`);
    } catch {
      data = null;
    }
  }

  // Tier 4: Search with clean track title only
  if ((!data || (!data.syncedLyrics && !data.plainLyrics)) && cleanedTrack) {
    try {
      data = await fetchSearchQuery(cleanedTrack);
    } catch {
      data = null;
    }
  }

  // Tier 5: Search with raw track title
  if ((!data || (!data.syncedLyrics && !data.plainLyrics)) && trackName !== cleanedTrack) {
    try {
      data = await fetchSearchQuery(trackName);
    } catch {
      data = null;
    }
  }

  if (!data || (!data.syncedLyrics && !data.plainLyrics)) {
    cache.set(key, null);
    return null;
  }

  const rawSynced = data.syncedLyrics ? parseLRC(data.syncedLyrics) : null;
  const rawPlain = data.plainLyrics || null;

  const synced = rawSynced
    ? rawSynced.map((item) => ({ ...item, text: fixScript(item.text) }))
    : null;
  const plain = rawPlain ? fixScript(rawPlain) : null;

  const result = { synced, plain };

  cache.set(key, result);
  return result;
}

export default { getLyrics };