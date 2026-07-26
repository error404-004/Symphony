import { motion } from 'framer-motion'
import { Play, Music2 } from 'lucide-react'

/**
 * WideCard - Premium horizontal/wide card for "Continue Listening" or featured sections in Symphony.
 *
 * @param {string} title - Track/Playlist name
 * @param {string} subtitle - Artist or description
 * @param {string} artist - Artist name alternative
 * @param {string} thumbnail - Track image thumbnail
 * @param {string} [gradient] - Gradient classes for placeholder art
 * @param {number} index - For staggered animation
 * @param {function} onClick - Click handler callback
 */
export default function WideCard({
  title = 'Untitled',
  subtitle,
  artist,
  thumbnail,
  gradient = 'from-purple-900/40 via-surface-800 to-surface-900',
  index = 0,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer select-none"
      onClick={onClick}
    >
      <div className="flex items-center gap-3.5 p-2.5 pr-4 rounded-xl glass-card backdrop-blur-xl border border-white/10 hover:border-purple-500/40 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden relative">
        {/* Mini artwork */}
        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md border border-white/5">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <Music2 className="w-6 h-6 text-purple-300/40" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">{title}</p>
          <p className="text-xs text-zinc-400 truncate font-medium mt-0.5">
            {artist || subtitle}
          </p>
        </div>

        {/* Play on hover */}
        <motion.div
          onClick={onClick}
          initial={{ opacity: 0, scale: 0.8 }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-950/60 border border-purple-300/30 transition-transform duration-200 hover:scale-105">
            <Play className="w-4.5 h-4.5 text-white fill-white ml-0.5" fill="white" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
