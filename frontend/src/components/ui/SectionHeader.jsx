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
    <div className="flex items-end justify-between mb-6 sm:mb-7 gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-400/80 font-medium tracking-normal">
            {subtitle}
          </p>
        )}
      </div>
      {showSeeAll && (
        <motion.button
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={onSeeAll}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-purple-300/90 hover:text-white transition-colors duration-200 shrink-0 pb-0.5"
        >
          <span>See all</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  )
}
