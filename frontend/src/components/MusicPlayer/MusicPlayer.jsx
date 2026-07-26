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
 * MusicPlayer - Authentic Spotify Desktop Bottom Playback Bar
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
      {/* Bottom Fixed Spotify Playback Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 h-[88px] bg-black border-t border-[#121212] px-4 flex items-center justify-between select-none">
        {/* Left Section: Track Info & Cover */}
        <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
          {/* Cover Thumbnail */}
          <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 bg-[#282828] shadow">
            {currentSong?.thumbnail ? (
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#282828]">
                <Music2 className="w-6 h-6 text-[#B3B3B3]" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate hover:underline cursor-pointer">
              {currentSong?.title || "No track selected"}
            </p>
            <p className="text-xs text-[#B3B3B3] truncate hover:underline cursor-pointer">
              {currentSong?.artist || currentSong?.author || "Select a song to play"}
            </p>
          </div>

          {/* Favorite Heart Toggle */}
          <button
            onClick={() => currentSong && toggleFavorite(currentSong)}
            className="p-1 text-[#B3B3B3] hover:text-white transition-colors"
            title={isFavorite ? "Remove from Liked Songs" : "Save to Liked Songs"}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "text-[#1DB954] fill-[#1DB954]" : "hover:text-white"
              }`}
            />
          </button>
        </div>

        {/* Center Section: Playback Controls & Timeline Progress */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[720px] px-4">
          {/* Controls Row */}
          <div className="flex items-center gap-5">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`transition-colors ${
                isShuffle ? "text-[#1DB954]" : "text-[#B3B3B3] hover:text-white"
              }`}
              title="Enable shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Skip Previous */}
            <button
              onClick={playPrevious}
              disabled={!currentSong}
              className={`transition-colors ${
                currentSong ? "text-[#B3B3B3] hover:text-white" : "text-[#4d4d4d] cursor-not-allowed"
              }`}
              title="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" fill="currentColor" />
            </button>

            {/* Play/Pause Button (Circular White Button with Black Icon) */}
            <button
              disabled={!currentSong}
              onClick={() => {
                if (isPlaying) pauseSong();
                else resumeSong();
              }}
              className={`w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 ${
                currentSong ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black fill-black" fill="black" />
              ) : (
                <Play className="w-4 h-4 text-black fill-black ml-0.5" fill="black" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={playNext}
              disabled={!currentSong}
              className={`transition-colors ${
                currentSong ? "text-[#B3B3B3] hover:text-white" : "text-[#4d4d4d] cursor-not-allowed"
              }`}
              title="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" fill="currentColor" />
            </button>

            {/* Repeat */}
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`transition-colors ${
                isRepeat ? "text-[#1DB954]" : "text-[#B3B3B3] hover:text-white"
              }`}
              title="Enable repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Row */}
          <div className="w-full flex items-center gap-2 text-xs font-semibold text-[#B3B3B3] tabular-nums">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>

            {/* Interactive Progress Slider */}
            <div
              onMouseEnter={() => setIsHoveredProgress(true)}
              onMouseLeave={() => setIsHoveredProgress(false)}
              className="relative flex-1 h-1 bg-[#4d4d4d] rounded-full cursor-pointer group flex items-center"
            >
              <div
                className={`h-full rounded-full transition-colors ${
                  isHoveredProgress ? "bg-[#1DB954]" : "bg-white"
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek progress"
              />
              {/* Hover Thumb Handle */}
              {isHoveredProgress && (
                <div
                  className="absolute w-3 h-3 bg-white rounded-full shadow pointer-events-none -translate-x-1/2"
                  style={{ left: `${progress}%` }}
                />
              )}
            </div>

            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Section: Lyrics, Queue, Volume & Fullscreen */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
          {/* Fullscreen Lyrics Trigger */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="text-[#B3B3B3] hover:text-white transition-colors"
            title="Lyrics & Fullscreen View"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue Drawer Toggle */}
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`transition-colors ${
              showQueue ? "text-[#1DB954]" : "text-[#B3B3B3] hover:text-white"
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2">
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
              className="text-[#B3B3B3] hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
              className="w-20 h-1 bg-[#4d4d4d] accent-[#1DB954] cursor-pointer"
              aria-label="Volume"
            />
          </div>

          {/* Fullscreen Expand Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="text-[#B3B3B3] hover:text-white transition-colors"
            title="Full screen"
          >
            <Maximize2 className="w-4 h-4" />
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
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 w-80 max-h-[420px] bg-[#181818] border border-[#282828] rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#282828]">
              <h3 className="text-sm font-bold text-white">Queue</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-[#B3B3B3] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {queue.length === 0 ? (
                <div className="text-center py-8 text-[#B3B3B3] text-sm font-medium">
                  Queue is empty
                </div>
              ) : (
                queue.map((song, idx) => (
                  <button
                    key={song.videoId || idx}
                    onClick={() => playSong(song)}
                    className={`w-full flex items-center gap-3 p-2 rounded hover:bg-[#282828] text-left transition-colors ${
                      idx === currentIndex ? "bg-[#282828]" : ""
                    }`}
                  >
                    <span
                      className={`w-4 text-xs text-center font-semibold ${
                        idx === currentIndex ? "text-[#1DB954]" : "text-[#B3B3B3]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <img src={song.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          idx === currentIndex ? "text-[#1DB954]" : "text-white"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-[11px] text-[#B3B3B3] truncate">{song.artist}</p>
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
            className="fixed inset-0 z-[9999] bg-[#121212] overflow-hidden flex flex-col"
          >
            {/* Background Blur */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-125 blur-[100px] opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url(${currentSong?.thumbnail || "/placeholder.png"})`,
              }}
            />

            {/* Header Close */}
            <div className="relative z-10 p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Music2 className="w-6 h-6 text-[#1DB954]" />
                <span className="font-bold text-white text-lg">Symphony Canvas</span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full bg-black/40 hover:bg-black/80 text-white transition-colors"
              >
                <Minimize2 className="w-6 h-6" />
              </button>
            </div>

            {/* Body: Artwork & Lyrics Side-by-Side */}
            <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto px-6 overflow-hidden">
              {/* Artwork */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src={currentSong?.thumbnail}
                  alt={currentSong?.title}
                  className="w-72 h-72 md:w-96 md:h-96 rounded-lg object-cover shadow-2xl"
                />
                <h2 className="text-2xl font-black text-white mt-6 text-center truncate max-w-md">
                  {currentSong?.title}
                </h2>
                <p className="text-base font-semibold text-[#B3B3B3] mt-1 text-center truncate">
                  {currentSong?.artist}
                </p>
              </div>

              {/* Lyrics Panel */}
              <div className="h-[70vh] rounded-lg overflow-hidden">
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