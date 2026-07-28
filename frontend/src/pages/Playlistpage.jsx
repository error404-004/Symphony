import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trash2, X, Music2, Play, Plus, Clock, Volume2, Shuffle, Heart, Info, Edit3, MoreHorizontal, Sparkles } from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import { searchMusic } from "../services/api";
import { motion } from "framer-motion";
import MusicCard from "../components/ui/MusicCard";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.08 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

/**
 * PlaylistPage - Premium Playlist Details page in Symphony Design Language (SDL).
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

  useEffect(() => {
    if (playlist) {
      setCustomTitle(playlist.name);
    }
  }, [playlist]);

  useEffect(() => {
    async function loadRecommended() {
      try {
        const data = await searchMusic("Top Trending", 5);
        setRecommendedSongs(Array.isArray(data) ? data : data.songs || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadRecommended();
  }, []);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-300 shadow-lg shadow-purple-950/30">
          <Music2 className="w-8 h-8" />
        </div>
        <p className="text-xl font-bold text-white tracking-tight">Collection Not Found</p>
        <p className="text-zinc-400 text-sm mt-1 font-medium">This playlist may have been removed.</p>
        <button
          onClick={() => navigate('/library')}
          className="mt-6 px-5 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-600/30 text-sm font-semibold transition-all duration-200"
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
      className="space-y-8 sm:space-y-10 pb-40 sm:pb-48 relative"
    >
      {/* Background Ambient Lighting */}
      <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Playlist Hero Header Section */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-6 sm:p-10 glass-card backdrop-blur-2xl bg-surface-950/80 border border-white/10 flex flex-col md:flex-row items-start md:items-end gap-6 sm:gap-8 select-none shadow-2xl shadow-purple-950/30"
      >
        {/* Specular Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70 pointer-events-none" />

        {/* Large Playlist Cover */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-br from-purple-600/30 to-indigo-600/20 rounded-3xl blur-xl opacity-80 pointer-events-none" />
          <div className="w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-2xl bg-gradient-to-br from-purple-900/50 via-surface-800 to-surface-950 border border-white/10 flex items-center justify-center shrink-0 shadow-2xl shadow-black/80 relative overflow-hidden">
            {playlist.songs[0]?.thumbnail ? (
              <img
                src={playlist.songs[0].thumbnail}
                alt={playlist.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Music2 className="w-16 h-16 sm:w-20 sm:h-20 text-purple-300/40" />
            )}
          </div>
        </div>

        {/* Playlist Metadata Header */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              Playlist
            </span>
            <span className="text-xs font-semibold text-zinc-400">Created by User</span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white bg-white/10 rounded-xl px-3 py-1 border border-purple-500/40 outline-none w-full"
              autoFocus
            />
          ) : (
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-sm truncate">
              {customTitle}
            </h1>
          )}

          <p className="text-sm text-zinc-300 font-medium max-w-xl">
            Curated personal playlist collection in Symphony. Featuring ultra-high fidelity audio streaming and synchronized lyrics.
          </p>

          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300 pt-1 flex-wrap">
            <span className="text-purple-300 font-bold">User Collection</span>
            <span className="text-zinc-600">•</span>
            <span className="text-white font-bold">{playlist.songs.length} songs</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 font-medium">Updated Recently</span>
          </div>
        </div>
      </motion.div>

      {/* Primary Actions Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between py-3 my-2 flex-wrap gap-4 border-b border-white/[0.06] pb-5">
        <div className="flex items-center gap-4 flex-wrap">
          {/* ▶ Play Button */}
          <motion.button
            onClick={handlePlayAll}
            disabled={playlist.songs.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-950/60 border border-white/20 disabled:opacity-50 transition-all duration-200"
          >
            <Play className="w-5 h-5 ml-0.5 text-white fill-white" fill="white" />
            <span>Play</span>
          </motion.button>

          {/* 🔀 Shuffle */}
          <motion.button
            onClick={handleShufflePlay}
            disabled={playlist.songs.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3.5 rounded-full glass-card border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:bg-purple-600/20 disabled:opacity-50 transition-all duration-200 shadow-md"
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </motion.button>

          {/* ✏ Edit Playlist Title */}
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-3 rounded-full glass-card border border-white/10 hover:border-purple-500/40 text-white text-xs font-bold shadow-md hover:bg-purple-600/20 transition-all duration-200"
          >
            <Edit3 className="w-4 h-4 text-purple-300" />
            Edit Playlist
          </motion.button>

          {/* ➕ Add Current Song */}
          {currentSong && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addSongToPlaylist(playlist.id, currentSong)}
              className="flex items-center gap-2 px-5 py-3 rounded-full glass-card border border-white/10 hover:border-purple-500/40 text-white text-xs font-bold shadow-md hover:bg-purple-600/20 transition-all duration-200"
            >
              <Plus className="w-4 h-4 text-purple-300" />
              Add Current Song
            </motion.button>
          )}
        </div>

        {/* Delete Playlist */}
        <button
          onClick={() => {
            if (window.confirm("Delete this playlist?")) {
              deletePlaylist(playlist.id);
              navigate("/library");
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold border border-red-500/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Playlist
        </button>
      </motion.div>

      {/* Track List Section */}
      <motion.section variants={itemVariants} className="space-y-4 my-6">
        {/* Track Table Header */}
        <div className="grid grid-cols-[32px_1fr_1fr_70px] gap-4 px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10 select-none mb-4">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden sm:block">Artist</span>
          <div className="flex justify-end pr-2">
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Track Rows */}
        {playlist.songs.length === 0 ? (
          <div className="glass-card backdrop-blur-xl border border-white/10 bg-surface-950/70 p-12 sm:p-14 text-center rounded-2xl my-6 shadow-xl">
            <Music2 className="w-12 h-12 mx-auto text-purple-300/30 mb-3" />
            <h3 className="text-lg font-bold text-white">This playlist is empty</h3>
            <p className="text-zinc-400 text-sm mt-1 font-medium">
              Play any song and click "Add Current Song" to populate this playlist.
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
                  className={`grid grid-cols-[32px_1fr_1fr_70px] gap-4 items-center p-3 rounded-2xl glass-card backdrop-blur-xl bg-surface-950/60 border border-white/5 hover:border-purple-500/40 group cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/15 ${
                    isCurrent ? "border-purple-500/50 bg-purple-600/20 shadow-purple-950/40" : ""
                  }`}
                >
                  {/* # Column */}
                  <div className="flex items-center justify-center w-8 text-sm font-bold text-zinc-400">
                    {isCurrent && isPlaying ? (
                      <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
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
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 shadow border border-white/5 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate tracking-tight transition-colors ${
                          isCurrent ? "text-purple-300" : "text-white group-hover:text-purple-200"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate sm:hidden font-medium mt-0.5">{song.artist}</p>
                    </div>
                  </div>

                  {/* Artist Column */}
                  <p className="text-xs text-zinc-400 font-medium truncate hidden sm:block group-hover:text-zinc-200 transition-colors">
                    {song.artist}
                  </p>

                  {/* Remove Button / Duration Column */}
                  <div className="flex items-center justify-end gap-2 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(playlist.id, song.videoId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200"
                      title="Remove from playlist"
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

      {/* Playlist Information Glass Card */}
      <motion.section variants={itemVariants} className="my-8 pt-4">
        <div className="glass-card backdrop-blur-xl bg-surface-950/80 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl shadow-purple-950/20">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <Info className="w-4.5 h-4.5" />
            <span>Playlist Information & Metadata</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-3 border-t border-white/5 text-xs">
            <div>
              <span className="text-zinc-500 font-medium block">Owner / Creator</span>
              <span className="text-white font-bold text-sm mt-0.5 block">User</span>
            </div>
            <div>
              <span className="text-zinc-500 font-medium block">Song Count</span>
              <span className="text-white font-bold text-sm mt-0.5 block">{playlist.songs.length} Tracks</span>
            </div>
            <div>
              <span className="text-zinc-500 font-medium block">Audio Fidelity</span>
              <span className="text-white font-bold text-sm mt-0.5 block">Ultra Lossless</span>
            </div>
            <div>
              <span className="text-zinc-500 font-medium block">Status</span>
              <span className="text-white font-bold text-sm mt-0.5 block">Synchronized</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Recommended Songs Section */}
      {recommendedSongs.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-5 my-8 pt-4">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Recommended Additions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {recommendedSongs.map((item, i) => (
              <MusicCard
                key={item.videoId || i}
                title={item.title}
                artist={item.artist}
                thumbnail={item.thumbnail}
                index={i}
                onClick={() => playSong(item)}
              />
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}