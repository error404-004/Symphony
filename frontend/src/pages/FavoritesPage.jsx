import { motion } from 'framer-motion';
import { Heart, Play, Clock, Shuffle, Volume2, Sparkles, Music2, Pause } from 'lucide-react';
import usePlayer from "../hooks/usePlayer";
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
 * FavoritesPage - Spotify-Exact Spacious & Clean Liked Songs View for Symphony.
 */
export default function FavoritesPage() {
  const {
    favorites,
    playSong,
    pauseSong,
    resumeSong,
    setQueue,
    setCurrentIndex,
    currentSong,
    isPlaying,
    toggleFavorite,
    setIsShuffle,
    isShuffle,
  } = usePlayer();

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      if (currentSong && favorites.some((s) => s.videoId === currentSong.videoId)) {
        if (isPlaying) pauseSong();
        else resumeSong();
      } else {
        setQueue(favorites);
        setCurrentIndex(0);
        playSong(favorites[0]);
      }
    }
  };

  const isCurrentPlaylistPlaying =
    isPlaying && currentSong && favorites.some((s) => s.videoId === currentSong.videoId);

  const userProfile = (() => {
    try {
      const saved = localStorage.getItem('symphony_user_profile')
      return saved ? JSON.parse(saved) : { name: 'Symphony Listener' }
    } catch {
      return { name: 'Symphony Listener' }
    }
  })()

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="pb-40 max-w-full mx-auto px-4 sm:px-8 space-y-6 relative select-none"
    >
      {/* 1. Spotify-Style Ambient Hero Header Banner */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-purple-900/80 via-purple-950/40 to-transparent flex flex-col md:flex-row items-center md:items-center gap-6 sm:gap-10 overflow-hidden shadow-2xl mb-6"
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[150px] pointer-events-none" />

        {/* Large Spotify-Style Cover Art */}
        <div className="relative shrink-0 group">
          <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-500 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center border border-white/20 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
            <Heart className="w-20 h-20 sm:w-24 sm:h-24 text-white fill-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-purple-100/90 mt-3 backdrop-blur-md px-4 py-1 rounded-full bg-black/20 border border-white/10">
              Symphony Vault
            </span>
          </div>
        </div>

        {/* Title & Metadata Header Info — Vertically Centered */}
        <div className="flex-1 text-center md:text-left min-w-0 z-10 py-2">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3.5 py-1 rounded-full">
              Playlist
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight truncate drop-shadow-lg leading-tight mb-3">
            Liked Songs
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-3 text-xs sm:text-sm font-semibold text-zinc-300 pt-1 flex-wrap">
            <span className="text-white font-bold">{userProfile.name}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-purple-200 font-bold">
              {favorites.length} {favorites.length === 1 ? 'song' : 'songs'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 2. Action Controls Toolbar */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between px-2 my-4"
      >
        <div className="flex items-center gap-6">
          {/* Reduced Sleek Play Button (48px) */}
          <motion.button
            onClick={handlePlayAll}
            disabled={favorites.length === 0}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-400 text-white flex items-center justify-center shadow-xl shadow-purple-950/80 border border-white/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Play all"
          >
            {isCurrentPlaylistPlaying ? (
              <Pause className="w-5 h-5 fill-white text-white" fill="white" />
            ) : (
              <Play className="w-5 h-5 fill-white text-white ml-0.5" fill="white" />
            )}
          </motion.button>

          {/* Shuffle Toggle */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              isShuffle
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
            title="Shuffle play"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* 3. Spotify-Style Tracklist Table with Clean Separation */}
      <motion.section variants={itemVariants} className="pt-4">
        {/* Table Header Row */}
        <div className="grid grid-cols-[32px_1fr_1fr_120px] gap-6 px-4 pb-4 mb-4 text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-white/15 select-none">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden md:block">Artist</span>
          <div className="flex items-center justify-end pr-2 gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-28 rounded-2xl bg-white/[0.02] border border-white/5 my-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
              <Heart className="w-8 h-8 fill-purple-500/30" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Your vault is empty</h3>
            <p className="text-zinc-400 mt-2 text-sm max-w-sm mx-auto font-medium">
              Save your favorite songs by clicking the heart icon on any track.
            </p>
          </div>
        ) : (
          /* Track Rows — Spacious, Borderless Spotify Layout */
          <div className="space-y-2 pt-1">
            {favorites.map((song, i) => {
              const isCurrent = currentSong?.videoId === song.videoId;

              return (
                <div
                  key={song.videoId || i}
                  onClick={() => {
                    setQueue(favorites);
                    setCurrentIndex(i);
                    playSong(song);
                  }}
                  className={`grid grid-cols-[32px_1fr_1fr_120px] gap-6 items-center px-4 py-3.5 rounded-xl group cursor-pointer transition-colors duration-150 ${
                    isCurrent
                      ? "bg-purple-900/40 text-purple-200"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {/* # Column */}
                  <div className="flex items-center justify-center w-7 text-sm font-semibold text-zinc-400">
                    {isCurrent && isPlaying ? (
                      <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
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
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-12 h-12 rounded-md object-cover shrink-0 shadow-md"
                    />
                    <div className="min-w-0 space-y-1">
                      <p
                        className={`text-sm sm:text-base font-bold truncate ${
                          isCurrent ? "text-purple-300" : "text-white group-hover:text-purple-200"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate md:hidden font-medium">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Artist Column */}
                  <div className="hidden md:block min-w-0">
                    <p className="text-sm text-zinc-400 font-medium truncate group-hover:text-zinc-200">
                      {song.artist}
                    </p>
                  </div>

                  {/* Heart, Duration & Context Menu */}
                  <div className="flex items-center justify-end gap-3 pr-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song);
                      }}
                      className="p-1.5 rounded-full hover:scale-110 transition-transform cursor-pointer"
                      title="Remove from Liked Songs"
                    >
                      <Heart className="w-4 h-4 text-purple-400 fill-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" fill="currentColor" />
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
    </motion.div>
  );
}
