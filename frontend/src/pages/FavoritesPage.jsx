import { motion } from 'framer-motion'
import { Heart, Music2, Play, Clock, Shuffle } from 'lucide-react'

const favoriteTracks = [
  { title: 'Midnight Dreams', artist: 'The Cosmic Architects', duration: '3:45', gradient: 'from-purple-600 to-indigo-900' },
  { title: 'Electric Sunrise', artist: 'Neon Pulse', duration: '4:12', gradient: 'from-amber-500 to-rose-700' },
  { title: 'Stellar Voyage', artist: 'Astral Project', duration: '5:01', gradient: 'from-violet-500 to-purple-900' },
  { title: 'Velvet Nights', artist: 'Luna Ray', duration: '3:28', gradient: 'from-rose-500 to-pink-900' },
  { title: 'Chrome Dreams', artist: 'Digital Wave', duration: '4:33', gradient: 'from-sky-400 to-indigo-800' },
  { title: 'Desert Wind', artist: 'Sahara Echo', duration: '3:56', gradient: 'from-orange-500 to-red-800' },
  { title: 'Neon City', artist: 'Synthwave FM', duration: '4:08', gradient: 'from-fuchsia-500 to-purple-800' },
  { title: 'Ocean Waves', artist: 'Calm Collective', duration: '6:22', gradient: 'from-cyan-500 to-blue-800' },
]

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
              {favoriteTracks.length} songs • About 35 min
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
        <div className="space-y-0.5">
          {favoriteTracks.map(({ title, artist, duration, gradient }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
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
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                  <Music2 className="w-4 h-4 text-white/30" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-surface-500 truncate sm:hidden">{artist}</p>
                </div>
              </div>

              {/* Artist */}
              <p className="text-sm text-surface-400 truncate hidden sm:block group-hover:text-surface-300 transition-colors">
                {artist}
              </p>

              {/* Duration */}
              <div className="flex items-center justify-end gap-2">
                <Heart className="w-3.5 h-3.5 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                <span className="text-sm text-surface-500 tabular-nums">{duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
