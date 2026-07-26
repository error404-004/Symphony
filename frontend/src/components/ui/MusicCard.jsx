import { motion } from 'framer-motion'
import { Play, Music2 } from 'lucide-react'

/**
 * MusicCard - Symphony Design Language (SDL) Premium Album Card.
 *
 * @param {string} title - Song/Album/Playlist name
 * @param {string} subtitle - Artist name or description
 * @param {string} artist - Artist name alternative
 * @param {string} [gradient] - Tailwind gradient classes for the placeholder art
 * @param {string} [imageUrl] - Optional image URL
 * @param {string} [thumbnail] - Optional thumbnail URL
 * @param {'square'|'circle'} [shape='square'] - Card art shape
 * @param {number} index - For staggered animation
 * @param {function} onClick - Click handler callback
 */
export default function MusicCard({
  title = 'Untitled',
  subtitle,
  artist,
  gradient = 'from-purple-900/50 via-surface-800 to-surface-950',
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
      whileHover={{ y: -6, scale: 1.025, rotate: 0.5 }}
      className="group/card cursor-pointer select-none"
    >
      <div className="p-3.5 sm:p-4 rounded-[22px] bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 border border-white/10 hover:border-purple-500/40 shadow-xl shadow-purple-950/20 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 ease-out relative overflow-hidden">
        {/* Top Specular Glass Reflection Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60 group-hover/card:opacity-100 transition-opacity duration-300" />

        {/* Ambient Purple Glow Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-purple-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[22px]" />

        {/* Artwork Container */}
        <div className="relative mb-3.5">
          {/* Subtle Ambient Glow Behind Artwork */}
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/30 to-indigo-600/20 rounded-2xl blur-md opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div
            className={`relative aspect-square w-full bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shadow-md shadow-black/50 border border-white/10 transition-transform duration-500 ease-out ${
              shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
            }`}
          >
            {thumbnail || imageUrl ? (
              <img
                src={thumbnail || imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
              />
            ) : (
              <Music2 className="w-10 h-10 text-purple-300/30 group-hover/card:text-purple-300/60 transition-colors duration-300" />
            )}
          </div>

          {/* Integrated Glass Play Badge Overlay */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-purple-500/90 to-indigo-600/90 border border-white/30 text-white flex items-center justify-center shadow-lg shadow-purple-950/80 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300 ease-out"
            aria-label={`Play ${title}`}
          >
            <Play className="w-5 h-5 ml-0.5 text-white fill-white" fill="white" />
          </motion.button>
        </div>

        {/* Card Info Header */}
        <div className="px-0.5 space-y-1">
          <p className="text-sm font-bold text-white truncate tracking-tight group-hover/card:text-purple-200 transition-colors duration-300">
            {title}
          </p>
          <p className="text-xs text-zinc-400/90 truncate font-medium group-hover/card:text-zinc-300 transition-colors duration-300">
            {artist || subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
