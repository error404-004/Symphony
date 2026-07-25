/**
 * parseLRC.js
 *
 * Parses standard LRC-formatted synced lyrics into a sorted array of
 * { time, text } objects, where `time` is in seconds.
 *
 * Supports:
 *  - [mm:ss.xx] and [mm:ss.xxx] timestamps
 *  - Multiple timestamps stacked on a single line (e.g. duplicated hooks)
 *  - Metadata tags ([ar:], [ti:], [al:], [au:], [by:], [length:], [offset:], etc.)
 *    which are ignored rather than treated as lyric lines
 */

const TIME_TAG = /\[(\d{1,3}):(\d{2}(?:\.\d{1,3})?)\]/g;
const METADATA_TAG = /^\[(ar|ti|al|au|by|length|offset|re|ve)\s*:/i;

/**
 * @param {string} lrcText Raw LRC file contents
 * @returns {{ time: number, text: string }[]} Lyric lines sorted by time
 */
export function parseLRC(lrcText) {
  if (!lrcText || typeof lrcText !== 'string') return [];

  const lines = lrcText.split(/\r?\n/);
  const result = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || METADATA_TAG.test(line)) continue;

    const timestamps = [...line.matchAll(TIME_TAG)];
    if (!timestamps.length) continue;

    const text = line.replace(TIME_TAG, '').trim();

    for (const match of timestamps) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      result.push({ time: minutes * 60 + seconds, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export default parseLRC;