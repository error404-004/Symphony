import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

/**
 * SectionHeader - Reusable section heading with optional "See All" action.
 *
 * @param {string} title - Section title
 * @param {string} [subtitle] - Optional subtitle/description
 * @param {boolean} [showSeeAll=true] - Whether to show the "See All" link
 * @param {function} [onSeeAll] - Callback when "See All" is clicked
 */
export default function SectionHeader({
  title,
  subtitle,
  showSeeAll = true,
  onSeeAll,
}) {
  return (
    <div className="flex items-end justify-between mb-5 sm:mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">{title}</h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
      {showSeeAll && (
        <motion.button
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={onSeeAll}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-purple-300 hover:text-white transition-colors duration-200"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  )
}
