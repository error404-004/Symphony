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
  subtitle,
  artist,
  thumbnail,
  gradient = 'from-[#282828] to-[#181818]',
  index = 0,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 p-2 pr-3 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 overflow-hidden">
        {/* Mini artwork */}
        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <Music2 className="w-5 h-5 text-white/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <p className="text-xs text-[#B3B3B3] truncate">
            {artist || subtitle}
          </p>
        </div>

        {/* Play on hover */}
        <motion.div
          onClick={onClick}
          initial={{ opacity: 0, scale: 0.8 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#1DB954] hover:bg-[#1ED760] flex items-center justify-center shadow-lg shadow-black/50 transition-transform duration-200 hover:scale-105">
            <Play className="w-4 h-4 text-black fill-black ml-0.5" fill="black" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
