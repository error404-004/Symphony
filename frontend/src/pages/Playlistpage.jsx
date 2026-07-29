import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Trash2,
  X,
  Music2,
  Play,
  Plus,
  Clock,
  Volume2,
  Shuffle,
  Heart,
  Info,
  Edit3,
  Sparkles,
  Disc,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Share2,
} from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import { searchMusic } from "../services/api";
import { motion } from "framer-motion";
import MusicCard from "../components/ui/MusicCard";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.08 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Calculates total formatted duration from playlist tracks array.
 */
function getTotalDuration(songs) {
  if (!songs || songs.length === 0) return "0 min";
  let totalSeconds = 0;
  songs.forEach((song) => {
    if (song.duration) {
      const parts = song.duration.split(":").map(Number);
      if (parts.length === 2) {
        totalSeconds += parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    }
  });
  if (totalSeconds === 0) return `${songs.length * 3.5} min`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins >= 60
    ? `${Math.floor(mins / 60)} hr ${mins % 60} min`
    : `${mins} min ${secs > 0 ? `${secs} sec` : ""}`;
}

/**
 * PlaylistPage - Premium Playlist Master Experience in Symphony Design System.
 */
export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    playlists,
    currentSong,
    isPlaying,
    addSongToPlaylist,
    playSong,
    setQueue,
    setCurrentIndex,
    deletePlaylist,
    removeSongFromPlaylist,
  } = usePlayer();

  const playlist = playlists.find((p) => String(p.id) === id);

  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState(playlist?.name || "");
  const [isLiked, setIsLiked] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    if (playlist) {
      setCustomTitle(playlist.name);
    }
  }, [playlist]);

  useEffect(() => {
    async function loadRecommended() {
      try {
        const data = await searchMusic("Top Trending Music", 5);
        setRecommendedSongs(Array.isArray(data) ? data : data.songs || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadRecommended();
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-300 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
          <Music2 className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Collection Not Found</h2>
        <p className="text-zinc-400 text-sm mt-2 font-medium max-w-sm">
          This playlist may have been moved or removed from your Symphony library.
        </p>
        <button
          onClick={() => navigate("/library")}
          className="mt-6 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-400 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      setQueue(playlist.songs);
      setCurrentIndex(0);
      playSong(playlist.songs[0]);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.songs.length > 0) {
      const shuffled = [...playlist.songs].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentIndex(0);
      playSong(shuffled[0]);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="mt-4 space-y-8 pb-40 relative"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-48 right-0 w-[420px] h-[420px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Playlist Hero Showcase Header */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-[32px] overflow-hidden px-12 pt-7 pb-9 glass-card backdrop-blur-3xl bg-surface-950/85 border border-white/12 flex flex-col md:flex-row items-start md:items-start gap-6 sm:gap-8 select-none shadow-2xl shadow-purple-950/40 group/hero z-10"
      >
        {/* Specular Highlight Hairline */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/50 to-transparent opacity-80 pointer-events-none" />

        {/* Ambient Shimmer Beam */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer pointer-events-none" />

        {/* 3D Vinyl Disc & Album Cover Presenter */}
        <div className="relative group shrink-0 ml-2">
          {/* Interactive Vinyl Record Sliding Out */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 left-6 w-40 h-40 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full vinyl-grooves border border-white/10 shadow-2xl flex items-center justify-center transition-all duration-700 ease-out group-hover:translate-x-18 sm:group-hover:translate-x-20 z-0 ${
              isPlaying ? "translate-x-14 sm:translate-x-16 animate-spin-slow" : "translate-x-4 sm:translate-x-5 opacity-90"
            }`}
          >
            {/* Center Spindle Label */}
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-purple-950 via-purple-700 to-indigo-800 border-2 border-white/30 flex items-center justify-center shadow-inner relative">
              <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-zinc-950 border border-white/40 shadow-inner" />
              <Disc className="w-5 h-5 text-purple-200/40 absolute opacity-30 animate-spin-slow" />
            </div>
          </motion.div>

          {/* Album Cover Glass Frame */}
          <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-2xl bg-gradient-to-br from-purple-900/60 via-surface-900 to-surface-950 border border-white/20 p-1.5 shadow-2xl shadow-purple-950/80 overflow-hidden backdrop-blur-xl group-hover:shadow-purple-500/25 transition-all duration-500">
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-black/60 flex items-center justify-center group">
              {playlist.songs[0]?.thumbnail ? (
                <img
                  src={playlist.songs[0].thumbnail}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <Music2 className="w-14 h-14 text-purple-400/60 mb-2 animate-bounce" />
                  <span className="text-[10px] font-extrabold text-purple-300/80 tracking-widest uppercase">
                    Symphony Audio
                  </span>
                </div>
              )}

              {/* Glass Angle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />

              {/* Audiophile High-Res Tag */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1.5 rounded-xl glass-pill flex items-center justify-between text-[10px] font-extrabold text-white uppercase tracking-wider backdrop-blur-md border border-white/15 shadow-lg">
                <span className="flex items-center gap-1 text-purple-300">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> 24-BIT HI-RES
                </span>
                <span className="text-zinc-400 font-mono">LOSSLESS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Metadata & Title Header - Centered & Upwards */}
        <div className="flex-1 flex flex-col justify-center md:self-center space-y-3 min-w-0 text-center md:text-left z-10">
          {/* Header Badges & Created By Tag */}
          <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-500/25 border border-purple-400/40 text-purple-200 text-[11px] font-black uppercase tracking-widest shadow-md">
              PLAYLIST
            </span>

            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Created by <strong className="text-white">User</strong>
            </span>

            <span className="text-zinc-600 hidden sm:inline">•</span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-200 text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-purple-300" />
              Symphony Master
            </span>

            <span className="px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-extrabold tracking-wider uppercase">
              DOLBY ATMOS
            </span>
          </div>

          {/* Interactive Title */}
          {isEditing ? (
            <div className="flex items-center gap-2 max-w-xl">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                className="text-3xl sm:text-5xl font-black text-white bg-purple-950/70 rounded-2xl px-4 py-2 border-2 border-purple-500/60 outline-none w-full shadow-2xl shadow-purple-500/20 focus:ring-4 focus:ring-purple-500/30"
                autoFocus
              />
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shrink-0 cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="group/title flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-gradient-purple drop-shadow-md truncate leading-tight">
                {customTitle}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover/title:opacity-100 p-2 rounded-xl bg-white/10 hover:bg-purple-600/40 text-purple-300 transition-all duration-200 cursor-pointer shrink-0"
                title="Edit Playlist Title"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Description */}
          <p className="mt-2 text-sm sm:text-base text-zinc-300 font-medium max-w-xl leading-relaxed">
            Curated personal playlist collection in{" "}
            <span className="text-purple-300 font-bold">Symphony</span>. Featuring ultra-high fidelity audio streaming, acoustic clarity, and synchronized lyrics.
          </p>

          {/* Metadata Chips Line */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold pt-2 flex-wrap text-zinc-300">
            <span className="text-purple-300 font-bold">User Collection</span>
            <span className="text-zinc-600">•</span>
            <span className="text-white font-bold">{playlist.songs.length} songs</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-medium">{getTotalDuration(playlist.songs)}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 font-medium">Updated Recently</span>
          </div>
        </div>
      </motion.div>

      {/* Primary Actions Bar */}
      <motion.div
        variants={itemVariants}
        className="mt-8 flex items-center justify-between py-4 mb-4 flex-wrap gap-4 border-b border-white/[0.08] pb-6"
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* ▶ PLAY ALL Button */}
          <motion.button
            onClick={handlePlayAll}
            disabled={playlist.songs.length === 0}
            whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(168, 85, 247, 0.55)" }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wider shadow-xl shadow-purple-950/80 border border-white/20 disabled:opacity-40 transition-all duration-300 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white text-white ml-0.5" fill="white" />
            <span>PLAY ALL</span>
          </motion.button>

          {/* 🔀 SHUFFLE Button */}
          <motion.button
            onClick={handleShufflePlay}
            disabled={playlist.songs.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-full glass-card border border-white/15 text-zinc-200 hover:text-white hover:bg-purple-600/25 disabled:opacity-40 transition-all duration-200 text-xs font-bold shadow-md cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-purple-300" />
            <span>Shuffle</span>
          </motion.button>

          {/* ❤️ FAVORITE PLAYLIST Button */}
          <motion.button
            onClick={() => setIsLiked(!isLiked)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-full border transition-all duration-200 text-xs font-bold shadow-md cursor-pointer ${
              isLiked
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-rose-950/40"
                : "glass-card border-white/15 text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500 animate-bounce" : "text-zinc-400"}`}
              fill={isLiked ? "#f43f5e" : "none"}
            />
            <span>{isLiked ? "Favorited" : "Favorite"}</span>
          </motion.button>

          {/* ✏ EDIT TITLE Button */}
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-3.5 rounded-full glass-card border border-white/15 text-zinc-200 hover:text-white text-xs font-bold shadow-md hover:bg-purple-600/20 transition-all duration-200 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-purple-300" />
            <span>Edit Title</span>
          </motion.button>

          {/* ➕ ADD CURRENT SONG Button */}
          {currentSong && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => addSongToPlaylist(playlist.id, currentSong)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-600/30 text-xs font-bold shadow-md transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Add Active Song</span>
            </motion.button>
          )}

          {/* SHARE LINK Button */}
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="py-4 px-5 rounded-full glass-card border border-white/15 text-zinc-300 hover:text-white hover:bg-purple-600/20 transition-all duration-200 shadow-md cursor-pointer relative"
            title="Share Playlist Link"
          >
            <Share2 className="w-4.5 h-4.5" />
            {copiedNotification && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-900 border border-purple-400 text-purple-100 text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </motion.button>
        </div>

        {/* DELETE PLAYLIST Button */}
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this playlist?")) {
              deletePlaylist(playlist.id);
              navigate("/library");
            }
          }}
          className="flex items-center gap-2 px-4 py-3.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold border border-red-500/20 transition-all duration-200 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Playlist</span>
        </button>
      </motion.div>

      {/* Track List Section */}
      <motion.section variants={itemVariants} className="space-y-4 my-6">
        {/* Track Table Header */}
        <div className="grid grid-cols-[36px_1fr_1fr_80px] gap-4 px-4 py-3.5 text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-white/10 select-none mb-4">
          <span className="text-center">#</span>
          <span>Title & Artist</span>
          <span className="hidden sm:block">Audio Spec</span>
          <div className="flex justify-end pr-2">
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Track Rows / Empty State */}
        {playlist.songs.length === 0 ? (
          <div className="glass-card backdrop-blur-2xl border border-white/10 bg-surface-950/70 p-12 sm:p-16 text-center rounded-3xl my-6 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400 shadow-xl shadow-purple-950/40">
              <Music2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-white">This Playlist is Empty</h3>
            <p className="text-zinc-400 text-sm mt-1.5 font-medium max-w-md">
              Start building your collection! Search for tracks or pick from recommended additions below to populate this playlist.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 my-4">
            {playlist.songs.map((song, i) => {
              const isCurrent = currentSong?.videoId === song.videoId;

              return (
                <motion.div
                  key={song.videoId || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => {
                    setQueue(playlist.songs);
                    setCurrentIndex(i);
                    playSong(song);
                  }}
                  className={`grid grid-cols-[36px_1fr_1fr_80px] gap-4 items-center px-5 py-4 rounded-2xl glass-card backdrop-blur-xl bg-surface-950/60 border border-white/5 hover:border-purple-500/40 group cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/15 ${
                    isCurrent ? "border-purple-500/60 bg-purple-900/25 shadow-purple-950/50" : ""
                  }`}
                >
                  {/* # Column with Live Equalizer */}
                  <div className="flex items-center justify-center w-9 text-sm font-extrabold text-zinc-400">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end justify-center gap-[3px] h-4 w-4">
                        <span className="w-[3px] bg-purple-400 rounded-full animate-[wavePulse_0.6s_ease-in-out_infinite]" />
                        <span className="w-[3px] bg-purple-300 rounded-full animate-[wavePulse_0.8s_ease-in-out_0.2s_infinite]" />
                        <span className="w-[3px] bg-fuchsia-400 rounded-full animate-[wavePulse_0.5s_ease-in-out_0.4s_infinite]" />
                      </div>
                    ) : (
                      <>
                        <span className={`group-hover:hidden ${isCurrent ? "text-purple-300" : ""}`}>
                          {i + 1}
                        </span>
                        <Play className="w-4 h-4 text-white fill-white hidden group-hover:block ml-0.5" fill="white" />
                      </>
                    )}
                  </div>

                  {/* Title & Artwork Column */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0 overflow-hidden rounded-xl border border-white/10 group-hover:scale-105 transition-transform duration-300 shadow-md">
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-12 h-12 object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate tracking-tight transition-colors ${
                          isCurrent ? "text-purple-300 font-black" : "text-white group-hover:text-purple-200"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate font-medium mt-0.5 group-hover:text-zinc-300 transition-colors">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Audio Spec / Quality Column */}
                  <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-purple-300 text-[10px] font-mono">
                      24-BIT FLAC
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 text-[11px]">Lossless</span>
                  </div>

                  {/* Remove Button & Duration Column */}
                  <div className="flex items-center justify-end gap-3 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(playlist.id, song.videoId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
                      title="Remove track"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-zinc-400 font-bold tabular-nums">
                      {song.duration || "--:--"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Playlist Metadata & Specs Glass Dashboard */}
      <motion.section variants={itemVariants} className="mt-10 mb-12 pt-2">
        <div className="glass-card backdrop-blur-2xl bg-surface-950/85 border border-white/12 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl shadow-purple-950/30 relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-purple-300 font-extrabold text-sm uppercase tracking-wider">
            <Info className="w-4.5 h-4.5 text-purple-400" />
            <span>Playlist Audio Architecture & Specs</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-400 font-medium block">Owner / Creator</span>
              <span className="text-white font-bold text-sm block">User</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-400 font-medium block">Tracks & Count</span>
              <span className="text-white font-bold text-sm block">{playlist.songs.length} Tracks</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-400 font-medium block">Audio Standard</span>
              <span className="text-purple-300 font-bold text-sm block">24-Bit / 192kHz Studio Master</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-400 font-medium block">Cloud Sync Status</span>
              <span className="text-emerald-400 font-bold text-sm block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Synchronized
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Recommended Additions Section */}
      {recommendedSongs.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-6 mt-12 pt-6">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-xl font-black leading-none text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Recommended Additions
            </h2>
            <span className="text-xs text-zinc-400 font-semibold">Curated for this collection</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-9">
            {recommendedSongs.map((item, i) => (
              <div key={item.videoId || i} className="relative group">
                <MusicCard
                  title={item.title}
                  artist={item.artist}
                  thumbnail={item.thumbnail}
                  index={i}
                  onClick={() => playSong(item)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addSongToPlaylist(playlist.id, item);
                  }}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer hover:scale-110"
                  title="Add to playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}