import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Search,
  Library,
  Heart,
  Settings,
  Music2,
  Plus,
} from 'lucide-react'
import usePlayer from '../../hooks/usePlayer'

/**
 * Sidebar - Spotify Desktop Style Left Panel with Navigation & Your Library
 */
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { playlists, favorites } = usePlayer()

  const topNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="hidden md:flex w-[260px] lg:w-[300px] flex-col gap-2 shrink-0 h-full select-none">
      {/* Upper Navigation Card */}
      <div className="bg-[#121212] rounded-lg p-4 space-y-4">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 px-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1DB954] text-black">
            <Music2 className="w-4 h-4 fill-black text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Symphony
          </span>
        </NavLink>

        {/* Primary Nav Links */}
        <nav className="flex flex-col gap-1">
          {topNavItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path

            return (
              <NavLink key={path} to={path}>
                <div
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#B3B3B3]'}`} />
                  <span>{label}</span>
                </div>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Lower Your Library Card */}
      <div className="bg-[#121212] rounded-lg p-3 flex-1 flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <NavLink
            to="/library"
            className="flex items-center gap-2 text-[#B3B3B3] hover:text-white transition-colors group"
          >
            <Library className="w-6 h-6 text-[#B3B3B3] group-hover:text-white transition-colors" />
            <span className="text-sm font-bold">Your Library</span>
          </NavLink>

          <button
            onClick={() => navigate('/library')}
            className="p-1.5 rounded-full text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-all"
            title="Create playlist or item"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 px-1 mb-3">
          <button
            onClick={() => navigate('/library')}
            className="px-3 py-1 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-xs font-semibold text-white transition-colors"
          >
            Playlists
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className="px-3 py-1 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-xs font-semibold text-white transition-colors"
          >
            Favorites
          </button>
        </div>

        {/* Scrollable Library Items List */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#2a2a2a] [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Liked Songs Entry */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md transition-colors ${
                isActive ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'
              }`
            }
          >
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shrink-0 shadow-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">Liked Songs</p>
              <p className="text-xs text-[#B3B3B3] truncate">
                Playlist • {favorites.length} songs
              </p>
            </div>
          </NavLink>

          {/* Custom Playlists */}
          {playlists.map((playlist) => {
            const isPlaylistActive = location.pathname === `/playlists/${playlist.id}`
            return (
              <NavLink
                key={playlist.id}
                to={`/playlists/${playlist.id}`}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                  isPlaylistActive ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="w-12 h-12 rounded-md bg-[#282828] flex items-center justify-center shrink-0">
                  <Music2 className="w-5 h-5 text-[#B3B3B3]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">
                    {playlist.name}
                  </p>
                  <p className="text-xs text-[#B3B3B3] truncate">
                    Playlist • {playlist.songs.length} tracks
                  </p>
                </div>
              </NavLink>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
