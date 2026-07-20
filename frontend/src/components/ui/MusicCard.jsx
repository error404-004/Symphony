import { motion } from 'framer-motion'
import { Play, Music2 } from 'lucide-react'

/**
 * MusicCard - Reusable card component for displaying music items.
 *
 * @param {string} title - Song/Album/Playlist name
 * @param {string} subtitle - Artist name or description
 * @param {string} [gradient] - Tailwind gradient classes for the placeholder art
 * @param {string} [imageUrl] - Optional image URL (future use)
 * @param {'square'|'circle'} [shape='square'] - Card art shape
 * @param {number} index - For staggered animation
 */
export default function MusicCard({
  title = 'Untitled',
  subtitle = 'Unknown Artist',
  gradient = 'from-primary-600 to-primary-900',
  imageUrl,
  shape = 'square',
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer"
    >
      <div className="p-3 rounded-2xl bg-[#181818]/80 hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20">
        {/* Artwork */}
        <div className="relative mb-3">
          <div
            className={`aspect-square w-full bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shadow-lg shadow-black/30 ${
              shape === 'circle' ? 'rounded-full' : 'rounded-xl'
            }`}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music2 className="w-8 h-8 text-white/20" />
            )}
          </div>

          {/* Play button overlay */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-xl shadow-primary-500/40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            aria-label={`Play ${title}`}
          >
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </motion.button>
        </div>

        {/* Info */}
        <div className="px-0.5">
          <p className="text-sm font-semibold text-white truncate group-hover:text-primary-300 transition-colors duration-200">
            {title}
          </p>
          <p className="text-xs text-[#B3B3B3] truncate mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
