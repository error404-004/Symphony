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
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[#B3B3B3] mt-1">{subtitle}</p>
        )}
      </div>
      {showSeeAll && (
        <motion.button
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm font-medium text-[#B3B3B3] hover:text-primary-400 transition-colors duration-200"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  )
}
