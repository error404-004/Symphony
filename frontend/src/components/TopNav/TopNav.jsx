import { Search, Bell, User, ChevronLeft, ChevronRight, Clock, History, X, Trash2, Disc3, Music2, Play, Loader2, Plus, ArrowUpLeft } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { searchMusic } from '../../services/api'
import usePlayer from '../../hooks/usePlayer'

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

const getRecentItemMetadata = (itemStr) => {
  const searchTerm = typeof itemStr === 'string' ? itemStr : itemStr?.query || itemStr?.title || ''
  if (!searchTerm) return { title: itemStr, thumbnail: null, artist: 'Search history' }

  try {
    const recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || []
    const termLower = searchTerm.toLowerCase().trim()

    // Match in recentlyPlayed tracks by title or artist
    const match = recentlyPlayed.find((s) => {
      const title = (s.title || '').toLowerCase()
      const artist = (s.artist || s.author || '').toLowerCase()
      return title === termLower || title.includes(termLower) || termLower.includes(title) || artist.includes(termLower)
    })

    if (match && match.thumbnail) {
      return {
        title: searchTerm,
        thumbnail: match.thumbnail,
        artist: match.artist || match.author || 'Recently played track',
      }
    }
  } catch (e) {
    /* ignore */
  }

  return { title: searchTerm, thumbnail: null, artist: 'Search history' }
}

const getPageTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.startsWith('/playlists/')) return 'Playlist'
  if (pathname.startsWith('/artists/')) return 'Artist'
  return 'Symphony'
}

/**
 * TopNav - Premium Glassmorphic Header Navigation for Symphony with Spotify-style Recent Searches & Live Search Suggestions.
 */
export default function TopNav() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)
  const navigate = useNavigate()
  const { playSong, addSongToPlaylist, favorites, toggleFavorite } = usePlayer()

  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState(getStoredRecentSearches)

  // Live Auto-complete Suggestions state
  const [liveSuggestions, setLiveSuggestions] = useState([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const searchContainerRef = useRef(null)

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('symphony_user_profile')
    return saved ? JSON.parse(saved) : { name: 'User', avatarColor: 'from-purple-500 to-indigo-600' }
  })

  // Debounced Live Suggestions Fetcher
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setLiveSuggestions([])
      setIsLoadingSuggestions(false)
      return
    }

    setIsLoadingSuggestions(true)
    const handler = setTimeout(async () => {
      try {
        const data = await searchMusic(trimmed, 5)
        const songsList = Array.isArray(data) ? data : data.songs || []
        setLiveSuggestions(songsList)
      } catch (err) {
        console.error('Failed to fetch live search suggestions:', err)
        setLiveSuggestions([])
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 250)

    return () => clearTimeout(handler)
  }, [query])

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
    <header className="flex items-center justify-between h-16 px-6 glass-card backdrop-blur-2xl backdrop-saturate-150 bg-surface-950/80 border-b border-white/10 shadow-lg shadow-black/40 shrink-0 sticky top-0" style={{ zIndex: 9000 }}>
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

        {/* Recent Searches Dropdown — absolute inside header, above all page content */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                zIndex: 999999,
                background: 'rgb(14, 11, 26)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.95)',
                color: 'white',
                userSelect: 'none',
              }}
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-1">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  {query.trim() ? (
                    <>
                      <Search className="w-4 h-4 text-purple-400" />
                      <span>Search Suggestions</span>
                      {isLoadingSuggestions && <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin ml-1" />}
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>Recent searches</span>
                    </>
                  )}
                </span>

                {query.trim() ? (
                  <span className="text-[10px] font-semibold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    Enter ↵ to search all
                  </span>
                ) : recentSearches.length > 0 ? (
                  <button
                    onClick={clearAllRecentSearches}
                    className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear all</span>
                  </button>
                ) : null}
              </div>

              {/* Suggestions / Recent Searches Items List */}
              <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {query.trim() ? (
                  /* Active Live Search Suggestions (Spotify Style) */
                  <>
                    {/* 1. Primary Query Suggestion */}
                    <div
                      onClick={() => handleExecuteSearch(query)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                          <Search className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate text-white leading-tight">
                            "{query}" <span className="text-xs font-normal text-zinc-400">songs</span>
                          </p>
                          <p className="text-[11px] text-purple-300 font-medium truncate mt-0.5">
                            Search all matching tracks & artists
                          </p>
                        </div>
                      </div>
                      <ArrowUpLeft className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 transition-colors shrink-0" />
                    </div>

                    {/* 2. Live Song Results */}
                    {liveSuggestions.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <div className="px-3 pt-1 pb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Matching Songs
                          </span>
                        </div>

                        {liveSuggestions.map((song) => (
                          <div
                            key={song.videoId || song.id}
                            onClick={() => {
                              saveSearchQuery(song.title)
                              playSong(song)
                              setIsDropdownOpen(false)
                            }}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={song.thumbnail}
                                alt={song.title}
                                className="w-9 h-9 rounded-md object-cover border border-white/15 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-bold truncate text-white leading-tight group-hover:text-purple-300 transition-colors">
                                  {song.title}
                                </p>
                                <p className="text-xs text-zinc-400 truncate mt-0.5 font-medium">
                                  Song • {song.artist || song.author || 'Artist'}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                saveSearchQuery(song.title)
                                playSong(song)
                                setIsDropdownOpen(false)
                              }}
                              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-950/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                              title="Play song"
                            >
                              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {!isLoadingSuggestions && liveSuggestions.length === 0 && (
                      <div className="py-4 text-center text-xs text-zinc-400 font-medium">
                        Press Enter ↵ to search all result pages for "{query}"
                      </div>
                    )}
                  </>
                ) : filteredRecent.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-400 font-medium">
                    No recent searches
                  </div>
                ) : (
                  filteredRecent.map((item) => {
                    const meta = getRecentItemMetadata(item)

                    return (
                      <div
                        key={typeof item === 'string' ? item : item?.query || item?.title}
                        onClick={() => {
                          setQuery(meta.title)
                          handleExecuteSearch(meta.title)
                        }}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {meta.thumbnail ? (
                            <img
                              src={meta.thumbnail}
                              alt={meta.title}
                              className="w-9 h-9 rounded-md object-cover border border-white/15 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-surface-900 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:border-purple-400/50 transition-colors shadow-sm">
                              <Disc3 className="w-4.5 h-4.5 text-purple-300 group-hover:text-white transition-colors" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate text-white leading-tight">
                              {meta.title}
                            </p>
                            <p className="text-xs text-zinc-400 truncate mt-0.5 font-normal">
                              {meta.artist}
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
                    )
                  })
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
