import { motion } from 'framer-motion'
import { useState } from "react";
import { searchMusic } from "../services/api";
import SearchResults from "../components/SearchResults";
import { useOutletContext } from "react-router-dom"
import { Search as SearchIcon, TrendingUp, Mic2, Radio, Guitar, Headphones, Piano, Drum } from 'lucide-react'

const genres = [
  { name: 'Pop', gradient: 'from-pink-500 to-rose-700', icon: Mic2 },
  { name: 'Rock', gradient: 'from-red-600 to-orange-800', icon: Guitar },
  { name: 'Electronic', gradient: 'from-cyan-400 to-blue-700', icon: Headphones },
  { name: 'Classical', gradient: 'from-amber-400 to-yellow-700', icon: Piano },
  { name: 'Hip Hop', gradient: 'from-violet-500 to-purple-800', icon: Drum },
  { name: 'Jazz', gradient: 'from-emerald-500 to-teal-800', icon: Radio },
  { name: 'R&B', gradient: 'from-fuchsia-500 to-pink-800', icon: Mic2 },
  { name: 'Indie', gradient: 'from-lime-400 to-green-700', icon: Guitar },
]

const trendingSearches = [
  'Summer vibes playlist',
  'Lo-fi beats',
  'Workout energy',
  'Chill evening mix',
  'Acoustic covers',
  'Top 50 global',
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
 * SearchPage - Browse genres and trending searches.
 */
export default function SearchPage() {
  const { setCurrentSong } = useOutletContext()
  const [query, setQuery] = useState("")
  const [songs, setSongs] = useState([])
  const handleSearch = async () => {
    if (!query.trim()) return

    try {
        const data = await searchMusic(query)

        console.log(data)

        setSongs(data)

    } catch (err) {
        console.error(err)
    }
  }
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10"
    >
      {/* Search Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-6">
          Search
        </h1>
        <div className="relative max-w-2xl group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500 group-focus-within:text-primary-400 transition-colors" />
          <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === "Enter") {
                      handleSearch()
                  }
              }}
              placeholder="What do you want to listen to?"
              className="w-full h-14 pl-12 pr-6 rounded-2xl bg-surface-900 border border-surface-800 text-base text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-600/50 focus:ring-2 focus:ring-primary-600/20 transition-all duration-200"
        />
        </div>
      </motion.div>

      {/* Trending Searches */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-white">Trending Searches</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((term, i) => (
            <motion.button
              key={term}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full bg-surface-800/60 border border-surface-700/30 text-sm text-surface-300 hover:text-white hover:bg-surface-700/60 hover:border-primary-600/30 transition-all duration-200"
            >
              {term}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Browse by Genre */}
      <motion.section variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-4">Browse by Genre</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {genres.map(({ name, gradient, icon: Icon }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="cursor-pointer"
            >
              <div className={`relative h-32 rounded-2xl bg-gradient-to-br ${gradient} p-5 overflow-hidden group`}>
                <h3 className="text-lg font-bold text-white relative z-10">{name}</h3>
                {/* Decorative icon */}
                <Icon className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 rotate-[-15deg] group-hover:rotate-[-10deg] group-hover:text-white/15 transition-all duration-500" />
                {/* Sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      <SearchResults
          songs={songs}
          onSongSelect={setCurrentSong}
      />
    </motion.div>
  )
}
