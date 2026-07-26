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
 * Sidebar - Premium Glassmorphic Navigation & Library Panel for Symphony
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
    <aside className="hidden md:flex w-[260px] lg:w-[300px] flex-col gap-3 shrink-0 h-full select-none p-1">
      {/* Upper Navigation Card */}
      <div className="glass-card rounded-2xl p-4 space-y-4 border border-white/10 shadow-xl shadow-black/40 relative overflow-hidden">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all duration-300">
            <Music2 className="w-5 h-5 fill-white/20 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
            Symphony
          </span>
        </NavLink>

        {/* Primary Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {topNavItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path

            return (
              <NavLink key={path} to={path} className="group">
                <div
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10 hover:shadow-md hover:shadow-purple-950/20 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive
                        ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                        : 'text-zinc-400 group-hover:text-white'
                    }`}
                  />
                  <span>{label}</span>
                </div>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Lower Your Library Card */}
      <div className="glass-card rounded-2xl p-4 flex-1 flex flex-col overflow-hidden border border-white/10 shadow-xl shadow-black/40 relative">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Library Header */}
        <div className="flex items-center justify-between px-2 py-1 mb-3">
          <NavLink
            to="/library"
            className="flex items-center gap-2.5 text-zinc-400 hover:text-white transition-colors group"
          >
            <Library className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-bold tracking-tight">Your Library</span>
          </NavLink>

          <button
            onClick={() => navigate('/library')}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 border border-transparent hover:border-white/10"
            title="Create playlist or item"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 px-1 mb-3">
          <button
            onClick={() => navigate('/library')}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
          >
            Playlists
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
          >
            Favorites
          </button>
        </div>

        {/* Scrollable Library Items List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-500/40">
          {/* Liked Songs Entry */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99] ${
                isActive
                  ? 'bg-white/10 border border-purple-500/40 shadow-lg shadow-purple-950/40 backdrop-blur-md'
                  : 'hover:bg-white/5 border border-transparent hover:border-white/5'
              }`
            }
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shrink-0 shadow-md shadow-purple-900/30 group-hover:scale-105 group-hover:shadow-purple-500/40 transition-all duration-300">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                Liked Songs
              </p>
              <p className="text-xs text-zinc-400 truncate">
                Playlist • {favorites.length} songs
              </p>
            </div>
          </NavLink>

          {/* Custom Playlists */}
          {playlists.map((playlist) => {
            const isPlaylistActive =
              location.pathname === `/playlists/${playlist.id}`
            return (
              <NavLink
                key={playlist.id}
                to={`/playlists/${playlist.id}`}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99] ${
                  isPlaylistActive
                    ? 'bg-white/10 border border-purple-500/40 shadow-lg shadow-purple-950/40 backdrop-blur-md'
                    : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-purple-500/40 group-hover:bg-purple-600/20 transition-all duration-300">
                  <Music2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                    {playlist.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
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
