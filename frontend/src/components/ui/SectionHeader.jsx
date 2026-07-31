import { motion } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'

/**
 * SectionHeader - Reusable section heading with optional "See All" action.
 *
 * @param {string} title - Section title
 * @param {string} [subtitle] - Optional subtitle/description
 * @param {boolean} [showSeeAll=true] - Whether to show the "See All" link
 * @param {function} [onSeeAll] - Callback when "See All" is clicked
 * @param {boolean} [isExpanded=false] - Whether section is expanded
 * @param {string} [seeAllText] - Custom button label override
 */
export default function SectionHeader({
  title,
  subtitle,
  showSeeAll = true,
  onSeeAll,
  isExpanded = false,
  seeAllText,
}) {
  const label = seeAllText || (isExpanded ? 'Show less' : 'See all')

  return (
    <div className="flex items-end justify-between mb-6 sm:mb-7 gap-4 select-none">
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSeeAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-purple-600/30 border border-white/10 hover:border-purple-400/50 text-xs sm:text-sm font-bold text-purple-300 hover:text-white transition-all duration-200 shrink-0 shadow-sm cursor-pointer"
        >
          <span>{label}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-purple-300" />
          ) : (
            <ChevronRight className="w-4 h-4 text-purple-300" />
          )}
        </motion.button>
      )}
    </div>
  )
}
