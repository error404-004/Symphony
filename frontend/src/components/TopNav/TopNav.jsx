import { Search, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles = {
  '/': 'Home',
  '/search': 'Explorer',
  '/library': 'Your Library',
  '/favorites': 'Favorites',
  '/settings': 'Settings',
}

/**
 * TopNav - Premium Glassmorphic Header Navigation for Symphony
 */
export default function TopNav() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'Symphony'
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <header className="flex items-center justify-between h-16 px-6 glass-card backdrop-blur-2xl backdrop-saturate-150 bg-surface-950/80 border-b border-white/10 shadow-lg shadow-black/40 shrink-0 z-20 sticky top-0">
      {/* Navigation Buttons (< >) & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25"
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block ml-2 drop-shadow-sm">
          {pageTitle}
        </h1>
      </div>

      {/* Center Search Input Bar - Symphony Design Language (SDL) */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative group flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-200 pointer-events-none z-10" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                navigate(`/search?q=${encodeURIComponent(query)}`)
              }
            }}
            placeholder="What do you want to play?"
            style={{ paddingLeft: '50px' }}
            className="w-full h-11 pl-12 pr-5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-xl border border-white/10 group-hover/search:border-purple-500/30 text-sm font-medium text-white placeholder:text-zinc-400/70 caret-purple-400 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 focus:bg-surface-950/90 shadow-md shadow-purple-950/20 focus:shadow-[0_0_24px_rgba(168,85,247,0.25)] transition-all duration-300 ease-out"
          />
        </div>
      </div>

      {/* Right User Control Pill Actions */}
      <div className="flex items-center gap-3">
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-sm shadow-purple-500/80 animate-pulse" />
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 h-9 pl-1.5 pr-3.5 rounded-full bg-white/[0.05] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25"
          aria-label="User profile"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm shadow-purple-500/40">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-tight">User</span>
        </button>
      </div>
    </header>
  )
}
