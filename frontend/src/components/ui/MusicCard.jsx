import { motion } from 'framer-motion'
import { Play, Music2 } from 'lucide-react'
import SongContextMenu from './SongContextMenu'

/**
 * MusicCard - Symphony Design Language (SDL) Ultra-Premium Music/Album Card.
 */
export default function MusicCard({
  song,
  title = 'Untitled',
  subtitle,
  artist,
  gradient = 'from-purple-900/50 via-surface-800 to-surface-950',
  imageUrl,
  thumbnail,
  videoId,
  shape = 'square',
  index = 0,
  onClick,
}) {
  const displayArtist = artist || subtitle || 'Artist';
  const songData = song || {
    title,
    artist: displayArtist,
    thumbnail: thumbnail || imageUrl,
    videoId,
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -6, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      className="group/card cursor-pointer select-none h-full relative"
    >
      {/* Outer Ambient Neon Aura */}
      <div className="absolute -inset-0.5 rounded-[22px] bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 opacity-0 group-hover/card:opacity-40 blur-xl transition-all duration-500 pointer-events-none" />

      {/* Glassmorphic Main Card Box */}
      <div
        style={{ padding: '16px' }}
        className="relative rounded-[20px] bg-white/[0.04] backdrop-blur-2xl border border-white/12 hover:border-purple-500/50 shadow-xl shadow-black/40 group-hover/card:shadow-purple-950/40 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
      >
        {/* Top Right Song Context Menu (...) on Hover */}
        {songData && (
          <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
            <SongContextMenu
              song={songData}
              buttonClassName="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
              iconClassName="w-4 h-4"
            />
          </div>
        )}

        {/* Specular Highlight Bar */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60 group-hover/card:opacity-100 transition-opacity duration-300" />

        {/* Ambient Overlay Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-purple-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Artwork Container */}
        <div className="relative mb-3">
          <div className="absolute -inset-1 bg-purple-600/25 rounded-2xl blur-md opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div
            className={`relative aspect-square w-full bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shadow-lg shadow-black/60 border border-white/10 transition-transform duration-500 ease-out ${
              shape === 'circle' ? 'rounded-full' : 'rounded-xl sm:rounded-2xl'
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

          {/* Integrated Floating Play Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-xl backdrop-blur-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/30 text-white flex items-center justify-center shadow-xl shadow-purple-950/80 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300 ease-out"
            aria-label={`Play ${title}`}
          >
            <Play className="w-4 h-4 ml-0.5 text-white fill-white" fill="white" />
          </motion.button>
        </div>

        {/* Card Info Header - Explicit Padding & Line Height */}
        <div className="flex flex-col justify-between flex-1 min-w-0 px-0.5 pb-0.5">
          <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-1 tracking-tight group-hover/card:text-purple-300 transition-colors duration-200">
            {title}
          </h4>
          <p className="text-xs font-medium text-zinc-400 truncate group-hover/card:text-zinc-200 transition-colors duration-200 mt-1">
            {displayArtist}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
