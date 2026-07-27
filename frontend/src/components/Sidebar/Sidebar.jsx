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

  const isLibraryActive = location.pathname === '/library'
  const isFavoritesActive = location.pathname === '/favorites'

  return (
    <aside className="hidden md:flex w-[260px] lg:w-[300px] flex-col gap-6 shrink-0 h-full select-none p-1">
      {/* Panel 1: Brand & Primary Navigation */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-xl shadow-black/40 relative overflow-hidden shrink-0 flex flex-col gap-4">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Logo Header */}
        <div className="px-1 pt-0.5">
          <NavLink to="/" className="flex items-center gap-3 px-1 py-1 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all duration-300">
              <Music2 className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
              Symphony
            </span>
          </NavLink>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-2">
          {topNavItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path

            return (
              <NavLink key={path} to={path} className="group">
                <div
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] ${
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

      {/* Panel 2: Your Library & Playlists */}
      <div className="glass-card rounded-2xl p-5 flex-1 flex flex-col gap-4 overflow-hidden border border-white/10 shadow-xl shadow-black/40 relative">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Library Header */}
        <div className="flex items-center justify-between px-1 pt-0.5">
          <NavLink
            to="/library"
            className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors group"
          >
            <Library className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-base font-bold tracking-tight">Your Library</span>
          </NavLink>

          <button
            onClick={() => navigate('/library')}
            className="flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 border border-transparent hover:border-white/10"
            title="Create playlist or view library"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Control Chips */}
        <div className="flex items-center gap-3 px-1">
          <button
            onClick={() => navigate('/library')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm border ${
              isLibraryActive
                ? 'bg-purple-600/30 border-purple-500/50 text-white shadow-purple-950/40'
                : 'bg-white/[0.05] hover:bg-purple-600/20 border-white/10 hover:border-purple-500/30 text-zinc-300 hover:text-white'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm border ${
              isFavoritesActive
                ? 'bg-purple-600/30 border-purple-500/50 text-white shadow-purple-950/40'
                : 'bg-white/[0.05] hover:bg-purple-600/20 border-white/10 hover:border-purple-500/30 text-zinc-300 hover:text-white'
            }`}
          >
            Favorites
          </button>
        </div>

        {/* Scrollable Library Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-500/40">
          {/* Liked Songs Entry */}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99] ${
                isActive
                  ? 'bg-white/10 border border-purple-500/40 shadow-lg shadow-purple-950/40 backdrop-blur-md'
                  : 'hover:bg-white/5 border border-transparent hover:border-white/5'
              }`
            }
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shrink-0 shadow-md shadow-purple-900/30 group-hover:scale-105 group-hover:shadow-purple-500/40 transition-all duration-300">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors leading-tight">
                Liked Songs
              </p>
              <p className="text-xs text-zinc-400 truncate font-medium">
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
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99] ${
                  isPlaylistActive
                    ? 'bg-white/10 border border-purple-500/40 shadow-lg shadow-purple-950/40 backdrop-blur-md'
                    : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-purple-500/40 group-hover:bg-purple-600/20 transition-all duration-300">
                  <Music2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors leading-tight">
                    {playlist.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate font-medium">
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
