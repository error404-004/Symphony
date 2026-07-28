import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Music2, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import usePlayer from '../../hooks/usePlayer'

export default function CreatePlaylistModal() {
  const { isCreatePlaylistOpen, closeCreatePlaylistModal, createPlaylist } = usePlayer()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCreatePlaylistOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCreatePlaylistOpen])

  const handleClose = () => {
    setName('')
    setDescription('')
    setError('')
    closeCreatePlaylistModal()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a playlist name')
      return
    }

    const newPlaylist = createPlaylist({
      name: name.trim(),
      description: description.trim(),
      gradient: 'from-purple-600 via-purple-700 to-indigo-800',
    })

    handleClose()

    if (newPlaylist && newPlaylist.id) {
      navigate(`/playlists/${newPlaylist.id}`)
    }
  }

  if (!isCreatePlaylistOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Soft Dark Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        />

        {/* Dark Obsidian Transparent Glass Square Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="relative w-full max-w-[480px] sm:max-w-[520px] min-h-[600px] bg-[#0d0a18]/50 backdrop-blur-2xl border border-purple-500/25 shadow-[0_0_90px_rgba(168,85,247,0.3)] rounded-[36px] p-8 z-10 flex flex-col justify-between overflow-hidden"
        >
          {/* Ambient Glow Orbs inside obsidian glass */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/25 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Subtle Watermark Icon Background */}
          <Music2 className="absolute -bottom-6 -right-6 w-40 h-40 text-purple-400/[0.04] pointer-events-none z-0 rotate-[-12deg]" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Header Section with Generous Bottom Margin */}
          <div className="flex items-start gap-4 mb-8 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/40 shrink-0">
              <Sparkles className="w-5.5 h-5.5 fill-white/20" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Create New Playlist
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-2">
                Curate your custom soundscape and track vault
              </p>
            </div>
          </div>

          {/* Form Content with Open Vertical Spacing */}
          <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col justify-start space-y-7">
            {/* Playlist Name Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Playlist Name <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                placeholder="e.g. Late Night Vibes, Summer Highway..."
                className={`w-full h-12 px-4 rounded-xl bg-black/35 border ${
                  error
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/10 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/25'
                } text-sm font-semibold text-white placeholder:text-zinc-500 focus:outline-none backdrop-blur-md transition-all shadow-inner`}
              />
              {error && (
                <p className="text-xs text-rose-400 font-medium mt-2 flex items-center gap-1">
                  ⚠️ {error}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-0.5">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Description <span className="text-zinc-500 font-normal lowercase">(optional)</span>
                </label>
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md">
                  <Globe className="w-3 h-3 text-purple-400" /> Public
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give your playlist a story or mood description..."
                className="w-full flex-1 h-32 px-4 py-3 rounded-xl bg-black/35 border border-white/10 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/25 text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none backdrop-blur-md transition-all resize-none shadow-inner leading-relaxed"
              />
            </div>
          </form>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/[0.1] relative z-10">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 border border-transparent transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              type="submit"
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/40 hover:shadow-purple-500/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              Create Playlist
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
