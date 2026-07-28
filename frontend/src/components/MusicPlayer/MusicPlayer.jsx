import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { motion, AnimatePresence } from 'framer-motion';
import LyricsPanel from '../Lyrics/LyricsPanel';
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
  Mic2
} from 'lucide-react';

/**
 * MusicPlayer - Symphony Design Language (SDL) Floating Glassmorphic Playback Bar.
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
    ? favorites.some((song) => song.videoId === currentSong.videoId)
    : false;

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [showQueue, setShowQueue] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHoveredProgress, setIsHoveredProgress] = useState(false);

  useEffect(() => {
    if (player) {
      player.volume = volume / 100;
    }
  }, [player, volume]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function formatTime(time) {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <>
      {/* Bottom Floating Glassmorphic Playback Bar */}
      <footer className="fixed bottom-3 inset-x-3 md:inset-x-6 z-50 h-[90px] backdrop-blur-2xl backdrop-saturate-150 bg-[#0c0917]/90 border border-purple-500/25 rounded-2xl px-5 sm:px-7 flex items-center justify-between select-none shadow-2xl shadow-purple-950/50">
        {/* Top Specular Purple Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-80 rounded-t-2xl pointer-events-none" />

        {/* Left Section: Track Info & Cover */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
          {/* Cover Thumbnail with Ambient Glow */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-purple-600/40 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="w-14 h-14 rounded-xl overflow-hidden relative bg-white/5 border border-white/15 shadow-lg shadow-black/60">
              {currentSong?.thumbnail ? (
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                  <Music2 className="w-6 h-6 text-purple-300/40" />
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-sm font-bold text-white truncate hover:text-purple-300 cursor-pointer tracking-tight transition-colors">
              {currentSong?.title || "No track selected"}
            </p>
            <p className="text-xs text-zinc-400 truncate hover:text-zinc-200 cursor-pointer font-medium transition-colors">
              {currentSong?.artist || currentSong?.author || "Select a song to play"}
            </p>
          </div>

          {/* Favorite Heart Toggle */}
          <button
            onClick={() => currentSong && toggleFavorite(currentSong)}
            className="p-2 rounded-xl text-zinc-400 hover:text-pink-400 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            title={isFavorite ? "Remove from Liked Songs" : "Save to Liked Songs"}
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${
                isFavorite
                  ? "text-pink-500 fill-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  : "hover:text-white"
              }`}
            />
          </button>
        </div>

        {/* Center Section: Playback Controls & Timeline Progress */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[720px] px-6">
          {/* Controls Row */}
          <div className="flex items-center gap-6">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                isShuffle
                  ? "text-purple-300 bg-purple-500/20 border border-purple-500/40 shadow-sm drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              title="Enable shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Skip Previous */}
            <button
              onClick={playPrevious}
              disabled={!currentSong}
              className={`p-2 rounded-xl transition-all duration-200 ${
                currentSong
                  ? "text-zinc-300 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95"
                  : "text-zinc-600 cursor-not-allowed"
              }`}
              title="Previous"
            >
              <SkipBack className="w-4.5 h-4.5 fill-current" fill="currentColor" />
            </button>

            {/* Play/Pause Button */}
            <button
              disabled={!currentSong}
              onClick={() => {
                if (isPlaying) pauseSong();
                else resumeSong();
              }}
              className={`w-[42px] h-[42px] rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 border border-white/30 transition-all duration-200 hover:scale-105 active:scale-95 ${
                currentSong ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" fill="white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-0.5" fill="white" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={playNext}
              disabled={!currentSong}
              className={`p-2 rounded-xl transition-all duration-200 ${
                currentSong
                  ? "text-zinc-300 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95"
                  : "text-zinc-600 cursor-not-allowed"
              }`}
              title="Next"
            >
              <SkipForward className="w-4.5 h-4.5 fill-current" fill="currentColor" />
            </button>

            {/* Repeat */}
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                isRepeat
                  ? "text-purple-300 bg-purple-500/20 border border-purple-500/40 shadow-sm drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              title="Enable repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Row */}
          <div className="w-full flex items-center gap-2.5 text-xs font-medium text-zinc-400 tabular-nums">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>

            {/* Interactive Progress Slider */}
            <div
              onMouseEnter={() => setIsHoveredProgress(true)}
              onMouseLeave={() => setIsHoveredProgress(false)}
              className="relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group flex items-center overflow-visible"
            >
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  isHoveredProgress
                    ? "bg-gradient-to-r from-purple-400 to-indigo-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                }`}
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => {
                  const newProgress = Number(e.target.value);
                  if (player && duration) {
                    player.currentTime = (newProgress / 100) * duration;
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Seek progress"
              />
              {/* Hover Thumb Handle */}
              {isHoveredProgress && (
                <div
                  className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-purple-950/80 border border-purple-300 pointer-events-none -translate-x-1/2 transition-transform scale-110"
                  style={{ left: `${progress}%` }}
                />
              )}
            </div>

            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Section: Lyrics, Queue, Volume & Fullscreen */}
        <div className="flex items-center justify-end gap-2.5 w-1/4 min-w-[190px]">
          {/* Fullscreen Lyrics Trigger */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            title="Lyrics & Fullscreen View"
          >
            <Mic2 className="w-4.5 h-4.5" />
          </button>

          {/* Queue Drawer Toggle */}
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
              showQueue
                ? "text-purple-300 bg-purple-500/15 border border-purple-500/30 shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
            title="Queue"
          >
            <ListMusic className="w-4.5 h-4.5" />
          </button>

          {/* Integrated Volume Control */}
          <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] p-1.5 px-3 rounded-full border border-white/10 shadow-inner">
            <button
              onClick={() => {
                if (isMuted) {
                  player.volume = volume / 100;
                  setIsMuted(false);
                } else {
                  player.volume = 0;
                  setIsMuted(true);
                }
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-purple-300" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVol = Number(e.target.value);
                setVolume(newVol);
                if (player) player.volume = newVol / 100;
                if (newVol > 0) setIsMuted(false);
              }}
              className="w-20 h-1 bg-white/10 accent-purple-500 cursor-pointer rounded-full"
              aria-label="Volume"
            />
          </div>

          {/* Fullscreen Expand Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            title="Full screen"
          >
            <Maximize2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </footer>

      {/* ===== Slide-up Queue Panel ===== */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-28 right-6 z-50 w-84 max-h-[440px] glass-card backdrop-blur-2xl bg-surface-950/90 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white tracking-tight">Queue</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {queue.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 text-sm font-medium">
                  Queue is empty
                </div>
              ) : (
                queue.map((song, idx) => (
                  <button
                    key={song.videoId || idx}
                    onClick={() => playSong(song)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 text-left ${
                      idx === currentIndex
                        ? "bg-purple-600/20 border border-purple-500/30 shadow-md"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span
                      className={`w-4 text-xs text-center font-bold ${
                        idx === currentIndex ? "text-purple-300" : "text-zinc-400"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <img src={song.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          idx === currentIndex ? "text-purple-200" : "text-white"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{song.artist}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Fullscreen Immersive Lyrics View ===== */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-surface-950 overflow-hidden flex flex-col"
          >
            {/* Background Ambient Blur */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-125 blur-[120px] opacity-35 pointer-events-none"
              style={{
                backgroundImage: `url(${currentSong?.thumbnail || "/placeholder.png"})`,
              }}
            />

            {/* Header Close */}
            <div className="relative z-10 p-6 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/30">
                  <Music2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg tracking-tight">Symphony Canvas</span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2.5 rounded-full glass border border-white/10 hover:border-purple-500/40 text-white hover:bg-purple-600/20 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Body: Artwork & Lyrics Side-by-Side */}
            <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto px-6 overflow-hidden">
              {/* Artwork */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src={currentSong?.thumbnail}
                  alt={currentSong?.title}
                  className="w-72 h-72 md:w-96 md:h-96 rounded-2xl object-cover shadow-2xl shadow-purple-950/60 border border-white/10"
                />
                <h2 className="text-2xl font-black text-white mt-6 text-center truncate max-w-md tracking-tight">
                  {currentSong?.title}
                </h2>
                <p className="text-base font-semibold text-purple-300/80 mt-1 text-center truncate">
                  {currentSong?.artist}
                </p>
              </div>

              {/* Lyrics Panel */}
              <div className="h-[70vh] rounded-2xl overflow-hidden glass-card border border-white/10">
                <LyricsPanel
                  trackName={currentSong?.title}
                  artistName={currentSong?.artist || currentSong?.author}
                  albumName={currentSong?.album}
                  duration={duration}
                  currentTime={currentTime}
                  onSeek={(t) => {
                    if (player) player.currentTime = t;
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}