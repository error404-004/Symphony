import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Music2, AlertCircle } from 'lucide-react';
import { getLyrics } from '../../services/lyricsService';

/**
 * LyricsPanel - Apple Music & Spotify Style Synchronized Lyrics View.
 *
 * Key Features:
 *  - Left-aligned Apple Music typography with heavy bold fonts and vibrant text glow.
 *  - Precise active-line tracking with smooth centered auto-scroll.
 *  - Smart manual scroll detection: pauses auto-scroll when user manually scrolls,
 *    providing a floating "Sync to Live Lyrics" button to resume sync.
 *  - Interactive click-to-seek playback position for any lyric line.
 *  - Apple-style top & bottom gradient mask fades.
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

  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const lastScrolledIndex = useRef(-1);
  const userScrolledRef = useRef(false);
  const userScrollTimeoutRef = useRef(null);
  const [isManualScroll, setIsManualScroll] = useState(false);

  // Fetch lyrics whenever track identity changes
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
    userScrolledRef.current = false;
    setIsManualScroll(false);

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
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    };
  }, [trackName, artistName, albumName, duration]);

  // Determine active line index based on current audio time
  const activeIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [lyrics, currentTime]);

  // Center active lyric line strictly inside lyrics container (without scrolling outer window)
  const scrollToActiveLine = (smooth = true) => {
    if (activeIndex < 0 || !lineRefs.current[activeIndex] || !containerRef.current) return;
    userScrolledRef.current = false;
    setIsManualScroll(false);

    const container = containerRef.current;
    const targetEl = lineRefs.current[activeIndex];

    const targetTop = targetEl.offsetTop - container.clientHeight / 2 + targetEl.clientHeight / 2;

    container.scrollTo({
      top: Math.max(0, targetTop),
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  // Auto-scroll when activeIndex changes unless user is manually scrolling
  useEffect(() => {
    if (activeIndex < 0 || activeIndex === lastScrolledIndex.current) return;
    lastScrolledIndex.current = activeIndex;

    if (!userScrolledRef.current) {
      scrollToActiveLine(true);
    }
  }, [activeIndex]);

  // Handle user manual scroll
  const handleScroll = () => {
    if (status !== 'ready' || !lyrics.length) return;

    if (!userScrolledRef.current) {
      userScrolledRef.current = true;
      setIsManualScroll(true);
    }

    if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
    userScrollTimeoutRef.current = setTimeout(() => {
      userScrolledRef.current = false;
      setIsManualScroll(false);
      // Auto-recenter after period of scroll inactivity
      scrollToActiveLine(true);
    }, 5000);
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-4 text-purple-200/70 font-semibold ${className}`}>
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-3 border-purple-500/20 border-t-purple-400 animate-spin" />
          <Music2 className="w-5 h-5 text-purple-300 absolute" />
        </div>
        <span className="text-sm tracking-wide animate-pulse">Syncing lyrics with audio…</span>
      </div>
    );
  }

  if (status === 'empty' || status === 'error') {
    return (
      <div className={`flex h-full flex-col items-center justify-center gap-3 text-center px-6 ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 shadow-inner">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="text-lg font-bold text-white tracking-tight">
          {status === 'error' ? 'Lyrics unavailable' : 'No synced lyrics found'}
        </p>
        <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
          {status === 'error'
            ? 'We couldn\'t load synchronized lyrics for this track.'
            : 'Enjoy the music! Lyrics for this song aren\'t available right now.'}
        </p>
      </div>
    );
  }

  // Fallback for unsynced plain lyrics
  if (plainLyrics) {
    return (
      <div
        className={`h-full overflow-y-auto px-6 sm:px-12 py-16 text-left relative space-y-6 [&::-webkit-scrollbar]:hidden ${className}`}
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="max-w-2xl space-y-6">
          {plainLyrics.split('\n').map((line, i) => (
            <p key={i} className="text-xl sm:text-2xl font-bold leading-relaxed text-zinc-300/90 tracking-tight">
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>

      {/* Synchronized Lyrics Container with Seamless CSS Masking (No solid dark box overlay) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 sm:px-8 lg:px-12 py-[35vh] space-y-6 sm:space-y-8 text-left scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        {lyrics.map((line, i) => {
          const isActive = i === activeIndex;
          const isPassed = i < activeIndex;

          return (
            <motion.div
              key={`${line.time}-${i}`}
              ref={(el) => (lineRefs.current[i] = el)}
              onClick={() => {
                onSeek?.(line.time);
                scrollToActiveLine(true);
              }}
              className={`group relative flex items-center gap-3 cursor-pointer transition-all duration-300 origin-left py-1 select-none ${
                isActive
                  ? 'scale-[1.02] opacity-100 text-white'
                  : 'hover:opacity-100 opacity-35 hover:scale-[1.01]'
              }`}
            >
              {/* Subtle hover play icon */}
              <div className="shrink-0 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -ml-6 sm:-ml-7">
                <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              </div>

              <p
                className={`text-2xl sm:text-3xl lg:text-[38px] leading-snug tracking-tight font-extrabold transition-all duration-300 ${
                  isActive
                    ? 'text-white font-black drop-shadow-[0_4px_24px_rgba(255,255,255,0.45)] drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]'
                    : isPassed
                    ? 'text-white/50 font-bold'
                    : 'text-white/35 font-bold'
                }`}
              >
                {line.text || '\u00A0'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}