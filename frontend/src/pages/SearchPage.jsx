import { motion } from 'framer-motion'
import { useEffect, useState } from "react";
import { searchMusic } from "../services/api";
import SearchResults from "../components/SearchResults";
import usePlayer from "../hooks/usePlayer";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TrendingUp, Mic2, Radio, Guitar, Headphones, Piano, Drum } from 'lucide-react'

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

const allTrendingPool = [
  'Summer vibes playlist',
  'Lo-fi beats',
  'Workout energy',
  'Chill evening mix',
  'Acoustic covers',
  'Top 50 global',
  'Synthwave retro',
  'Piano study session',
  'Deep house focus',
  '90s Rock hits',
  'K-Pop bangers',
  'Afrobeats party',
  'Indie folk acoustic',
  'Hip Hop workout',
  'Jazz lounge',
  'Ambient sleep',
  'EDM Festival',
  'Unplugged Sessions',
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
 * SearchPage / Explorer - Browse genres and trending searches with Symphony Design Language (SDL).
 */
export default function SearchPage() {
  const { playSong } = usePlayer();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(
    searchParams.get("q") || ""
  );
  const [songs, setSongs] = useState([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentTrending, setCurrentTrending] = useState(allTrendingPool.slice(0, 6))

  const refreshTrending = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 400);

    const shuffled = [...allTrendingPool].sort(() => 0.5 - Math.random());
    setCurrentTrending(shuffled.slice(0, 6));
  }

  useEffect(() => {
    const q = searchParams.get("q");

    if (!q) {
      setQuery("");
      setSongs([]);
      return;
    }

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
      className="pt-6 pb-32 sm:pb-36 max-w-7xl mx-auto px-4 sm:px-6"
    >
      {/* Trending Topics Section */}
      <motion.section variants={itemVariants} className="mb-14">
        <div className="mb-6" style={{ marginBottom: '24px' }}>
          <button
            onClick={refreshTrending}
            className="flex items-center gap-3.5 group cursor-pointer text-left focus:outline-none select-none"
            title="Click to refresh trending topics"
          >
            <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 group-hover:scale-105 transition-all duration-300 shadow-sm">
              <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isSpinning ? 'scale-125 text-purple-300' : 'group-hover:scale-110'}`} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors">
              Trending Topics
            </h2>
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {currentTrending.map((term, i) => (
            <motion.button
              key={term}
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(term)}`);
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/12 hover:border-purple-500/40 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-all duration-200 shadow-md shadow-black/20"
            >
              {term}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Browse by Genre */}
      {!query && (
        <motion.section variants={itemVariants} className="pt-4 mb-14" style={{ marginTop: '24px' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ marginBottom: '24px' }}>
            Browse by Genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {genres.map(({ name, gradient, icon: Icon }, i) => (
              <motion.div
                key={name}
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(name)}`);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="cursor-pointer"
              >
                <div className={`relative h-36 rounded-2xl bg-gradient-to-br ${gradient} p-5 overflow-hidden group shadow-lg shadow-black/30 border border-white/10`}>
                  <h3 className="text-xl font-extrabold text-white relative z-10 drop-shadow">{name}</h3>
                  {/* Decorative icon */}
                  <Icon className="absolute -bottom-2 -right-2 w-20 h-20 text-white/[0.12] rotate-[-15deg] group-hover:rotate-[-10deg] group-hover:scale-110 group-hover:text-white/[0.2] transition-all duration-500" />
                  {/* Sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Search Results (Shown when search is triggered via top navbar) */}
      <SearchResults
        songs={songs}
        onSongSelect={playSong}
      />
    </motion.div>
  )
}



