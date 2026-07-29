import { motion } from 'framer-motion';
import { Heart, Play, Clock, Shuffle, Volume2, Sparkles, Music2 } from 'lucide-react';
import usePlayer from "../hooks/usePlayer";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.06 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/**
 * FavoritesPage - Symphony Design Language (SDL) Liked Songs Collection View.
 */
export default function FavoritesPage() {
  const {
    favorites,
    playSong,
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
      setQueue(favorites);
      setCurrentIndex(0);
      playSong(favorites[0]);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10 sm:space-y-12 pb-36 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Background Ambient Radial Purple Glow */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Symphony Unique Hero Header */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-8 sm:p-10 lg:p-12 backdrop-blur-2xl bg-gradient-to-br from-purple-950/75 via-[#0d091e]/85 to-[#070410]/95 border border-purple-500/25 flex flex-col sm:flex-row items-center sm:items-end gap-8 sm:gap-10 select-none shadow-2xl shadow-purple-950/60"
      >
        {/* Top Specular Purple Hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-90 rounded-t-3xl pointer-events-none" />

        {/* Cover Artwork Card */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-900 rounded-[32px] blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
          <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-950 border border-purple-400/35 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            <Heart className="w-18 h-18 sm:w-22 sm:h-22 text-purple-100 fill-purple-400/60 drop-shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-purple-200/90 mt-3">Symphony Vault</span>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-4 text-center sm:text-left flex-1 min-w-0 pb-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase tracking-widest w-fit mx-auto sm:mx-0 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Symphony Collection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 drop-shadow-sm leading-tight">
            Liked Songs
          </h1>

          <p className="text-zinc-400 text-sm font-semibold flex items-center justify-center sm:justify-start gap-2.5">
            <span>Your curated library</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
            <span className="text-purple-200 font-bold">{favorites.length} {favorites.length === 1 ? 'track' : 'tracks'}</span>
          </p>
        </div>
      </motion.div>

      {/* Action Controls Bar */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 sm:gap-5 py-3 my-2 sm:my-4">
        <motion.button
          onClick={handlePlayAll}
          disabled={favorites.length === 0}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/40 border border-white/20 flex items-center gap-3 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Play all liked songs"
        >
          <Play className="w-5 h-5 fill-white text-white" />
          <span>Play Collection</span>
        </motion.button>

        <motion.button
          onClick={() => setIsShuffle(!isShuffle)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`px-6 py-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            isShuffle
              ? "bg-purple-600/30 border-purple-500/50 text-purple-200 shadow-md shadow-purple-950/50"
              : "glass-card border-white/15 text-zinc-300 hover:text-white hover:bg-purple-600/20"
          }`}
          aria-label="Shuffle"
        >
          <Shuffle className="w-4 h-4 text-purple-300" />
          <span>Shuffle</span>
        </motion.button>
      </motion.div>

      {/* Tracklist View */}
      <motion.div variants={itemVariants} className="space-y-4 pt-2">
        {/* Table Header */}
        <div className="grid grid-cols-[36px_1fr_1fr_90px] gap-4 px-6 py-3.5 text-xs font-extrabold text-purple-300/70 uppercase tracking-wider border-b border-purple-500/20 select-none mb-3">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden sm:block">Artist</span>
          <div className="flex items-center justify-end pr-2 gap-3">
            <Clock className="w-4 h-4 text-purple-300/80" />
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-28 rounded-3xl border border-white/10 glass-card bg-white/[0.02] my-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-400 shadow-inner">
              <Heart className="w-10 h-10 fill-purple-500/30" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Your vault is empty</h2>
            <p className="text-zinc-400 mt-2 text-sm max-w-sm mx-auto font-medium leading-relaxed">
              Save your favorite tracks by clicking the heart icon on any song.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3 pt-2">
            {favorites.map((song, i) => {
              const isCurrent = currentSong?.videoId === song.videoId;

              return (
                <motion.div
                  key={song.videoId || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => {
                    setQueue(favorites);
                    setCurrentIndex(i);
                    playSong(song);
                  }}
                  className={`grid grid-cols-[36px_1fr_1fr_90px] gap-4 items-center px-6 py-4 sm:py-4.5 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                    isCurrent
                      ? "bg-purple-900/40 border-purple-500/40 text-purple-200 shadow-lg shadow-purple-950/40"
                      : "border-transparent hover:bg-purple-900/20 hover:border-purple-500/25 text-white"
                  }`}
                >
                  {/* # Column */}
                  <div className="flex items-center justify-center w-8 text-sm font-bold text-zinc-400">
                    {isCurrent && isPlaying ? (
                      <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                    ) : (
                      <>
                        <span className={`group-hover:hidden ${isCurrent ? "text-purple-300 font-black" : ""}`}>
                          {i + 1}
                        </span>
                        <Play className="w-4 h-4 text-white fill-white hidden group-hover:block ml-0.5" fill="white" />
                      </>
                    )}
                  </div>

                  {/* Title & Cover */}
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <p
                        className={`text-sm sm:text-base font-bold truncate tracking-tight ${
                          isCurrent ? "text-purple-200" : "text-white group-hover:text-purple-200"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate sm:hidden font-medium">{song.artist}</p>
                    </div>
                  </div>

                  {/* Artist */}
                  <p className="text-sm font-medium text-zinc-400 truncate hidden sm:block group-hover:text-zinc-200 transition-colors">
                    {song.artist}
                  </p>

                  {/* Heart & Duration */}
                  <div className="flex items-center justify-end gap-4 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song);
                      }}
                      className="p-1.5 rounded-full hover:scale-110 transition-transform cursor-pointer"
                      title="Remove from Liked Songs"
                    >
                      <Heart className="w-4.5 h-4.5 text-purple-400 fill-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]" fill="currentColor" />
                    </button>
                    <span className="text-sm text-zinc-400 font-semibold tabular-nums">
                      {song.duration || "--:--"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
