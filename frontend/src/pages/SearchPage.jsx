import { motion } from 'framer-motion'
import { useEffect, useState } from "react";
import { searchMusic } from "../services/api";
import SearchResults from "../components/SearchResults";
import usePlayer from "../hooks/usePlayer";
import { useSearchParams } from "react-router-dom";
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
  const { playSong } = usePlayer();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(
    searchParams.get("q") || ""
  );
  const [songs, setSongs] = useState([])
  const handleSearch = async () => {

    if (!query.trim()) return

    try {
        const data = await searchMusic(query)

        console.log(data)

        setSongs(Array.isArray(data) ? data : data.songs || [])

    } catch (err) {
        console.error(err)
    }
  }
  useEffect(() => {
    const q = searchParams.get("q");

    if (!q) return;

    setQuery(q);

    const fetchSongs = async () => {
      try {
        const data = await searchMusic(q);

        setSongs(Array.isArray(data) ? data : data.songs || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSongs();
  }, [searchParams]);
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Search Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          Search
        </h1>
        <div className="relative max-w-2xl group">
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B3B3B3] group-focus-within:text-primary-400 transition-colors duration-200" />
          <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === "Enter") {
                      handleSearch()
                  }
              }}
              placeholder=" What do you want to listen to?"
              className="w-full h-14 pl-4 pr-11 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-base text-white placeholder:text-[#B3B3B3]/50 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 focus:bg-white/[0.08] transition-all duration-200 shadow-lg shadow-black/10"
        />
        </div>
      </motion.div>

      {/* Trending Searches */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-white">Trending Searches</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {trendingSearches.map((term, i) => (
            <motion.button
              key={term}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm text-[#B3B3B3] hover:text-white hover:bg-white/[0.08] hover:border-primary-500/30 transition-all duration-200"
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
              <div className={`relative h-36 rounded-2xl bg-gradient-to-br ${gradient} p-5 overflow-hidden group shadow-lg shadow-black/20`}>
                <h3 className="text-lg font-bold text-white relative z-10">{name}</h3>
                {/* Decorative icon */}
                <Icon className="absolute -bottom-2 -right-2 w-20 h-20 text-white/[0.08] rotate-[-15deg] group-hover:rotate-[-10deg] group-hover:text-white/[0.12] transition-all duration-500" />
                {/* Sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Glass overlay on hover */}
                <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      <SearchResults
          songs={songs}
          onSongSelect={playSong}
      />
    </motion.div>
  )
}
