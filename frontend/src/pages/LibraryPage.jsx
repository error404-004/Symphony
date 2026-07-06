import { motion } from 'framer-motion'
import { ListMusic, Clock, Plus, Music2, MoreHorizontal } from 'lucide-react'
import { useState } from "react";
import usePlayer from "../hooks/usePlayer";
import { useNavigate } from "react-router-dom";



const recentAlbums = [
  { title: 'After Hours', artist: 'The Weeknd', year: '2020', gradient: 'from-red-600 to-red-950' },
  { title: 'Random Access Memories', artist: 'Daft Punk', year: '2013', gradient: 'from-yellow-500 to-amber-900' },
  { title: 'Discovery', artist: 'Daft Punk', year: '2001', gradient: 'from-sky-400 to-indigo-900' },
  { title: 'Blonde', artist: 'Frank Ocean', year: '2016', gradient: 'from-orange-300 to-orange-800' },
  { title: 'In Rainbows', artist: 'Radiohead', year: '2007', gradient: 'from-red-400 to-rose-900' },
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
 * LibraryPage - User's music library with playlists and recently added albums.
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
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Library</h1>
          <p className="text-surface-500 mt-1 text-sm">Your playlists, albums, and saved music</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700/40 text-sm font-medium text-surface-200 hover:bg-surface-700 hover:text-white transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </motion.button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2">
        {['All', 'Playlists', 'Albums', 'Artists', 'Podcasts'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              i === 0
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                : 'bg-surface-800/60 text-surface-400 hover:text-white hover:bg-surface-700/60 border border-surface-700/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Playlists */}
<motion.section variants={itemVariants}>
  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
    <ListMusic className="w-5 h-5 text-primary-400" />
    Your Playlists
  </h2>

  {playlists.length === 0 ? (
    <div className="rounded-xl border border-dashed border-surface-700 p-10 text-center">
      <Music2 className="w-12 h-12 mx-auto text-surface-600 mb-4" />

      <h3 className="text-xl font-semibold">
        No playlists yet
      </h3>

      <p className="text-surface-500 mt-2">
        Click "Create Playlist" to make your first playlist.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {playlists.map((playlist, i) => (
        <motion.div
          key={playlist.id}
          onClick={() => navigate(`/playlists/${playlist.id}`)}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          whileHover={{ scale: 1.02 }}
          className="group cursor-pointer"
        >
          <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-900/50 hover:bg-surface-800/60 border border-transparent hover:border-surface-700/30 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-lg">
              <Music2 className="w-6 h-6 text-white/30" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {playlist.name}
              </p>

              <p className="text-xs text-surface-500">
                {playlist.songs.length} tracks
              </p>
            </div>

            <button className="opacity-0 group-hover:opacity-100 text-surface-500 hover:text-surface-200 transition-all duration-200">
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
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-400" />
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
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-800/40 transition-all duration-200">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                  <Music2 className="w-5 h-5 text-white/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">{title}</p>
                  <p className="text-xs text-surface-500 truncate">{artist}</p>
                </div>
                <span className="text-xs text-surface-600 font-medium">{year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
          
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-surface-900 rounded-2xl p-6 w-[420px]">

            <h2 className="text-2xl font-bold mb-6">
              Create Playlist
            </h2>

            <input
              type="text"
              placeholder="Playlist name..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full rounded-xl border border-surface-700 bg-surface-800 px-4 py-3 mb-6"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowModal(false);
                  setPlaylistName("");
                }}
                className="px-4 py-2 rounded-lg bg-surface-700"
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
                className="px-5 py-2 rounded-lg bg-primary-500"
              >
                Create
              </button>

            </div>
              
          </div>

        </div>
      )}
    </motion.div>
  )
}
