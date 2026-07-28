import { motion } from 'framer-motion'
import { ListMusic, Clock, Music2, MoreHorizontal, Mic2, UserCheck, Plus, Sparkles } from 'lucide-react'
import { useState } from "react";
import usePlayer from "../hooks/usePlayer";
import { useNavigate } from "react-router-dom";

const savedArtists = [
  { name: 'The Weeknd', genre: 'R&B / Pop', gradient: 'from-purple-600 to-indigo-900' },
  { name: 'Daft Punk', genre: 'Electronic', gradient: 'from-blue-600 to-purple-900' },
  { name: 'Frank Ocean', genre: 'Alternative R&B', gradient: 'from-amber-500 to-rose-900' },
  { name: 'Radiohead', genre: 'Alternative Rock', gradient: 'from-rose-600 to-indigo-900' },
]

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

/**
 * Returns concise single-line quote header based on the current hour.
 */
function getLibraryHeaderQuote() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      title: 'Morning Harmonies ☀️',
      subtitle: 'Start your day with your curated soundscape.',
    }
  }
  if (hour >= 12 && hour < 17) {
    return {
      title: 'Midday Focus ☕',
      subtitle: 'Fuel your day with your saved collections.',
    }
  }
  if (hour >= 17 && hour < 22) {
    return {
      title: 'Sunset Sessions 🌆',
      subtitle: 'Unwind with your personal music vault.',
    }
  }
  return {
    title: 'Midnight Resonance 🌙',
    subtitle: 'Quiet melodies for late night hours.',
  }
}

/**
 * LibraryPage - User's personal music collection with Symphony Design Language (SDL).
 */
export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("All");

  const { playlists, openCreatePlaylistModal } = usePlayer();
  const navigate = useNavigate();

  const headerQuote = getLibraryHeaderQuote();
  const tabs = ['All', 'Playlists', 'Albums', 'Artists', 'Podcasts'];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="pb-32 sm:pb-36 relative"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row with Guaranteed Spacing */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between gap-6 relative border-b border-white/10"
        style={{ marginBottom: '28px', paddingBottom: '20px' }}
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight truncate">
            {headerQuote.title}
          </h1>
          <p
            className="text-zinc-400 text-sm font-medium truncate"
            style={{ marginTop: '8px' }}
          >
            {headerQuote.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Interactive Filter Tabs Row with Guaranteed Spacing */}
      <motion.div
        variants={itemVariants}
        className="flex gap-3 flex-wrap"
        style={{ marginTop: '8px', marginBottom: '32px' }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 border border-purple-400/40 scale-105'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-purple-500/30'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </motion.div>

      {/* SECTION 1: Playlists */}
      {(activeTab === 'All' || activeTab === 'Playlists') && (
        <motion.section variants={itemVariants} style={{ marginBottom: '40px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
              <ListMusic className="w-5 h-5 text-purple-400" />
              Your Playlists
            </h2>

            <button
              onClick={openCreatePlaylistModal}
              className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400/60 text-purple-300 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              Create Playlist
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="glass-card backdrop-blur-xl border border-white/10 bg-surface-950/70 p-10 sm:p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl shadow-purple-950/20 relative overflow-hidden gap-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center shadow-lg shadow-purple-950/30">
                <Music2 className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                No playlists yet
              </h3>

              <p className="text-zinc-400 text-sm max-w-md font-medium">
                Create your first playlist and start building your personal mix.
              </p>

              <button
                onClick={openCreatePlaylistModal}
                className="mt-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {playlists.map((playlist, i) => {
                const gradientClass = playlist.gradient || 'from-purple-600 to-indigo-600'
                return (
                  <motion.div
                    key={playlist.id}
                    onClick={() => navigate(`/playlists/${playlist.id}`)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-2xl glass-card backdrop-blur-xl bg-surface-950/80 border border-white/10 hover:border-purple-500/40 shadow-xl shadow-purple-950/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shrink-0 shadow-md border border-white/10`}>
                        <ListMusic className="w-6 h-6 text-white/90 group-hover:scale-110 transition-transform" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                          {playlist.name}
                        </p>

                        <p className="text-xs text-zinc-400 font-medium mt-1">
                          {playlist.songs ? playlist.songs.length : 0} tracks
                        </p>
                      </div>

                      <button className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>
      )}

      {/* SECTION 2: Albums (Visible when 'Albums' tab selected) */}
      {activeTab === 'Albums' && (
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="glass-card backdrop-blur-xl border border-white/10 bg-surface-950/70 p-12 rounded-2xl text-center shadow-xl shadow-purple-950/20 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center mb-4 shadow-lg shadow-purple-950/30">
              <Clock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              No saved albums yet
            </h3>

            <p className="text-zinc-400 mt-2 text-sm max-w-md mx-auto font-medium">
              Save albums from search or artist pages to build your collection.
            </p>
          </div>
        </motion.section>
      )}

      {/* SECTION 3: Artists (Visible on 'Artists') */}
      {activeTab === 'Artists' && (
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5 tracking-tight">
            <UserCheck className="w-5 h-5 text-purple-400" />
            Followed Artists
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-5">
            {savedArtists.map(({ name, genre, gradient }, i) => (
              <motion.div
                key={name}
                onClick={() => navigate(`/artist/${encodeURIComponent(name)}`)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="group cursor-pointer select-none"
              >
                <div className="p-4 rounded-2xl glass-card backdrop-blur-xl bg-surface-950/80 border border-white/10 hover:border-purple-500/40 shadow-xl shadow-purple-950/20 text-center flex flex-col items-center gap-3 transition-all duration-300">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg border border-white/10 group-hover:scale-105 transition-transform`}>
                    <Music2 className="w-8 h-8 text-white/50" />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">{name}</p>
                    <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">{genre}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* SECTION 4: Podcasts (Visible on 'Podcasts') */}
      {activeTab === 'Podcasts' && (
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="glass-card backdrop-blur-xl border border-white/10 bg-surface-950/70 p-12 rounded-2xl text-center shadow-xl shadow-purple-950/20 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center mb-4 shadow-lg shadow-purple-950/30">
              <Mic2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              No podcasts added yet
            </h3>

            <p className="text-zinc-400 mt-2 text-sm max-w-md mx-auto font-medium">
              Explore trending talk shows, tech podcasts, and audio stories.
            </p>
          </div>
        </motion.section>
      )}

    </motion.div>
  )
}
