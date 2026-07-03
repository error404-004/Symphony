import { Search, Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Home',
  '/search': 'Search',
  '/library': 'Your Library',
  '/favorites': 'Favorites',
  '/settings': 'Settings',
}

/**
 * TopNav - Top navigation bar with search, notifications, and user profile.
 */
export default function TopNav() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'Symphony'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-between h-16 px-6 border-b border-surface-800/40 bg-surface-950/80 backdrop-blur-md shrink-0 z-20"
    >
      {/* Page Title */}
      <motion.h1
        key={pageTitle}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-lg font-semibold text-white md:hidden lg:block"
      >
        {pageTitle}
      </motion.h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500 group-focus-within:text-primary-400 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-900 border border-surface-800 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-600/50 focus:ring-1 focus:ring-primary-600/20 transition-all duration-200"
            readOnly
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl text-surface-400 hover:text-surface-200 hover:bg-surface-800/60 transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-surface-950" />
        </motion.button>

        {/* User Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 h-10 px-3 rounded-xl text-surface-300 hover:text-white hover:bg-surface-800/60 transition-colors duration-200"
          aria-label="User profile"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden lg:block text-sm font-medium">User</span>
        </motion.button>
      </div>
    </motion.header>
  )
}
