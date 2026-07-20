import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { motion, AnimatePresence } from 'framer-motion'
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
  Minimize2,
  Music2,
  X,
} from 'lucide-react'

/**
 * MusicPlayer - Fixed bottom music player bar.
 * UI only - no actual playback functionality.
 */
export default function MusicPlayer() {
  const {
    player,
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    currentTime,
    duration,
    playNext,
    playPrevious,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    favorites,
    toggleFavorite,
    queue,
    currentIndex,
    playSong
  } = usePlayer();
  const isFavorite = currentSong
    ? favorites.some(
        (song) => song.videoId === currentSong.videoId
      )
    : false;
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(75)
  const [showQueue, setShowQueue] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  useEffect(() => {
    if (player) {
      player.volume = volume / 100;
    }
  }, [player, volume]);
  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return (
    <>
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 h-24 glass-strong border-t border-white/[0.08] shadow-[0_-8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Progress Bar - Top of player */}
      <div className="absolute top-0 left-0 right-0 h-1 group/progress cursor-pointer hover:h-1.5 transition-all duration-200">
        <div className="absolute inset-0 bg-white/[0.06]" />
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-400 shadow-[0_0_8px_rgba(139,92,246,0.3)]"
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
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-400 shadow-lg shadow-primary-500/50 opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      <div className="flex items-center justify-between h-full px-4 lg:px-6 pt-1">
        {/* Left - Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          {/* Album Art */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-black/40 bg-surface-800 ring-1 ring-white/[0.06]"
          >
            {currentSong?.thumbnail ? (
              <motion.img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
                <Music2 className="w-6 h-6 text-white/40" />
              </div>
            )}
          </motion.div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentSong?.title || "Ready to Play"}
            </p>
            <p className="text-xs text-[#B3B3B3] truncate">
              {currentSong?.artist || currentSong?.author || "Search and choose a song"}
            </p>
          </div>
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => currentSong && toggleFavorite(currentSong)}
            className="hidden sm:flex shrink-0 ml-1"
            aria-label="Like song"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isFavorite
                  ? "text-primary-400 fill-primary-400"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
            />
          </motion.button>
        </div>

        {/* Center - Controls */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Shuffle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsShuffle(!isShuffle)}
              className={`hidden sm:flex transition-colors duration-200 ${
                isShuffle
                  ? "text-primary-400"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
              aria-label="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
          </motion.button>

            {/* Previous */}
            <motion.button
              onClick={playPrevious}
              disabled={!currentSong}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors duration-200 ${
                currentSong
                ? "text-[#B3B3B3] hover:text-white"
                : "text-surface-600 cursor-not-allowed"
              }`}
              aria-label="Previous track"
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              disabled={!currentSong}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                  if (isPlaying) {
                      pauseSong();
                    } else {
                        resumeSong();
                    }
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                currentSong
                  ? "bg-white text-[#0D0D0D] hover:bg-white/90 shadow-lg shadow-white/10"
                  : "bg-white/10 text-[#B3B3B3] cursor-not-allowed"
              }`}
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
              onClick={playNext}
              disabled={!currentSong}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors duration-200 ${
                currentSong
                  ? "text-[#B3B3B3] hover:text-white"
                  : "text-surface-600 cursor-not-allowed"
              }`}
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>

            {/* Repeat */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsRepeat(!isRepeat)}
              className={`hidden sm:flex transition-colors duration-200 ${
                isRepeat
                  ? "text-primary-400"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
              aria-label="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Time indicators */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#B3B3B3] font-medium tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/20">·</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right - Volume & Extras */}
        <div className="flex items-center justify-end gap-2 w-1/4">
          {/* Queue */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowQueue(!showQueue)}
            className={`hidden lg:flex transition-colors duration-200 ${
              showQueue
                ? "text-primary-400"
                : "text-[#B3B3B3] hover:text-white"
            }`}
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
              className="text-[#B3B3B3] hover:text-white transition-colors duration-200"
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
            onClick={() => setIsFullscreen(true)}
            className="hidden lg:flex text-[#B3B3B3] hover:text-white transition-colors duration-200"
            aria-label="Full screen"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

  {/* ===== Queue Panel ===== */}
  <AnimatePresence>
  {showQueue && (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-28 right-6 w-80 max-h-[420px] overflow-hidden rounded-2xl glass-strong shadow-2xl shadow-black/50 flex flex-col"
    >
      {/* Queue Header */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-white/[0.06]">
        <h3 className="text-base font-semibold text-white">
          Playing Queue
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQueue(false)}
          className="text-[#B3B3B3] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Queue Content */}
      <div className="overflow-y-auto flex-1 p-2">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ListMusic className="w-10 h-10 text-[#B3B3B3]/30 mb-3" />
            <p className="text-[#B3B3B3] text-sm">Queue is empty.</p>
            <p className="text-[#B3B3B3]/50 text-xs mt-1">Search and play a song to start.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {queue.map((song, index) => (
              <motion.button
                key={song.videoId}
                onClick={() => playSong(song)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  index === currentIndex
                    ? "bg-primary-500/[0.12] ring-1 ring-primary-500/30"
                    : ""
                }`}
              >
                {/* Track Number / Playing Indicator */}
                <div className="w-6 text-center shrink-0">
                  {index === currentIndex ? (
                    <div className="flex items-center justify-center gap-[2px]">
                      <span className="w-[3px] h-3 bg-primary-400 rounded-full animate-pulse" />
                      <span className="w-[3px] h-4 bg-primary-400 rounded-full animate-pulse [animation-delay:0.15s]" />
                      <span className="w-[3px] h-2 bg-primary-400 rounded-full animate-pulse [animation-delay:0.3s]" />
                    </div>
                  ) : (
                    <span className="text-xs text-[#B3B3B3]/50 font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${index === currentIndex ? 'text-primary-300' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className="text-xs text-[#B3B3B3] truncate">
                    {song.artist || song.author}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )}
  </AnimatePresence>
</motion.div>

  {/* ===== Fullscreen Player ===== */}
  <AnimatePresence>
  {isFullscreen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 z-[9999] overflow-hidden"
  >

    {/* Blurred Background */}
    <div
      className="absolute inset-0 bg-cover bg-center scale-125 blur-[80px] opacity-40"
      style={{
        backgroundImage: `url(${
          currentSong?.thumbnail || currentSong?.image || "/placeholder.png"
        })`,
      }}
    />

    {/* Dark Overlays */}
    <div className="absolute inset-0 bg-black/60" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

    {/* Close Button */}
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onClick={() => setIsFullscreen(false)}
      className="absolute top-6 right-6 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm"
    >
      <Minimize2 className="w-5 h-5" />
    </motion.button>

    <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">

      {/* Album Art */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {currentSong?.thumbnail || currentSong?.image ? (
          <img
            src={currentSong?.thumbnail || currentSong?.image}
            alt={currentSong?.title}
            className="w-72 h-72 md:w-80 md:h-80 rounded-[28px] object-cover shadow-[0_30px_80px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
          />
        ) : (
          <div className="w-72 h-72 md:w-80 md:h-80 rounded-[28px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
            <Music2 className="w-24 h-24 text-white/20" />
          </div>
        )}
      </motion.div>

      {/* Song Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-10 text-center max-w-lg"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white text-shadow-glow truncate">
          {currentSong?.title || "No song selected"}
        </h1>
        <p className="mt-3 text-lg font-medium text-[#B3B3B3]">
          {currentSong?.artist ||
            currentSong?.author ||
            "Unknown Artist"}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-8 w-full max-w-md"
      >
        <div className="relative h-1.5 rounded-full bg-white/10 group cursor-pointer">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
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
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#B3B3B3] font-medium tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-center gap-8"
      >
        {/* Shuffle */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsShuffle(!isShuffle)}
          className={`transition-colors duration-200 ${
            isShuffle ? "text-primary-400" : "text-white/50 hover:text-white"
          }`}
        >
          <Shuffle className="w-5 h-5" />
        </motion.button>

        {/* Previous */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={playPrevious}
        >
          <SkipBack className="w-7 h-7 text-white hover:text-primary-300 transition-colors" />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            if (isPlaying) pauseSong();
            else resumeSong();
          }}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl shadow-white/10 hover:shadow-white/20 transition-shadow"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-[#0D0D0D]" fill="currentColor" />
          ) : (
            <Play className="w-7 h-7 text-[#0D0D0D] ml-1" fill="currentColor" />
          )}
        </motion.button>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={playNext}
        >
          <SkipForward className="w-7 h-7 text-white hover:text-primary-300 transition-colors" />
        </motion.button>

        {/* Repeat */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsRepeat(!isRepeat)}
          className={`transition-colors duration-200 ${
            isRepeat ? "text-primary-400" : "text-white/50 hover:text-white"
          }`}
        >
          <Repeat className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Bottom Row: Favorite & Queue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-center gap-6"
      >
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => currentSong && toggleFavorite(currentSong)}
          className="transition-colors duration-200"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite
                ? "text-primary-400 fill-primary-400"
                : "text-white/50 hover:text-white"
            }`}
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQueue(!showQueue)}
          className="text-white/50 hover:text-white transition-colors duration-200"
        >
          <ListMusic className="w-5 h-5" />
        </motion.button>
      </motion.div>

    </div>

  </motion.div>
  )}
  </AnimatePresence>
</>
  )
}