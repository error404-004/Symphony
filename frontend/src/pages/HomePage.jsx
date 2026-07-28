import { motion } from 'framer-motion'
import SectionHeader from '../components/ui/SectionHeader'
import MusicCard from '../components/ui/MusicCard'
import WideCard from '../components/ui/WideCard'
import usePlayer from "../hooks/usePlayer";
import { useEffect, useState } from "react";
import { searchMusic } from "../services/api";

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
 * HomePage - Symphony Design Language (SDL) Landing Page with exact 8px rhythm system.
 */
export default function HomePage() {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const { playSong } = usePlayer();

  const continueListening =
    JSON.parse(localStorage.getItem("continueListening")) || [];

  const recentlyPlayed =
    JSON.parse(localStorage.getItem("recentlyPlayed")) || [];

  const [trending, setTrending] = useState([]);
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
      await loadSection("Top 50 Global", setTrending);
      await loadRecommendations();
    }

    loadHomeSections();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-16 sm:space-y-20 lg:space-y-24 pb-6 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1440px] mx-auto relative"
    >
      {/* Hero Greeting Section */}
      <motion.div variants={sectionVariants} className="relative pt-6 sm:pt-8 lg:pt-10 pb-2 sm:pb-4 flex flex-col items-center justify-center text-center">
        {/* Subtle Purple Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight relative drop-shadow-sm leading-tight text-center">
          {greeting.title}
        </h1>
        <p className="text-zinc-400 mt-2.5 sm:mt-3 text-base sm:text-lg font-medium relative tracking-normal text-center max-w-xl">
          {greeting.subtitle}
        </p>
      </motion.div>

      {/* Continue Listening - Wide Cards Grid */}
      <motion.section variants={sectionVariants}>
        <SectionHeader
          title="Continue Listening"
          subtitle="Pick up where you left off"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-0">
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
      {recentlyPlayed.length > 0 && (
        <motion.section variants={sectionVariants}>
          <SectionHeader title="Recently Played" subtitle="Your recently played tracks and albums" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6 mt-0">
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
      )}

      {/* Trending */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="Trending Now" subtitle="What everyone is listening to" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6 mt-0">
          {trending.slice(0, 6).map((item, i) => (
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
      {recommended.length > 0 && (
        <motion.section variants={sectionVariants}>
          <SectionHeader title="Recommended for You" subtitle="Based on your taste" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 lg:gap-6 mt-0">
            {recommended.slice(0, 6).map((item, i) => (
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
      title: 'Good Morning 👋',
      subtitle: 'Start your day with the perfect soundscape.'
    }
  }
  if (hour >= 12 && hour < 17) {
    return {
      title: 'Midday Harmonies 🎵',
      subtitle: 'Fuel your focus with your favorite tracks.'
    }
  }
  if (hour >= 17 && hour < 22) {
    return {
      title: 'Sunset Sessions 🌆',
      subtitle: 'Unwind, relax, and let the music take over.'
    }
  }
  return {
    title: 'Midnight Resonance 🌙',
    subtitle: 'Deep cuts & quiet melodies for the night hours.'
  }
}
