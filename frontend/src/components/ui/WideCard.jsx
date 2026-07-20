import { motion } from 'framer-motion'
import { Play, Music2 } from 'lucide-react'

/**
 * WideCard - A horizontal/wide card for "Continue Listening" or featured sections.
 *
 * @param {string} title - Track/Playlist name
 * @param {string} subtitle - Artist or description
 * @param {string} [gradient] - Gradient classes for placeholder art
 * @param {number} index - For staggered animation
 */
export default function WideCard({
  title = 'Untitled',
  subtitle = 'Unknown',
  gradient = 'from-primary-600 to-primary-900',
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="flex items-center gap-3 p-2 pr-3 rounded-xl bg-[#181818]/60 hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 overflow-hidden shadow-md shadow-black/10">
        {/* Mini artwork */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg shadow-black/20`}>
          <Music2 className="w-5 h-5 text-white/20" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <p className="text-xs text-[#B3B3B3] truncate">{subtitle}</p>
        </div>

        {/* Play on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
