import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getLyrics } from '../../services/lyricsService';

/**
 * LyricsPanel
 *
 * Spotify-style synced lyrics viewer with Symphony's purple ambient glassmorphic aesthetic.
 *
 * Props:
 *  - trackName, artistName, albumName, duration: identify the track to fetch
 *  - currentTime: playback position in seconds (driven from PlayerContext)
 *  - onSeek(time): called when user clicks a lyric line
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

    requestAnimationFrame(() => {
      setTimeout(() => {
        lineRefs.current[activeIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 120); // Try 120–180ms
    });
  }, [activeIndex]);
  if (status === 'loading' || status === 'idle') {
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-3 text-sm text-purple-300/60 font-medium ${className}`}>
        <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
        <span>Loading synchronized lyrics…</span>
      </div>
    );
  }

  if (status === 'empty' || status === 'error') {
    return (
      <div className={`flex h-full items-center justify-center text-sm font-medium text-purple-200/50 ${className}`}>
        {status === 'error' ? 'Lyrics unavailable right now.' : 'No lyrics found for this track.'}
      </div>
    );
  }

  // Fallback for tracks that only have unsynced lyrics
  if (plainLyrics) {
    return (
      <div
        className={`h-full overflow-y-auto px-6 py-12 text-center relative [&::-webkit-scrollbar]:hidden ${className}`}
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {plainLyrics.split('\n').map((line, i) => (
            <p key={i} className="text-lg md:text-xl font-semibold leading-relaxed text-zinc-300/90 break-words">
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-y-auto px-4 sm:px-8 md:px-12 py-[42vh] text-center relative [&::-webkit-scrollbar]:hidden ${className}`}
      style={{ scrollbarWidth: 'none' }}
    >
      {/* Soft Purple Radial Background Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-30 bg-gradient-to-b from-purple-900/10 via-transparent to-purple-950/20" />

      <div className="w-full max-w-4xl mx-auto">
        {lyrics.map((line, i) => {
          const distance = activeIndex < 0 ? Infinity : Math.abs(i - activeIndex);
          const isActive = distance === 0;

          const animateState = {
            opacity: distance === 0 ? 1 : distance === 1 ? 0.45 : distance === 2 ? 0.22 : 0.08,
            scale: distance === 0 ? 1.02 : distance === 1 ? 0.97 : distance === 2 ? 0.94 : 0.92,
            filter:
              distance === 0
                ? "blur(0px)"
                : distance === 1
                ? "blur(0px)"
                : distance === 2
                ? "blur(0.6px)"
                : "blur(1px)"
          };

          return (
            <motion.p
              layout
              key={`${line.time}-${i}`}
              ref={(el) => (lineRefs.current[i] = el)}
              onClick={() => onSeek?.(line.time)}
              initial={false}
              animate={animateState}
              transition={{duration: 0.30,ease: "easeOut",}}
              className={`my-6 md:my-8 leading-relaxed md:leading-relaxed break-words select-none transition-all duration-300 origin-center max-w-3xl mx-auto ${
                onSeek ? 'cursor-pointer' : ''
              } ${
                isActive
                  ? 'text-2xl font-extrabold text-white md:text-3xl lg:text-[34px] tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                  : 'text-base font-semibold text-zinc-400 md:text-xl hover:text-purple-200/80'
              }`}
            >
              {line.text || '\u00A0'}
            </motion.p>
          );
        })}
      </div>
    </div>
  );
}