import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Trash2,
  X,
  Music2,
  Play,
  Pause,
  Plus,
  Clock,
  Shuffle,
  Heart,
  Edit3,
  Sparkles,
  Share2,
  Zap,
} from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import { searchMusic } from "../services/api";
import { motion } from "framer-motion";
import MusicCard from "../components/ui/MusicCard";
import SongContextMenu from "../components/ui/SongContextMenu";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.05 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
 * PlaylistPage - Spotify-Style Clean & Spacious Master View for Symphony.
 */
export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    playlists,
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    addSongToPlaylist,
    playSong,
    setQueue,
    setCurrentIndex,
    deletePlaylist,
    removeSongFromPlaylist,
    updatePlaylistName,
    updatePlaylistDetails,
    setIsShuffle,
    isShuffle,
  } = usePlayer();

  const playlist = playlists.find((p) => String(p.id) === id);

  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState(playlist?.name || "");
  const [customDescription, setCustomDescription] = useState(playlist?.description || "");
  const [isLiked, setIsLiked] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    if (playlist) {
      setCustomTitle(playlist.name);
      setCustomDescription(playlist.description || "");
    }
  }, [playlist]);

  const handleSaveDetails = (titleVal, descVal) => {
    const titleTrimmed = (titleVal || "").trim();
    const descTrimmed = (descVal || "").trim();
    if (playlist) {
      if (updatePlaylistDetails) {
        updatePlaylistDetails(playlist.id, {
          name: titleTrimmed || playlist.name,
          description: descTrimmed,
        });
      } else {
        updatePlaylistName(playlist.id, titleTrimmed || playlist.name);
      }
      setCustomTitle(titleTrimmed || playlist.name);
      setCustomDescription(descTrimmed);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    async function loadRecommended() {
      try {
        const data = await searchMusic("Top Trending Music", 6);
        const songsList = Array.isArray(data) ? data : data?.songs || [];
        setRecommendedSongs(songsList.slice(0, 6));
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
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-300 shadow-2xl backdrop-blur-xl">
          <Music2 className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Collection Not Found</h2>
        <p className="text-zinc-400 text-sm mt-2 font-medium max-w-sm">
          This playlist may have been moved or removed from your Symphony library.
        </p>
        <button
          onClick={() => navigate("/library")}
          className="mt-6 px-6 py-3 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:text-white hover:bg-purple-600/50 text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const isCurrentPlaylistPlaying =
    isPlaying && currentSong && playlist.songs.some((s) => s.videoId === currentSong.videoId);

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      if (currentSong && playlist.songs.some((s) => s.videoId === currentSong.videoId)) {
        if (isPlaying) pauseSong();
        else resumeSong();
      } else {
        setQueue(playlist.songs);
        setCurrentIndex(0);
        playSong(playlist.songs[0]);
      }
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
      className="pb-36 max-w-full mx-auto px-4 sm:px-8 space-y-6 relative select-none"
    >
      {/* 1. Spotify-Style Ambient Hero Header */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-purple-900/70 via-purple-950/40 to-transparent border border-white/10 flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 overflow-hidden shadow-2xl"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />

        {/* Large Clean Album Cover Art */}
        <div className="relative shrink-0 group">
          <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 rounded-2xl bg-gradient-to-br from-purple-900/80 via-surface-900 to-surface-950 border border-white/20 shadow-2xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300">
            {playlist.songs[0]?.thumbnail ? (
              <img
                src={playlist.songs[0].thumbnail}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-800 to-indigo-900">
                <Music2 className="w-16 h-16 text-purple-200 mb-2" />
                <span className="text-[10px] font-black text-purple-200 tracking-widest uppercase">
                  Symphony Playlist
                </span>
              </div>
            )}

            {/* Audiophile High-Res Tag */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-xl glass-pill flex items-center justify-between text-[10px] font-extrabold text-white uppercase tracking-wider backdrop-blur-md border border-white/15 shadow-lg">
              <span className="flex items-center gap-1 text-purple-300">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> 24-BIT HI-RES
              </span>
              <span className="text-zinc-400 font-mono">LOSSLESS</span>
            </div>
          </div>
        </div>

        {/* Header Metadata Info */}
        <div className="flex-1 text-center md:text-left space-y-3 min-w-0 pb-1 z-10">
          <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-extrabold uppercase tracking-widest">
              PLAYLIST
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/25 text-purple-200 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-300" /> Symphony Master
            </span>
          </div>

          {/* Title Header */}
          {isEditing ? (
            <div className="space-y-3 max-w-xl text-left bg-black/40 p-4 rounded-2xl border border-purple-500/40 backdrop-blur-xl">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="text-xl sm:text-2xl font-black text-white bg-black/60 rounded-xl px-3 py-2 border border-purple-500/50 outline-none w-full"
                placeholder="Playlist Title"
                autoFocus
              />
              <textarea
                rows={2}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Add an optional description..."
                className="text-xs sm:text-sm text-white bg-black/60 rounded-xl p-3 border border-purple-500/50 outline-none w-full resize-none"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleSaveDetails(customTitle, customDescription)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
                >
                  Save Details
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 bg-white/10 text-zinc-300 hover:text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="group/title flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight truncate drop-shadow-md leading-none">
                  {customTitle}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover/title:opacity-100 p-2 rounded-xl bg-white/10 hover:bg-purple-600/40 text-purple-300 transition-all cursor-pointer shrink-0"
                  title="Edit Playlist Details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {customDescription && (
                <p className="text-sm text-zinc-300/90 font-medium max-w-2xl leading-relaxed">
                  {customDescription}
                </p>
              )}
            </>
          )}

          {/* Subtitle Metadata */}
          <div className="flex items-center justify-center md:justify-start gap-2.5 text-xs sm:text-sm font-semibold text-zinc-300 pt-1 flex-wrap">
            <span className="text-white font-bold">User</span>
            <span className="text-zinc-500">•</span>
            <span className="text-purple-200 font-bold">{playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">{getTotalDuration(playlist.songs)}</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Action Controls Toolbar */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between py-4 px-2 my-2 border-b border-white/10 flex-wrap gap-4"
      >
        <div className="flex items-center gap-6">
          {/* Big Spotify-Style Round Play Button */}
          <motion.button
            onClick={handlePlayAll}
            disabled={playlist.songs.length === 0}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center shadow-xl shadow-purple-950/70 border border-white/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Play all"
          >
            {isCurrentPlaylistPlaying ? (
              <Pause className="w-6 h-6 fill-white text-white" fill="white" />
            ) : (
              <Play className="w-6 h-6 fill-white text-white ml-0.5" fill="white" />
            )}
          </motion.button>

          {/* Shuffle Button */}
          <button
            onClick={handleShufflePlay}
            disabled={playlist.songs.length === 0}
            className={`p-3 rounded-full transition-all cursor-pointer ${
              isShuffle
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full transition-all cursor-pointer ${
              isLiked ? "text-rose-400 bg-rose-500/20" : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
            title="Favorite"
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} fill={isLiked ? "currentColor" : "none"} />
          </button>

          {/* Edit Details */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Edit Details"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          {/* Add Active Song */}
          {currentSong && (
            <button
              onClick={() => addSongToPlaylist(playlist.id, currentSong)}
              className="p-3 rounded-full text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all cursor-pointer"
              title="Add current active song to playlist"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
            title="Share Link"
          >
            <Share2 className="w-5 h-5" />
            {copiedNotification && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-purple-900 text-purple-100 text-[10px] font-bold rounded shadow-lg whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>

        {/* Delete Playlist Button */}
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this playlist?")) {
              deletePlaylist(playlist.id);
              navigate("/library");
            }
          }}
          className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all text-xs font-bold cursor-pointer flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Playlist</span>
        </button>
      </motion.div>

      {/* 3. Spotify-Style Tracklist Table */}
      <motion.section variants={itemVariants} className="pt-2">
        {/* Table Header Row */}
        <div className="grid grid-cols-[24px_1fr_1fr_120px] gap-4 px-4 py-2.5 text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-white/10 select-none mb-2">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <div className="flex items-center justify-end pr-2 gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Empty State */}
        {playlist.songs.length === 0 ? (
          <div className="text-center py-24 rounded-2xl bg-white/[0.02] border border-white/5 my-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
              <Music2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">This playlist is empty</h3>
            <p className="text-zinc-400 mt-2 text-sm max-w-sm mx-auto font-medium">
              Add songs from search or recommended additions below.
            </p>
          </div>
        ) : (
          /* Track Rows — Clean, Borderless Spotify Layout */
          <div className="space-y-1">
            {playlist.songs.map((song, i) => {
              const isCurrent = currentSong?.videoId === song.videoId;

              return (
                <div
                  key={song.videoId || i}
                  onClick={() => {
                    setQueue(playlist.songs);
                    setCurrentIndex(i);
                    playSong(song);
                  }}
                  className={`grid grid-cols-[24px_1fr_1fr_120px] gap-4 items-center px-4 py-2.5 rounded-lg group cursor-pointer transition-colors duration-150 ${
                    isCurrent
                      ? "bg-purple-900/40 text-purple-200"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {/* # Column */}
                  <div className="flex items-center justify-center w-6 text-sm font-semibold text-zinc-400">
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end justify-center gap-[2px] h-3.5 w-3.5">
                        <span className="w-[2.5px] bg-purple-400 rounded-full animate-[wavePulse_0.6s_ease-in-out_infinite]" />
                        <span className="w-[2.5px] bg-purple-300 rounded-full animate-[wavePulse_0.8s_ease-in-out_0.2s_infinite]" />
                        <span className="w-[2.5px] bg-fuchsia-400 rounded-full animate-[wavePulse_0.5s_ease-in-out_0.4s_infinite]" />
                      </div>
                    ) : (
                      <>
                        <span className={`group-hover:hidden ${isCurrent ? "text-purple-300 font-bold" : ""}`}>
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
                      className="w-10 h-10 rounded object-cover shrink-0 shadow-md"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? "text-purple-300 font-bold" : "text-white group-hover:text-purple-200"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate font-medium">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Album Column */}
                  <div className="hidden md:block min-w-0">
                    <p className="text-sm text-zinc-400 font-medium truncate group-hover:text-zinc-200">
                      {song.album || song.artist || "Single"}
                    </p>
                  </div>

                  {/* Remove Button, Duration & Context Menu */}
                  <div className="flex items-center justify-end gap-2 pr-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(playlist.id, song.videoId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                      title="Remove track"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-zinc-400 font-semibold tabular-nums">
                      {song.duration || "--:--"}
                    </span>
                    <SongContextMenu song={song} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* 4. Recommended Additions Section */}
      {recommendedSongs.length > 0 && (
        <motion.section variants={itemVariants} className="pt-8 border-t border-white/10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Recommended Additions</span>
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              Curated recommendations for this playlist
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendedSongs.slice(0, 6).map((item, i) => (
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
                  className="absolute top-2 right-2 p-2 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 cursor-pointer"
                  title="Add to playlist"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}