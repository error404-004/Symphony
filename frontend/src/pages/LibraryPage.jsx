import { motion } from 'framer-motion'
import { ListMusic, Clock, Plus, Music2, MoreHorizontal } from 'lucide-react'
import { useState } from "react";
import usePlayer from "../hooks/usePlayer";
import { useNavigate } from "react-router-dom";

const recentAlbums = [
  { title: 'After Hours', artist: 'The Weeknd', year: '2020', gradient: 'from-red-600 to-purple-950' },
  { title: 'Random Access Memories', artist: 'Daft Punk', year: '2013', gradient: 'from-amber-500 to-purple-950' },
  { title: 'Discovery', artist: 'Daft Punk', year: '2001', gradient: 'from-sky-400 to-indigo-900' },
  { title: 'Blonde', artist: 'Frank Ocean', year: '2016', gradient: 'from-orange-400 to-purple-950' },
  { title: 'In Rainbows', artist: 'Radiohead', year: '2007', gradient: 'from-rose-500 to-indigo-950' },
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
 * LibraryPage - User's personal music collection with Symphony Design Language (SDL).
 */
export default function LibraryPage() {
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const {
    createPlaylist,
    playlists,
  } = usePlayer();
  const navigate = useNavigate();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10 pb-36 relative"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between relative">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">Your Library</h1>
          <p className="text-zinc-400 mt-2 text-sm font-medium">Your personal music collection & playlists</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-purple-950/50 border border-white/20 transition-all duration-200"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Playlist
        </motion.button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 flex-wrap">
        {['All', 'Playlists', 'Albums', 'Artists', 'Podcasts'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              i === 0
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 border border-purple-400/30'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Playlists */}
      <motion.section variants={itemVariants}>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
          <ListMusic className="w-5 h-5 text-purple-400" />
          Your Playlists
        </h2>

        {playlists.length === 0 ? (
          <div className="glass-card backdrop-blur-xl border border-white/10 bg-surface-950/70 p-12 rounded-2xl text-center shadow-xl shadow-purple-950/20 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center mb-4 shadow-lg shadow-purple-950/30">
              <Music2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              No playlists yet
            </h3>

            <p className="text-zinc-400 mt-2 text-sm max-w-md mx-auto font-medium">
              Create your first personal playlist to organize your favorite tracks.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-5 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-600/30 text-sm font-semibold transition-all duration-200"
            >
              Create Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {playlists.map((playlist, i) => (
              <motion.div
                key={playlist.id}
                onClick={() => navigate(`/playlists/${playlist.id}`)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer select-none"
              >
                <div className="flex items-center gap-4 p-3.5 rounded-2xl glass-card backdrop-blur-xl bg-surface-950/80 border border-white/10 hover:border-purple-500/40 shadow-xl shadow-purple-950/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-900/50 via-surface-800 to-surface-900 border border-white/5 flex items-center justify-center shrink-0 shadow-md">
                    <Music2 className="w-6 h-6 text-purple-300/40 group-hover:text-purple-300/70 transition-colors" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                      {playlist.name}
                    </p>

                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {playlist.songs.length} tracks
                    </p>
                  </div>

                  <button className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Recently Added Albums */}
      <motion.section variants={itemVariants}>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 tracking-tight">
          <Clock className="w-5 h-5 text-purple-400" />
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
              className="group cursor-pointer select-none"
            >
              <div className="flex items-center gap-4 p-3.5 rounded-2xl glass-card backdrop-blur-xl bg-surface-950/60 border border-white/10 hover:border-purple-500/40 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md border border-white/5`}>
                  <Music2 className="w-5 h-5 text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">{title}</p>
                  <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">{artist}</p>
                </div>
                <span className="text-xs text-zinc-500 font-semibold px-3 py-1 rounded-full bg-white/[0.04] border border-white/5">{year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Create Playlist Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="glass-card backdrop-blur-2xl bg-surface-950/95 rounded-2xl p-6 sm:p-7 w-[420px] shadow-2xl shadow-purple-950/60 border border-white/10 relative overflow-hidden"
          >
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
              Create Playlist
            </h2>

            <input
              type="text"
              placeholder="Playlist name..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white placeholder:text-zinc-400/70 caret-purple-400 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 mb-6 text-sm font-medium"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPlaylistName("");
                }}
                className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!playlistName.trim()) return;

                  createPlaylist(playlistName.trim());

                  setPlaylistName("");

                  setShowModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-950/50 border border-white/20 transition-all duration-200"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
