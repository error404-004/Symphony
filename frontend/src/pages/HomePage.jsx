import { motion } from 'framer-motion'
import SectionHeader from '../components/ui/SectionHeader'
import MusicCard from '../components/ui/MusicCard'
import WideCard from '../components/ui/WideCard'
import usePlayer from "../hooks/usePlayer";
import { useEffect, useState } from "react";
import { searchMusic } from "../services/api";

/* ============================================
   Placeholder Data
   ============================================ */

const recentlyPlayed =
  JSON.parse(localStorage.getItem("recentlyPlayed")) || [];

//trending replace left


//new release left

/* ============================================
   Page Container Animation
   ============================================ */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.1 } },
}

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

/**
 * HomePage - Landing page with multiple music sections.
 */
export default function HomePage() {
  const greeting = getGreeting();

  const { playSong } = usePlayer();

  const continueListening =
    JSON.parse(localStorage.getItem("continueListening")) || [];

  const recentlyPlayed =
    JSON.parse(localStorage.getItem("recentlyPlayed")) || [];

  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recommended, setRecommended] = useState([]);

  async function loadSection(query, setter) {
    try {
      const data = await searchMusic(query);

      setter(
        Array.isArray(data)
          ? data
          : data.songs || []
      );
    } catch (err) {
      console.error(err);
    }
  }
  async function loadRecommendations() {
  try {
    const history =
      JSON.parse(localStorage.getItem("recentlyPlayed")) || [];

    if (history.length === 0) {
      return;
    }

    const artist =
      history[0].artist || history[0].author;

    const data = await searchMusic(artist);

    setRecommended(
      Array.isArray(data)
        ? data
        : data.songs || []
    );
  } catch (err) {
    console.error(err);
  }
}
  useEffect(() => {
    async function loadHomeSections() {
      await Promise.all([
        loadSection("Top 50 Global", setTrending),
        loadSection("New Releases", setNewReleases),
      ]);
      await loadRecommendations();
    }

    loadHomeSections();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 pb-48"
    >
      {/* Hero Greeting */}
      <motion.div variants={sectionVariants} className="relative">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight relative">
          {greeting}
        </h1>
        <p className="text-[#B3B3B3] mt-1 text-base relative">
          Here's what's been on your radar.
        </p>
      </motion.div>

      {/* Continue Listening - Wide Cards Grid */}
      <motion.section variants={sectionVariants}>
        <SectionHeader
          title="Continue Listening"
          subtitle="Pick up where you left off"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {continueListening.map((item, i) => (
            <WideCard
              key={item.videoId || item.title}
              title={item.title}
              artist={item.artist}
              thumbnail={item.thumbnail}
              index={i}
              onClick={() => playSong(item)}
          />
          ))}
        </div>
      </motion.section>

      {/* Recently Played */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="Recently Played" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentlyPlayed.map((item, i) => (
              <MusicCard
                  key={`${item.videoId}-${i}`}
                  title={item.title}
                  artist={item.artist}
                  thumbnail={item.thumbnail}
                  index={i}
                  onClick={() => playSong(item)}
              />
          ))}
        </div>
      </motion.section>

      {/* Trending */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="Trending Now" subtitle="What everyone is listening to" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trending.slice(0, 5).map((item, i) => (
            <MusicCard
              key={item.videoId}
              title={item.title}
              artist={item.artist}
              thumbnail={item.thumbnail}
              index={i}
              onClick={() => playSong(item)}
            />
          ))}
        </div>
      </motion.section>

      {/* Recommended */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="Recommended for You" subtitle="Based on your taste" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommended.slice(0, 5).map((item, i) => (
            <MusicCard
              key={item.videoId}
              title={item.title}
              artist={item.artist}
              thumbnail={item.thumbnail}
              index={i}
              onClick={() => playSong(item)}
            />
          ))}
        </div>
      </motion.section>

      {/* New Releases */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="New Releases" subtitle="Fresh tracks this week" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.slice(0, 5).map((item, i) => (
            <MusicCard
              key={item.videoId}
              title={item.title}
              artist={item.artist}
              thumbnail={item.thumbnail}
              index={i}
              onClick={() => playSong(item)}
            />
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}

/**
 * Returns a greeting string based on the current hour.
 */
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}
