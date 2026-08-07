import { motion } from 'framer-motion'
import { useEffect, useState } from "react";
import { searchMusic } from "../services/api";
import SearchResults from "../components/SearchResults";
import MusicCard from "../components/ui/MusicCard";
import usePlayer from "../hooks/usePlayer";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TrendingUp, Mic2, Radio, Guitar, Headphones, Piano, Drum, ArrowRight, Sparkles } from 'lucide-react'

const genres = [
  { name: 'Pop', gradient: 'from-pink-500/25 via-rose-600/15 to-purple-950/40', accent: 'text-pink-400', border: 'group-hover:border-pink-500/50', glow: 'from-pink-500 to-rose-600', icon: Mic2, tag: 'Top Hits' },
  { name: 'Rock', gradient: 'from-red-500/25 via-orange-600/15 to-purple-950/40', accent: 'text-red-400', border: 'group-hover:border-red-500/50', glow: 'from-red-500 to-orange-600', icon: Guitar, tag: 'Anthems' },
  { name: 'Electronic', gradient: 'from-cyan-500/25 via-blue-600/15 to-purple-950/40', accent: 'text-cyan-400', border: 'group-hover:border-cyan-500/50', glow: 'from-cyan-500 to-blue-600', icon: Headphones, tag: 'EDM & Beats' },
  { name: 'Classical', gradient: 'from-amber-500/25 via-yellow-600/15 to-purple-950/40', accent: 'text-amber-400', border: 'group-hover:border-amber-500/50', glow: 'from-amber-500 to-yellow-600', icon: Piano, tag: 'Symphony' },
  { name: 'Hip Hop', gradient: 'from-violet-500/25 via-purple-600/15 to-indigo-950/40', accent: 'text-violet-400', border: 'group-hover:border-violet-500/50', glow: 'from-violet-500 to-purple-600', icon: Drum, tag: 'Urban Rhymes' },
  { name: 'Jazz', gradient: 'from-emerald-500/25 via-teal-600/15 to-purple-950/40', accent: 'text-emerald-400', border: 'group-hover:border-emerald-500/50', glow: 'from-emerald-500 to-teal-600', icon: Radio, tag: 'Smooth & Soul' },
  { name: 'R&B', gradient: 'from-fuchsia-500/25 via-pink-600/15 to-purple-950/40', accent: 'text-fuchsia-400', border: 'group-hover:border-fuchsia-500/50', glow: 'from-fuchsia-500 to-pink-600', icon: Mic2, tag: 'Grooves' },
  { name: 'Indie', gradient: 'from-lime-500/25 via-green-600/15 to-purple-950/40', accent: 'text-lime-400', border: 'group-hover:border-lime-500/50', glow: 'from-lime-500 to-green-600', icon: Guitar, tag: 'Alternative' },
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
 * SearchPage / Explorer - Browse genres, new releases, and trending searches with Symphony Design Language (SDL).
 */
export default function SearchPage() {
  const { playSong } = usePlayer();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(
    searchParams.get("q") || ""
  );
  const [songs, setSongs] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
      setIsLoading(false);
      return;
    }

    setQuery(q);

    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const data = await searchMusic(q);
        setSongs(Array.isArray(data) ? data : data.songs || []);
      } catch (err) {
        console.error(err);
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [searchParams]);

  useEffect(() => {
    if (query) return;
    const fetchNewReleases = async () => {
      try {
        const data = await searchMusic("New Releases");
        setNewReleases(Array.isArray(data) ? data : data.songs || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNewReleases();
  }, [query]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="pt-6 pb-6 max-w-7xl mx-auto px-4 sm:px-6"
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
              Browse Topics
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
            {genres.map(({ name, gradient, glow, accent, border, tag, icon: Icon }, i) => (
              <motion.div
                key={name}
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(name)}`);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer relative group select-none"
              >
                {/* Outer Ambient Glow Aura */}
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${glow} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500 pointer-events-none`} />

                {/* Glassmorphic Card Container */}
                <div
                  style={{ padding: '24px' }}
                  className={`relative h-44 sm:h-48 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col justify-between overflow-hidden backdrop-blur-2xl border border-white/12 ${border} shadow-xl shadow-black/50 transition-all duration-300`}
                >
                  {/* Top Header: Tag & Genre Title */}
                  <div className="relative z-10 space-y-2">
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/50 border border-white/10 ${accent} backdrop-blur-md shadow-sm`}>
                        {tag}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md group-hover:text-white transition-colors">
                      {name}
                    </h3>
                  </div>

                  {/* Bottom Action: "Explore →" */}
                  <div className="relative z-10 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Decorative Icon inside glass badge */}
                  <div className="absolute -bottom-3 -right-3 p-3.5 sm:p-4 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-white/[0.08] transition-all duration-500 pointer-events-none">
                    <Icon className={`w-16 h-16 sm:w-20 sm:h-20 ${accent} opacity-30 group-hover:opacity-75 transition-opacity duration-300`} />
                  </div>

                  {/* Sheen Ray */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* New Releases Section */}
      {!query && newReleases.length > 0 && (
        <motion.section variants={itemVariants} className="pt-4 mb-14" style={{ marginTop: '32px' }}>
          <div className="flex items-center gap-3 mb-6" style={{ marginBottom: '24px' }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">New Releases</h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal">Fresh tracks this week</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6">
            {newReleases.slice(0, 12).map((item, i) => (
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

      {/* Search Results (Shown when search is triggered via top navbar) */}
      <SearchResults
        songs={songs}
        query={query}
        isLoading={isLoading}
        onSongSelect={playSong}
      />
    </motion.div>
  )
}




