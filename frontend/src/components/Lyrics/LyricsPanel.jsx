import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getLyrics } from '../../services/lyricsService';

/**
 * LyricsPanel
 *
 * Spotify-style synced lyrics viewer. Drop it into the Fullscreen Player
 * alongside the album artwork — it only renders the lyrics scroller, so
 * the parent stays in control of layout (artwork, close button, etc.).
 *
 * Props:
 *  - trackName, artistName, albumName, duration: identify the track to fetch
 *  - currentTime: playback position in seconds (drive this from PlayerContext)
 *  - onSeek(time): optional — called when the user clicks a lyric line
 *  - className: optional extra classes for the outer scroll container
 */
export default function LyricsPanel({
  trackName,
  artistName,
  albumName,
  duration,
  currentTime = 0,
  onSeek,
  className = '',
}) {
  const [lyrics, setLyrics] = useState([]);
  const [plainLyrics, setPlainLyrics] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | empty | error

  const lineRefs = useRef([]);
  const lastScrolledIndex = useRef(-1);

  // Fetch lyrics whenever the track identity changes
  useEffect(() => {
    if (!trackName || !artistName) {
      setStatus('empty');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setLyrics([]);
    setPlainLyrics(null);
    lastScrolledIndex.current = -1;

    getLyrics({ trackName, artistName, albumName, duration })
      .then((result) => {
        if (cancelled) return;
        if (result?.synced?.length) {
          setLyrics(result.synced);
          setStatus('ready');
        } else if (result?.plain) {
          setPlainLyrics(result.plain);
          setStatus('ready');
        } else {
          setStatus('empty');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [trackName, artistName, albumName, duration]);

  // Figure out which line is currently active based on playback time
  const activeIndex = (() => {
    if (!lyrics.length) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) idx = i;
      else break;
    }
    return idx;
  })();

  // Auto-scroll so the active line stays vertically centered
  useEffect(() => {
    if (activeIndex < 0 || activeIndex === lastScrolledIndex.current) return;
    lastScrolledIndex.current = activeIndex;
    lineRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [activeIndex]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className={`flex h-full items-center justify-center text-sm text-white/40 ${className}`}>
        Loading lyrics…
      </div>
    );
  }

  if (status === 'empty' || status === 'error') {
    return (
      <div className={`flex h-full items-center justify-center text-sm text-white/40 ${className}`}>
        {status === 'error' ? 'Lyrics unavailable right now.' : 'No lyrics found for this track.'}
      </div>
    );
  }

  // Fallback for tracks that only have unsynced lyrics
  if (plainLyrics) {
    return (
      <div
        className={`h-full overflow-y-auto px-6 py-10 text-center [&::-webkit-scrollbar]:hidden ${className}`}
        style={{ scrollbarWidth: 'none' }}
      >
        {plainLyrics.split('\n').map((line, i) => (
          <p key={i} className="mb-3 text-lg leading-relaxed text-white/70">
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-y-auto px-6 py-[40vh] text-center [&::-webkit-scrollbar]:hidden ${className}`}
      style={{ scrollbarWidth: 'none' }}
    >
      {lyrics.map((line, i) => {
        const distance = activeIndex < 0 ? Infinity : Math.abs(i - activeIndex);
        const isActive = distance === 0;

        const animateState = {
          opacity: distance === 0 ? 1 : distance === 1 ? 0.55 : distance === 2 ? 0.28 : 0.1,
          scale: distance === 0 ? 1 : distance === 1 ? 0.94 : 0.9,
          filter:
            distance === 0
              ? 'blur(0px)'
              : distance === 1
              ? 'blur(0px)'
              : distance === 2
              ? 'blur(0px)'
              : 'blur(0px)',
        };

        return (
          <motion.p
            key={`${line.time}-${i}`}
            ref={(el) => (lineRefs.current[i] = el)}
            onClick={() => onSeek?.(line.time)}
            initial={false}
            animate={animateState}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`mb-6 select-none leading-snug ${onSeek ? 'cursor-pointer' : ''} ${
              isActive
                ? 'text-3xl font-bold text-white md:text-4xl'
                : 'text-lg font-medium text-white/70 md:text-xl'
            }`}
          >
            {line.text || '\u00A0'}
          </motion.p>
        );
      })}
    </div>
  );
}