import { motion } from 'framer-motion'
import SectionHeader from '../components/ui/SectionHeader'
import MusicCard from '../components/ui/MusicCard'
import WideCard from '../components/ui/WideCard'

/* ============================================
   Placeholder Data
   ============================================ */
const continueListening = [
  { title: 'Midnight Dreams', subtitle: 'The Cosmic Architects', gradient: 'from-purple-600 to-indigo-900' },
  { title: 'Electric Sunrise', subtitle: 'Neon Pulse', gradient: 'from-amber-500 to-rose-700' },
  { title: 'Ocean Waves', subtitle: 'Calm Collective', gradient: 'from-cyan-500 to-blue-800' },
  { title: 'Urban Night', subtitle: 'Metro Beats', gradient: 'from-pink-500 to-violet-800' },
  { title: 'Forest Rain', subtitle: 'Nature Sounds', gradient: 'from-emerald-500 to-teal-800' },
  { title: 'Golden Hour', subtitle: 'Sunset Vibes', gradient: 'from-yellow-500 to-orange-700' },
]

const recentlyPlayed = [
  { title: 'Stellar Voyage', subtitle: 'Astral Project', gradient: 'from-violet-500 to-purple-900' },
  { title: 'Velvet Nights', subtitle: 'Luna Ray', gradient: 'from-rose-500 to-pink-900' },
  { title: 'Chrome Dreams', subtitle: 'Digital Wave', gradient: 'from-sky-400 to-indigo-800' },
  { title: 'Desert Wind', subtitle: 'Sahara Echo', gradient: 'from-orange-500 to-red-800' },
  { title: 'Neon City', subtitle: 'Synthwave FM', gradient: 'from-fuchsia-500 to-purple-800' },
]

const trending = [
  { title: 'Gravity', subtitle: 'Void Theory', gradient: 'from-slate-400 to-slate-800' },
  { title: 'Pulse', subtitle: 'Bass Reactor', gradient: 'from-red-500 to-rose-900' },
  { title: 'Echoes', subtitle: 'Mirror Lake', gradient: 'from-teal-400 to-cyan-800' },
  { title: 'Fractal', subtitle: 'Geometry Club', gradient: 'from-lime-400 to-green-800' },
  { title: 'Horizon', subtitle: 'Dawn Patrol', gradient: 'from-amber-400 to-yellow-800' },
]

const recommended = [
  { title: 'Celestial', subtitle: 'Space Orchestra', gradient: 'from-indigo-400 to-blue-900' },
  { title: 'Ember', subtitle: 'Fire Walk', gradient: 'from-orange-400 to-red-900' },
  { title: 'Crystal', subtitle: 'Ice Fields', gradient: 'from-cyan-300 to-blue-800' },
  { title: 'Shadow Play', subtitle: 'Dark Matter', gradient: 'from-gray-500 to-zinc-900' },
  { title: 'Aurora', subtitle: 'Northern Lights', gradient: 'from-green-400 to-emerald-900' },
]

const newReleases = [
  { title: 'Quantum Leap', subtitle: 'Particle Zoo', gradient: 'from-violet-400 to-indigo-900' },
  { title: 'Silk Road', subtitle: 'Eastern Winds', gradient: 'from-amber-300 to-orange-800' },
  { title: 'Deep Blue', subtitle: 'Mariana Trench', gradient: 'from-blue-400 to-slate-900' },
  { title: 'Wildflower', subtitle: 'Meadow Dreams', gradient: 'from-pink-400 to-rose-800' },
  { title: 'Thunderbolt', subtitle: 'Storm Chasers', gradient: 'from-yellow-300 to-amber-800' },
]

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
  const greeting = getGreeting()

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      {/* Hero Greeting */}
      <motion.div variants={sectionVariants} className="relative">
        {/* Ambient glow behind hero */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
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
            <WideCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Recently Played */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="Recently Played" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentlyPlayed.map((item, i) => (
            <MusicCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Trending */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="Trending Now" subtitle="What everyone is listening to" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trending.map((item, i) => (
            <MusicCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Recommended */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="Recommended for You" subtitle="Based on your taste" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommended.map((item, i) => (
            <MusicCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </motion.section>

      {/* New Releases */}
      <motion.section variants={sectionVariants}>
        <SectionHeader title="New Releases" subtitle="Fresh tracks this week" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.map((item, i) => (
            <MusicCard key={item.title} {...item} index={i} />
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
