import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  Maximize2,
  Music2,
} from 'lucide-react'

/**
 * MusicPlayer - Fixed bottom music player bar.
 * UI only - no actual playback functionality.
 */
export default function MusicPlayer({ currentSong }) {
  const {
    player,
    isPlaying,
    pauseSong,
    resumeSong,
    currentTime,
    duration,
  } = usePlayer();
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(75)
  useEffect(() => {
    player.volume = volume / 100;
  }, []);
  const [isLiked, setIsLiked] = useState(false)
  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 h-24 glass border-t border-surface-700/30"
    >
      {/* Progress Bar - Top of player */}
      <div className="absolute top-0 left-0 right-0 h-1 group cursor-pointer">
        <div className="absolute inset-0 bg-surface-800" />
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 to-primary-400"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => {
              const newProgress = Number(e.target.value);

              player.currentTime = (newProgress / 100) * duration;
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Song progress"
        />
        {/* Hover thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-400 shadow-lg shadow-primary-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      <div className="flex items-center justify-between h-full px-4 lg:px-6 pt-1">
        {/* Left - Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          {/* Album Art */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 flex items-center justify-center shrink-0 shadow-lg shadow-primary-900/30 overflow-hidden"
          >
            <Music2 className="w-6 h-6 text-primary-300/60" />
          </motion.div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-surface-400 truncate">
              {currentSong.artist}
            </p>
          </div>
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="hidden sm:flex shrink-0 ml-1"
            aria-label="Like song"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isLiked
                  ? 'text-primary-400 fill-primary-400'
                  : 'text-surface-500 hover:text-surface-300'
              }`}
            />
          </motion.button>
        </div>

        {/* Center - Controls */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Shuffle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden sm:flex text-surface-500 hover:text-surface-200 transition-colors duration-200"
              aria-label="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </motion.button>

            {/* Previous */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-surface-300 hover:text-white transition-colors duration-200"
              aria-label="Previous track"
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                  if (isPlaying) {
                      pauseSong();
                    } else {
                        resumeSong();
                    }
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-surface-950 hover:bg-surface-100 transition-colors duration-200 shadow-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </motion.button>

            {/* Next */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-surface-300 hover:text-white transition-colors duration-200"
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>

            {/* Repeat */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden sm:flex text-surface-500 hover:text-surface-200 transition-colors duration-200"
              aria-label="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Time indicators */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-surface-500 font-medium tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span className="text-surface-700">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right - Volume & Extras */}
        <div className="flex items-center justify-end gap-2 w-1/4">
          {/* Queue */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hidden lg:flex text-surface-500 hover:text-surface-200 transition-colors duration-200"
            aria-label="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </motion.button>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (isMuted) {
                  player.volume = volume / 100;
                  setIsMuted(false);
                } else {
                  player.volume = 0;
                  setIsMuted(true);
                }
              }}
              className="text-surface-400 hover:text-surface-200 transition-colors duration-200"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </motion.button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVolume = Number(e.target.value);

                setVolume(newVolume);

                player.volume = newVolume / 100;

                if (newVolume > 0) {
                    setIsMuted(false);
                }
              }}
              className="w-24 h-1 accent-primary-500"
              aria-label="Volume"
            />
          </div>

          {/* Fullscreen */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="hidden lg:flex text-surface-500 hover:text-surface-200 transition-colors duration-200"
            aria-label="Full screen"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
