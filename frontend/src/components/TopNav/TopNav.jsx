import { Search, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles = {
  '/': 'Home',
  '/search': 'Search',
  '/library': 'Your Library',
  '/favorites': 'Favorites',
  '/settings': 'Settings',
}

export default function TopNav() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'Symphony'
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[#121212] shrink-0 z-20 sticky top-0">
      {/* Navigation Buttons (< >) & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/70 hover:bg-black text-[#B3B3B3] hover:text-white transition-colors"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/70 hover:bg-black text-[#B3B3B3] hover:text-white transition-colors"
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-xl font-bold text-white hidden sm:block ml-2">
          {pageTitle}
        </h1>
      </div>

      {/* Center Search Input Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3] group-focus-within:text-white transition-colors" />
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
            className="w-full h-10 pl-10 pr-4 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border-0 text-sm font-medium text-white placeholder:text-[#B3B3B3] focus:outline-none focus:ring-2 focus:ring-white transition-all"
          />
        </div>
      </div>

      {/* Right User Control Pill Actions */}
      <div className="flex items-center gap-3">
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-black/70 hover:bg-black text-[#B3B3B3] hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1DB954]" />
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 h-8 pl-1 pr-3 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
          aria-label="User profile"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#282828] text-white">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold">User</span>
        </button>
      </div>
    </header>
  )
}
