import { motion } from 'framer-motion'
import { ListMusic, Clock, Plus, Music2, MoreHorizontal } from 'lucide-react'

const playlists = [
  { name: 'Late Night Coding', tracks: 42, gradient: 'from-violet-500 to-indigo-800' },
  { name: 'Morning Coffee', tracks: 28, gradient: 'from-amber-400 to-orange-700' },
  { name: 'Workout Mode', tracks: 56, gradient: 'from-red-500 to-rose-800' },
  { name: 'Chill Vibes', tracks: 35, gradient: 'from-cyan-400 to-teal-700' },
]

const recentAlbums = [
  { title: 'After Hours', artist: 'The Weeknd', year: '2020', gradient: 'from-red-600 to-red-950' },
  { title: 'Random Access Memories', artist: 'Daft Punk', year: '2013', gradient: 'from-yellow-500 to-amber-900' },
  { title: 'Discovery', artist: 'Daft Punk', year: '2001', gradient: 'from-sky-400 to-indigo-900' },
  { title: 'Blonde', artist: 'Frank Ocean', year: '2016', gradient: 'from-orange-300 to-orange-800' },
  { title: 'In Rainbows', artist: 'Radiohead', year: '2007', gradient: 'from-red-400 to-rose-900' },
]

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

/**
 * LibraryPage - User's music library with playlists and recently added albums.
 */
export default function LibraryPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Library</h1>
          <p className="text-surface-500 mt-1 text-sm">Your playlists, albums, and saved music</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700/40 text-sm font-medium text-surface-200 hover:bg-surface-700 hover:text-white transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </motion.button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2">
        {['All', 'Playlists', 'Albums', 'Artists', 'Podcasts'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              i === 0
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                : 'bg-surface-800/60 text-surface-400 hover:text-white hover:bg-surface-700/60 border border-surface-700/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Playlists */}
      <motion.section variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-primary-400" />
          Your Playlists
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {playlists.map(({ name, tracks, gradient }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-900/50 hover:bg-surface-800/60 border border-transparent hover:border-surface-700/30 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                  <Music2 className="w-6 h-6 text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{name}</p>
                  <p className="text-xs text-surface-500">{tracks} tracks</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-surface-500 hover:text-surface-200 transition-all duration-200">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recently Added Albums */}
      <motion.section variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-400" />
          Recently Added
        </h2>
        <div className="space-y-2">
          {recentAlbums.map(({ title, artist, year, gradient }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 4 }}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-800/40 transition-all duration-200">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                  <Music2 className="w-5 h-5 text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">{title}</p>
                  <p className="text-xs text-surface-500 truncate">{artist}</p>
                </div>
                <span className="text-xs text-surface-600 font-medium">{year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
