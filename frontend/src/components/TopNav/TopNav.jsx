import { Search, Bell, User, ChevronLeft, ChevronRight, Clock, History, X, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const pageTitles = {
  '/': 'Home',
  '/search': 'Explorer',
  '/library': 'Your Library',
  '/favorites': 'Favorites',
  '/settings': 'Settings',
  '/profile': 'Profile',
}

const getStoredRecentSearches = () => {
  try {
    const saved = localStorage.getItem('symphony_recent_searches')
    return saved ? JSON.parse(saved) : ['Tum Hi Ho', 'Arijit Singh', 'Top 50 Global', 'Lo-fi beats']
  } catch {
    return ['Tum Hi Ho', 'Arijit Singh', 'Top 50 Global', 'Lo-fi beats']
  }
}

/**
 * TopNav - Premium Glassmorphic Header Navigation for Symphony with Spotify-style Recent Searches.
 */
export default function TopNav() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'Symphony'
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState(getStoredRecentSearches)

  const searchContainerRef = useRef(null)

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('symphony_user_profile')
    return saved ? JSON.parse(saved) : { name: 'User', avatarColor: 'from-purple-500 to-indigo-600' }
  })

  useEffect(() => {
    const handleProfileUpdate = () => {
      const saved = localStorage.getItem('symphony_user_profile')
      if (saved) setUserProfile(JSON.parse(saved))
    }
    window.addEventListener('symphony-profile-updated', handleProfileUpdate)
    return () => window.removeEventListener('symphony-profile-updated', handleProfileUpdate)
  }, [])

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const saveSearchQuery = (searchTerm) => {
    const cleaned = searchTerm.trim()
    if (!cleaned) return

    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleaned.toLowerCase())
      const updated = [cleaned, ...filtered].slice(0, 8)
      localStorage.setItem('symphony_recent_searches', JSON.stringify(updated))
      return updated
    })
  }

  const handleExecuteSearch = (searchTerm) => {
    const finalTerm = searchTerm || query
    if (!finalTerm.trim()) return

    saveSearchQuery(finalTerm)
    setIsDropdownOpen(false)
    navigate(`/search?q=${encodeURIComponent(finalTerm.trim())}`)
  }

  const removeRecentSearch = (itemToRemove, e) => {
    e.stopPropagation()
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove)
      localStorage.setItem('symphony_recent_searches', JSON.stringify(updated))
      return updated
    })
  }

  const clearAllRecentSearches = (e) => {
    e.stopPropagation()
    setRecentSearches([])
    localStorage.setItem('symphony_recent_searches', JSON.stringify([]))
  }

  const filteredRecent = query.trim()
    ? recentSearches.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    : recentSearches

  return (
    <header className="flex items-center justify-between h-16 px-6 glass-card backdrop-blur-2xl backdrop-saturate-150 bg-surface-950/80 border-b border-white/10 shadow-lg shadow-black/40 shrink-0 z-30 sticky top-0">
      {/* Navigation Buttons (< >) & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25 cursor-pointer"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25 cursor-pointer"
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block ml-2 drop-shadow-sm">
          {pageTitle}
        </h1>
      </div>

      {/* Center Search Input Bar with Spotify-style Recent Searches Dropdown */}
      <div ref={searchContainerRef} className="flex-1 max-w-md mx-4 relative">
        <div className="relative group flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-200 pointer-events-none z-10" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsDropdownOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                handleExecuteSearch(query)
              }
            }}
            placeholder="What do you want to play?"
            style={{ paddingLeft: '50px' }}
            className="w-full h-11 pl-12 pr-10 rounded-full bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-xl border border-white/10 group-hover/search:border-purple-500/30 text-sm font-medium text-white placeholder:text-zinc-400/70 caret-purple-400 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 focus:bg-surface-950/90 shadow-md shadow-purple-950/20 focus:shadow-[0_0_24px_rgba(168,85,247,0.25)] transition-all duration-300 ease-out"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('')
                setIsDropdownOpen(true)
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Spotify-style Recent Searches Dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.99 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ backgroundColor: '#181424' }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#181424] border border-white/10 rounded-2xl p-2.5 shadow-[0_25px_70px_rgba(0,0,0,0.9)] z-[99999] text-white select-none space-y-1"
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-1">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  {query.trim() ? 'Search Suggestions' : 'Recent searches'}
                </span>
                {recentSearches.length > 0 && !query.trim() && (
                  <button
                    onClick={clearAllRecentSearches}
                    className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>

              {/* Recent Searches Items List */}
              <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredRecent.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-400 font-medium">
                    {query.trim() ? `Press Enter to search "${query}"` : 'No recent searches'}
                  </div>
                ) : (
                  filteredRecent.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setQuery(item)
                        handleExecuteSearch(item)
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                          <History className="w-4 h-4 text-zinc-400 group-hover:text-purple-300 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate text-white leading-tight">
                            {item}
                          </p>
                          <p className="text-xs text-zinc-400 truncate mt-0.5 font-normal">
                            Search history
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => removeRecentSearch(item, e)}
                        className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/15 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                        title="Remove from recent searches"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right User Control Pill Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/settings')}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-sm shadow-purple-500/80 animate-pulse" />
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 h-9 pl-1.5 pr-3.5 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25 cursor-pointer"
          aria-label="User profile"
        >
          <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${userProfile.avatarColor || 'from-purple-500 to-indigo-600'} text-white shadow-sm shadow-purple-500/40 text-xs font-black uppercase`}>
            {userProfile.name ? userProfile.name.charAt(0) : <User className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-bold tracking-tight max-w-[90px] truncate">{userProfile.name || 'User'}</span>
        </button>
      </div>
    </header>
  )
}
