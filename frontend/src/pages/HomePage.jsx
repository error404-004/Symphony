import { motion } from 'framer-motion'
import SectionHeader from '../components/ui/SectionHeader'
import MusicCard from '../components/ui/MusicCard'
import WideCard from '../components/ui/WideCard'
import usePlayer from '../hooks/usePlayer'
import { useEffect, useState } from 'react'
import { searchMusic } from '../services/api'
import { useNavigate } from 'react-router-dom'

/* ============================================
   Page & Section Animation Variants
   ============================================ */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

/**
 * HomePage - Symphony Design Language (SDL) Landing Page with differentiated Continue Listening vs Recently Played.
 */
export default function HomePage() {
  const navigate = useNavigate()
  const [greeting, setGreeting] = useState(getGreeting())

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const { playSong, favorites, playlists, notRecommended = [] } = usePlayer()

  const [hiddenIds, setHiddenIds] = useState(() => {
    return JSON.parse(localStorage.getItem('symphony_not_recommended')) || []
  })

  useEffect(() => {
    const handleNotRecommended = (e) => {
      const hiddenSong = e.detail
      if (hiddenSong && hiddenSong.videoId) {
        setHiddenIds((prev) => [...prev, hiddenSong.videoId])
      }
    }
    window.addEventListener('symphony-not-recommended', handleNotRecommended)
    return () => window.removeEventListener('symphony-not-recommended', handleNotRecommended)
  }, [])

  const activeHidden = Array.from(new Set([...(notRecommended || []), ...hiddenIds]))

  /* Expansion states for See all actions */
  const [showAllRecent, setShowAllRecent] = useState(false)
  const [showAllTrending, setShowAllTrending] = useState(false)
  const [showAllRecommended, setShowAllRecommended] = useState(false)

  /* Chronological history of individual tracks (up to 12) */
  const rawRecentlyPlayed = (JSON.parse(localStorage.getItem('recentlyPlayed')) || []).slice(0, 12)
  const recentlyPlayed = rawRecentlyPlayed.filter((s) => !activeHidden.includes(s.videoId))
  const displayedRecentlyPlayed = showAllRecent ? recentlyPlayed : recentlyPlayed.slice(0, 6)

  const [trending, setTrending] = useState([])
  const [recommended, setRecommended] = useState([])

  const filteredTrending = trending.filter((s) => !activeHidden.includes(s.videoId))
  const displayedTrending = showAllTrending ? filteredTrending.slice(0, 12) : filteredTrending.slice(0, 6)

  const filteredRecommended = recommended.filter((s) => !activeHidden.includes(s.videoId))
  const displayedRecommended = showAllRecommended ? filteredRecommended.slice(0, 12) : filteredRecommended.slice(0, 6)

  /* Build distinct Continue Listening sessions (Real Liked Vault + Real User Playlists only) */
  const userPlaylists = playlists.map((pl) => ({
    id: pl.id,
    type: 'playlist',
    title: pl.name,
    artist: `${pl.songs?.length || 0} ${pl.songs?.length === 1 ? 'track' : 'tracks'} • Custom Playlist`,
    thumbnail: pl.songs?.[0]?.thumbnail,
    gradient: pl.gradient || 'from-purple-600 to-indigo-800',
    onClick: () => navigate(`/playlists/${pl.id}`),
  }))

  const likedVaultCard = favorites.length > 0 ? [{
    id: 'liked-vault',
    type: 'vault',
    title: 'Liked Songs Vault',
    artist: `${favorites.length} ${favorites.length === 1 ? 'track' : 'tracks'} in library`,
    thumbnail: favorites[0]?.thumbnail,
    gradient: 'from-purple-600 via-indigo-600 to-purple-900',
    onClick: () => navigate('/favorites'),
  }] : []

  const continueListening = [
    ...likedVaultCard,
    ...userPlaylists,
  ].slice(0, 6)

  async function loadSection(query, setter) {
    try {
      const data = await searchMusic(query)
      setter(Array.isArray(data) ? data : data.songs || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function loadRecommendations() {
    try {
      const history = JSON.parse(localStorage.getItem('recentlyPlayed')) || []
      if (history.length === 0) return

      const artist = history[0].artist || history[0].author
      const data = await searchMusic(artist)
      setRecommended(Array.isArray(data) ? data : data.songs || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    async function loadHomeSections() {
      await loadSection('Top 50 Global', setTrending)
      await loadRecommendations()
    }
    loadHomeSections()
  }, [])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10 sm:space-y-12 lg:space-y-14 pb-6 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto relative"
    >
      {/* Hero Greeting Section */}
      <motion.div variants={sectionVariants} className="relative pt-4 sm:pt-6 pb-2 flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-36 bg-purple-600/12 rounded-full blur-[85px] pointer-events-none" />

        <div className="relative flex flex-col items-center gap-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-snug text-center">
            {greeting.title}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-normal text-center max-w-lg leading-relaxed">
            {greeting.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Continue Listening - Active Playlists & Session Collections */}
      {continueListening.length > 0 && (
        <motion.section variants={sectionVariants}>
          <SectionHeader
            title="Continue Listening"
            subtitle="Pick up your playlists & saved collections where you left off"
            showSeeAll={false}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-0">
            {continueListening.map((item, i) => (
              <WideCard
                key={item.id || item.title}
                title={item.title}
                subtitle={item.artist}
                artist={item.artist}
                thumbnail={item.thumbnail}
                gradient={item.gradient}
                index={i}
                onClick={item.onClick}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Recently Played - Single Track History */}
      {recentlyPlayed.length > 0 && (
        <motion.section variants={sectionVariants}>
          <SectionHeader
            title="Recently Played"
            subtitle="Your recently played tracks and single songs"
            onSeeAll={() => setShowAllRecent(!showAllRecent)}
            isExpanded={showAllRecent}
            showSeeAll={recentlyPlayed.length > 6}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6 mt-0">
            {displayedRecentlyPlayed.map((item, i) => (
              <MusicCard
                key={`${item.videoId}-${i}`}
                song={item}
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

      {/* Trending */}
      {filteredTrending.length > 0 && (
        <motion.section variants={sectionVariants}>
          <SectionHeader
            title="Trending Now"
            subtitle="What everyone is listening to"
            onSeeAll={() => setShowAllTrending(!showAllTrending)}
            isExpanded={showAllTrending}
            showSeeAll={filteredTrending.length > 6}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6 mt-0">
            {displayedTrending.map((item, i) => (
              <MusicCard
                key={item.videoId}
                song={item}
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

      {/* Recommended */}
      {filteredRecommended.length > 0 && (
        <motion.section variants={sectionVariants}>
          <SectionHeader
            title="Recommended for You"
            subtitle="Based on your taste"
            onSeeAll={() => setShowAllRecommended(!showAllRecommended)}
            isExpanded={showAllRecommended}
            showSeeAll={filteredRecommended.length > 6}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6 mt-0">
            {displayedRecommended.map((item, i) => (
              <MusicCard
                key={item.videoId}
                song={item}
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
    </motion.div>
  )
}

/**
 * Returns a greeting string based on the current hour.
 */
function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      title: 'Good morning ☀️',
      subtitle: 'ease into your day with your favorite soundscape',
    }
  }
  if (hour >= 12 && hour < 17) {
    return {
      title: 'Midday harmonies 🎵',
      subtitle: 'light tunes and casual vibes for your afternoon',
    }
  }
  if (hour >= 17 && hour < 22) {
    return {
      title: 'Sunset sessions 🌆',
      subtitle: 'unwind, relax, and let the music play',
    }
  }
  return {
    title: 'Midnight resonance 🌙',
    subtitle: 'quiet melodies and soft tracks for late hours',
  }
}
