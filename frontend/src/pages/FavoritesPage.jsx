import { motion } from 'framer-motion'
import { Heart, Music2, Play, Clock, Shuffle } from 'lucide-react'
import usePlayer from "../hooks/usePlayer";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.05 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

/**
 * FavoritesPage - Liked/favorite songs presented as a track list.
 */
export default function FavoritesPage() {
  const {
  favorites,
  playSong,
  } = usePlayer();
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-8 lg:p-10"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-primary-800/20 to-surface-950 z-0" />
        <div className="absolute inset-0 gradient-glow z-0" />

        <div className="relative z-10 flex items-end gap-6">
          {/* Large heart icon */}
          <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center shadow-2xl shadow-primary-600/30 shrink-0">
            <Heart className="w-16 h-16 lg:w-20 lg:h-20 text-white" fill="currentColor" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-primary-300 font-semibold mb-1">Playlist</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Liked Songs
            </h1>
            <p className="text-surface-400 mt-2 text-sm">
              {favorites.length} songs 
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 rounded-full gradient-primary text-white shadow-xl shadow-primary-600/30"
          aria-label="Play all"
        >
          <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full text-surface-400 hover:text-primary-400 transition-colors"
          aria-label="Shuffle"
        >
          <Shuffle className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Track List */}
      <motion.div variants={itemVariants}>
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_1fr_60px] gap-4 px-4 py-2 text-xs uppercase tracking-wider text-surface-600 font-semibold border-b border-surface-800/50 mb-2">
          <span>#</span>
          <span>Title</span>
          <span className="hidden sm:block">Artist</span>
          <span className="text-right"><Clock className="w-3.5 h-3.5 inline" /></span>
        </div>

        {/* Tracks */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 mx-auto text-surface-600 mb-4" />
            <h2 className="text-xl font-semibold text-white">
              No favorite songs yet
            </h2>
            <p className="text-surface-500 mt-2">
              Like some songs and they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
          {favorites.map((song, i) => (
            <motion.div
              key={song.videoId}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
              onClick={() => playSong(song)}
              className="grid grid-cols-[40px_1fr_1fr_60px] gap-4 items-center px-4 py-3 rounded-xl group cursor-pointer transition-colors"
            >
              {/* Track Number / Play */}
              <div className="relative">
                <span className="text-sm text-surface-500 font-medium group-hover:hidden">
                  {i + 1}
                </span>
                <Play className="w-4 h-4 text-white hidden group-hover:block" fill="currentColor" />
              </div>

              {/* Title & Mini Art */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">
                    {song.title}
                  </p>
                  <p className="text-xs text-surface-500 truncate sm:hidden">{song.artist}</p>
                </div>
              </div>

              {/* Artist */}
              <p className="text-sm text-surface-400 truncate hidden sm:block group-hover:text-surface-300 transition-colors">
                {song.artist}
              </p>

              {/* Duration */}
              <div className="flex items-center justify-end gap-2">
                <Heart className="w-3.5 h-3.5 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                <span className="text-sm text-surface-500 tabular-nums"></span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  </motion.div>
  );
}
