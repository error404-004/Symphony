import { useState, useEffect } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { motion, AnimatePresence } from 'framer-motion';
import LyricsPanel from '../Lyrics/LyricsPanel';
import SongContextMenu from "../ui/SongContextMenu";
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
  Mic2,
  Plus,
  Check,
  Search,
  Sparkles,
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
    playSong,
    playlists,
    addSongToPlaylist,
    openCreatePlaylistModal,
  } = usePlayer();

  const isFavorite = currentSong
    ? favorites.some((song) => song.videoId === currentSong.videoId)
    : false;

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [showQueue, setShowQueue] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [addedPlaylistId, setAddedPlaylistId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHoveredProgress, setIsHoveredProgress] = useState(false);
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState("");

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
      {/* Bottom Floating Glassmorphic Playback Bar - Fitted into Home Main Content Alignment */}
      <footer className="fixed md:absolute bottom-[66px] md:bottom-3 left-2 right-2 md:left-3 md:right-3 z-30 h-[88px] sm:h-[96px] backdrop-blur-2xl backdrop-saturate-150 bg-[#0c0917]/95 border border-purple-500/30 rounded-2xl px-4 sm:px-8 flex items-center justify-between select-none shadow-2xl shadow-purple-950/70">
        {/* Top Specular Purple Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-80 rounded-t-2xl pointer-events-none" />

        {/* Left Section: Track Info & Cover */}
        <div className="flex items-center gap-3 sm:gap-4 max-w-[42%] sm:w-1/4 sm:min-w-[220px]">
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

          {/* Spotify Triple Dot Context Menu */}
          {currentSong && <SongContextMenu song={currentSong} />}

          {/* Add to Playlist Button & Dropdown */}
          <div className="relative">
            <button
              disabled={!currentSong}
              onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                currentSong
                  ? showPlaylistMenu
                    ? "text-purple-300 bg-purple-500/20 border border-purple-500/40"
                    : "text-zinc-400 hover:text-purple-300 hover:bg-white/10 hover:scale-105 active:scale-95"
                  : "text-zinc-600 cursor-not-allowed"
              }`}
              title="Add to Playlist"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>

            {/* Playlist Selection Popup Menu */}
            <AnimatePresence>
              {showPlaylistMenu && currentSong && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                  className="absolute bottom-full mb-4 left-0 z-[100] w-80 sm:w-[350px] bg-gradient-to-br from-[#140b2e]/95 via-[#0c061c]/95 to-[#06030f]/95 backdrop-blur-3xl border-2 border-purple-500/40 rounded-3xl p-6 shadow-[0_25px_85px_rgba(168,85,247,0.5)] overflow-hidden flex flex-col text-left"
                >
                  {/* Top Specular Hairline */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90 rounded-t-3xl pointer-events-none" />

                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 shadow-sm">
                        <ListMusic className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Add to Playlist</h4>
                        <p className="text-[11px] text-purple-300/90 font-bold truncate max-w-[170px] mt-0.5">
                          {currentSong.title}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowPlaylistMenu(false);
                        setPlaylistSearchQuery("");
                      }}
                      className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent transition-all cursor-pointer shrink-0"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-3.5 shrink-0">
                    <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={playlistSearchQuery}
                      onChange={(e) => setPlaylistSearchQuery(e.target.value)}
                      placeholder="Find a playlist..."
                      className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-black/40 border border-purple-500/30 focus:border-purple-400 text-xs font-semibold text-white placeholder:text-zinc-500 focus:outline-none backdrop-blur-md transition-all shadow-inner"
                    />
                  </div>

                  {/* Quick Action: + New Playlist */}
                  <button
                    onClick={() => {
                      setShowPlaylistMenu(false);
                      setPlaylistSearchQuery("");
                      openCreatePlaylistModal();
                    }}
                    className="w-full mb-3 py-2.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-black transition-all flex items-center justify-between group cursor-pointer shrink-0 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-white group-hover:text-purple-200">New Playlist</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </button>

                  {/* Scrollable Playlists List */}
                  <div className="max-h-[230px] overflow-y-auto space-y-3 pr-1 shrink-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-purple-500/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {/* Saved In Section */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-purple-300/80 uppercase tracking-widest block px-0.5">
                        SAVED IN
                      </span>
                      <button
                        onClick={() => toggleFavorite(currentSong)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 text-left group cursor-pointer ${
                          isFavorite
                            ? "bg-purple-900/40 border-purple-500/50 text-purple-200 shadow-md shadow-purple-950/40"
                            : "bg-black/30 hover:bg-purple-600/20 border-white/10 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/25 border border-purple-400/40 flex items-center justify-center shrink-0">
                            <Heart className={`w-3.5 h-3.5 ${isFavorite ? "text-purple-300 fill-purple-300" : "text-zinc-400"}`} fill={isFavorite ? "currentColor" : "none"} />
                          </div>
                          <div className="min-w-0">
                            <span className="truncate font-bold text-white group-hover:text-purple-200 block text-xs">
                              Liked Songs
                            </span>
                            <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">
                              {favorites.length} {favorites.length === 1 ? "song" : "songs"}
                            </span>
                          </div>
                        </div>

                        {isFavorite ? (
                          <div className="w-6 h-6 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center text-purple-200 shadow-sm shrink-0">
                            <Check className="w-3 h-3 text-purple-300" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-purple-400/50 transition-all shrink-0" />
                        )}
                      </button>
                    </div>

                    {/* Your Playlists Section */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-purple-300/80 uppercase tracking-widest block px-0.5 pt-1">
                        YOUR PLAYLISTS
                      </span>

                      {playlists.filter((pl) => pl.name.toLowerCase().includes(playlistSearchQuery.toLowerCase().trim())).length === 0 ? (
                        <div className="text-center py-4 px-3 bg-black/20 rounded-xl border border-white/5">
                          <p className="text-xs font-bold text-zinc-400">
                            {playlistSearchQuery ? "No playlists match your search" : "No custom playlists yet"}
                          </p>
                        </div>
                      ) : (
                        playlists
                          .filter((pl) => pl.name.toLowerCase().includes(playlistSearchQuery.toLowerCase().trim()))
                          .map((pl) => {
                            const isSongInPlaylist = pl.songs?.some((s) => s.videoId === currentSong.videoId);

                            return (
                              <button
                                key={pl.id}
                                onClick={() => {
                                  if (isSongInPlaylist) {
                                    removeSongFromPlaylist(pl.id, currentSong.videoId);
                                  } else {
                                    addSongToPlaylist(pl.id, currentSong);
                                  }
                                }}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 text-left group cursor-pointer ${
                                  isSongInPlaylist
                                    ? "bg-purple-900/40 border-purple-500/50 text-purple-200 shadow-md shadow-purple-950/40"
                                    : "bg-black/30 hover:bg-purple-600/20 border-white/10 hover:border-purple-500/35 text-white"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${pl.gradient || "from-purple-600 to-indigo-800"} border border-white/20 flex items-center justify-center shrink-0 text-white shadow-sm`}>
                                    <Music2 className="w-3.5 h-3.5 text-purple-100" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="truncate font-bold text-white group-hover:text-purple-200 block text-xs">
                                      {pl.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">
                                      {pl.songs?.length || 0} {pl.songs?.length === 1 ? "track" : "tracks"}
                                    </span>
                                  </div>
                                </div>

                                {isSongInPlaylist ? (
                                  <div className="w-6 h-6 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center text-purple-200 shadow-sm shrink-0">
                                    <Check className="w-3 h-3 text-purple-300" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-purple-400/50 transition-all shrink-0" />
                                )}
                              </button>
                            );
                          })
                      )}
                    </div>
                  </div>

                  {/* Clean Footer Bar */}
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-end shrink-0">
                    <button
                      onClick={() => {
                        setShowPlaylistMenu(false);
                        setPlaylistSearchQuery("");
                      }}
                      className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-950/60 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Section: Playback Controls & Timeline Progress */}
        <div className="flex flex-col items-center gap-2.5 flex-1 max-w-[720px] px-8">
          {/* Controls Row */}
          <div className="flex items-center gap-5">
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
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
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
          <div className="hidden sm:flex items-center gap-2.5 bg-white/[0.04] p-2 px-3.5 rounded-full border border-white/10 shadow-inner">
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
              className="w-24 h-1.5 bg-white/10 accent-purple-500 cursor-pointer rounded-full"
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
            className="absolute bottom-28 right-4 z-50 w-84 max-h-[440px] glass-card backdrop-blur-2xl bg-surface-950/90 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden"
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
                  <div
                    key={song.videoId || idx}
                    onClick={() => playSong(song)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 text-left cursor-pointer group/qitem ${
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
                    <SongContextMenu song={song} isInQueue={true} />
                  </div>
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
            className="fixed inset-0 z-[9999] bg-[#05030c] overflow-hidden flex flex-col select-none"
          >
            {/* Symphony Dynamic Ambient Artwork Glow */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-150 blur-[100px] saturate-[1.8] opacity-60 pointer-events-none transition-all duration-1000"
              style={{
                backgroundImage: `url(${currentSong?.thumbnail || "/placeholder.png"})`,
              }}
            />

            {/* Glowing Purple & Indigo Ambient Radial Orbs */}
            <div className="absolute -top-32 -right-32 w-[650px] h-[650px] bg-purple-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-[650px] h-[650px] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none" />

            {/* Vignette Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#05030c]/50 via-[#05030c]/70 to-[#05030c]/90 pointer-events-none" />

            {/* Header Toolbar */}
            <div className="relative z-10 p-6 md:px-12 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-white/20">
                  <Music2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-lg tracking-tight block">Symphony Canvas</span>
                  <span className="text-xs text-purple-300/80 font-medium block">Live Synchronized Lyrics</span>
                </div>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-3 rounded-full bg-white/10 hover:bg-purple-600/30 border border-white/15 text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-xl"
                title="Exit Fullscreen Canvas"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Body: Artwork & Controls on Left, Pure Lyrics on Right */}
            <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto px-6 lg:px-12 w-full overflow-hidden pb-8">
              {/* Left Column: Cover & Controls */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 text-center">
                {/* Artwork Card */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                  <img
                    src={currentSong?.thumbnail || "/placeholder.png"}
                    alt={currentSong?.title}
                    className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl object-cover shadow-[0_25px_60px_rgba(0,0,0,0.7)] border border-white/20"
                  />
                </div>

                {/* Track Info */}
                <div className="max-w-md space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-white truncate tracking-tight">
                    {currentSong?.title || "No track selected"}
                  </h2>
                  <p className="text-base font-bold text-purple-300/90 truncate">
                    {currentSong?.artist || currentSong?.author || "Unknown Artist"}
                  </p>
                </div>

                {/* Canvas Media Controls */}
                <div className="w-full max-w-md space-y-4 pt-2">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="relative h-2 bg-white/15 rounded-full cursor-pointer overflow-hidden group">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime || 0}
                        onChange={(e) => {
                          if (player) player.currentTime = Number(e.target.value);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-400 tabular-nums">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isShuffle ? "text-purple-300 bg-purple-500/20 border border-purple-500/40" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>

                    <button
                      onClick={playPrevious}
                      disabled={!currentSong}
                      className="p-2.5 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                    >
                      <SkipBack className="w-6 h-6 fill-current" />
                    </button>

                    <button
                      onClick={() => (isPlaying ? pauseSong() : resumeSong())}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 border border-white/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-white text-white" />
                      ) : (
                        <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={playNext}
                      disabled={!currentSong}
                      className="p-2.5 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                    >
                      <SkipForward className="w-6 h-6 fill-current" />
                    </button>

                    <button
                      onClick={() => currentSong && toggleFavorite(currentSong)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isFavorite ? "text-pink-400 bg-pink-500/15 border border-pink-500/30" : "text-zinc-400 hover:text-pink-400"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Full Height Edge-to-Edge Synchronized Lyrics */}
              <div className="lg:col-span-7 h-[75vh] lg:h-[82vh] overflow-hidden">
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