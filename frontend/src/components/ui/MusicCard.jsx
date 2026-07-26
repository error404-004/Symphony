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
  subtitle,
  artist,
  gradient = 'from-[#282828] to-[#181818]',
  imageUrl,
  thumbnail,
  shape = 'square',
  index = 0,
  onClick,
}) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer"
    >
      <div className="p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300">
        {/* Artwork */}
        <div className="relative mb-3">
          <div
            className={`aspect-square w-full bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden ${
              shape === 'circle' ? 'rounded-full' : 'rounded-md'
            }`}
          >
            {(thumbnail || imageUrl) ? (
              <img
                src={thumbnail || imageUrl}
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
            className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black flex items-center justify-center shadow-xl shadow-black/60 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
            aria-label={`Play ${title}`}
          >
            <Play className="w-5 h-5 ml-0.5 text-black fill-black" fill="black" />
          </motion.button>
        </div>

        {/* Info */}
        <div className="px-0.5">
          <p className="text-sm font-semibold text-white truncate transition-colors duration-200">
            {title}
          </p>
          <p className="text-xs text-[#B3B3B3] truncate mt-1">
            {artist || subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
