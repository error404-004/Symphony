import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [query, setQuery] = useState("")

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-between h-16 px-8 border-b border-white/[0.06] bg-[#0D0D0D]/60 backdrop-blur-xl shrink-0 z-20"
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
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] group-focus-within:text-primary-400 transition-colors duration-200" />
          <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                }
              }}
              placeholder=" Search songs, artists, albums..."
              className="w-full h-10 pl-4 pr-11 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-[#B3B3B3]/50 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 focus:bg-white/[0.08] transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl text-[#B3B3B3] hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-[#0D0D0D] shadow-sm shadow-primary-500/50" />
        </motion.button>

        {/* User Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 h-10 px-3 rounded-xl text-[#B3B3B3] hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          aria-label="User profile"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary shadow-md shadow-primary-500/20">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden lg:block text-sm font-medium">User</span>
        </motion.button>
      </div>
    </motion.header>
  )
}
