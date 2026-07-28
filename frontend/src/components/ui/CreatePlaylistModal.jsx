import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Music2, Mic2, Disc, Lock, ChevronRight } from 'lucide-react'

/**
 * CreatePlaylistModal - Exact Recreation of User's Reference Design Image
 *
 * Visual Features:
 * 1. Top Orb: Glowing 3D Magenta/Purple sphere with white + icon
 * 2. Header: Centered "Create Playlist" with a subtle horizontal line underneath
 * 3. Playlist Name: Rounded box with vibrant purple border & purple music note icon
 * 4. Description: Dark glass box with "Add an optional description..."
 * 5. Make Private: Glass bar with text, Lock icon, and glowing magenta toggle switch
 * 6. Add Artists: Mic2 icon, "Add Artists", "None selected >" with thin divider
 * 7. Add Genre: Disc icon, "Add Genre", "Select genre >" with thin divider
 * 8. Footer Buttons: Equal-width rounded pills (Cancel & vibrant Magenta/Purple Create)
 */
export default function CreatePlaylistModal({ isOpen, onClose, onCreate }) {
  const [playlistName, setPlaylistName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedArtists, setSelectedArtists] = useState('None selected')
  const [selectedGenre, setSelectedGenre] = useState('Select genre')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!playlistName.trim()) return
    onCreate(playlistName.trim(), { description, isPrivate })
    setPlaylistName('')
    setDescription('')
    setIsPrivate(false)
    onClose()
  }

  const handleClose = () => {
    setPlaylistName('')
    setDescription('')
    setIsPrivate(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Floating Glass Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[360px] sm:max-w-[380px] bg-[#0d081b]/95 backdrop-blur-2xl rounded-[28px] border border-purple-500/30 p-5 sm:p-6 pt-9 sm:pt-10 shadow-[0_0_60px_rgba(0,0,0,0.95)] shadow-purple-950/80 overflow-visible z-10 mt-6"
          >
            {/* Ambient Purple Background Glow Orbs */}
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-purple-600/30 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-fuchsia-600/20 rounded-full blur-[90px] pointer-events-none" />

            {/* 1. Top Overflowing Glowing Sphere */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
              {/* Soft Outer Ambient Glow */}
              <div className="absolute w-24 h-24 bg-purple-500/50 rounded-full blur-xl -top-1" />

              {/* Glowing Magenta/Purple Sphere */}
              <div className="relative w-15 h-15 rounded-full bg-gradient-to-tr from-purple-700 via-fuchsia-500 to-purple-300 p-[1.5px] shadow-[0_0_25px_rgba(217,70,239,0.7)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-purple-400/40 via-purple-600/80 to-purple-950/90 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
                  <Plus className="w-7 h-7 text-white stroke-[2.5] drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
            </div>

            {/* 2. Modal Title Header with Subtle Divider Line */}
            <div className="pt-2 pb-3.5 text-center relative z-10 border-b border-white/[0.08]">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Create Playlist
              </h2>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 relative z-10">
              
              {/* 3. Playlist Name Input Bar (Vibrant Purple Border) */}
              <div className="relative flex items-center">
                <Music2 className="absolute left-3.5 w-5 h-5 text-purple-400 pointer-events-none z-10" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter playlist name..."
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.04] border border-purple-500/70 hover:border-purple-400 text-white placeholder:text-zinc-500 text-sm font-medium caret-purple-400 focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                />
              </div>

              {/* 4. Description Section */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 px-0.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add an optional description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 p-3 rounded-xl bg-white/[0.04] border border-purple-500/30 hover:border-purple-500/50 text-white placeholder:text-zinc-500/80 text-xs sm:text-sm font-medium caret-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 transition-all duration-200 resize-none shadow-inner"
                />
              </div>

              {/* 5. Make Private Pill Card with Lock Icon */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-zinc-200">
                  Make Private
                </span>
                
                <div className="flex items-center gap-2.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`w-10 h-5.5 rounded-full transition-colors duration-200 relative flex items-center px-0.5 cursor-pointer ${
                      isPrivate ? 'bg-purple-600' : 'bg-purple-900/60'
                    }`}
                  >
                    <span
                      className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        isPrivate ? 'translate-x-4.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 6. Add Artists & Add Genre Rows with Thin Dividers */}
              <div className="space-y-0.5">
                {/* Add Artists Row */}
                <div className="border-b border-white/[0.08] py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mic2 className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs sm:text-sm font-medium text-zinc-300">Add Artists</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <span>{selectedArtists}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>

                {/* Add Genre Row */}
                <div className="border-b border-white/[0.08] py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Disc className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs sm:text-sm font-medium text-zinc-300">Add Genre</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <span>{selectedGenre}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </div>

              {/* 7. Footer Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 text-center cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!playlistName.trim()}
                  className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white transition-all duration-200 text-center cursor-pointer ${
                    playlistName.trim()
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:brightness-110 shadow-lg shadow-purple-600/50 active:scale-95'
                      : 'bg-purple-900/50 text-white/40 border border-purple-500/20 cursor-not-allowed'
                  }`}
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
