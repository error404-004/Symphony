import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Compass,
  Settings,
  Heart,
  Clock,
  Music2,
  Library as LibraryIcon,
  Play,
  Pause,
  ListMusic,
  Plus,
} from 'lucide-react'
import usePlayer from '../../hooks/usePlayer'

/**
 * Sidebar - Symphony Premium Obsidian Glass Sidepanel
 *
 * Designed to seamlessly pair with the Symphony Home UI panel:
 * - Obsidian Glass Canvas: bg-[#0d0a18]/90 with backdrop-blur-3xl & border-white/[0.08]
 * - Ambient Radial Glow Orbs matching Home UI theme
 * - Neon Left Active Indicator Bars & glowing gradient navigation pills
 * - Framer-motion micro-interactions on hover and active states
 * - Mini-artwork glass playlist cards & library shortcuts
 * - Mini Now Playing Widget at sidebar bottom with animated visualizer
 * - Preserves exact original Symphony logo and react player state logic
 */
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    playlists,
    favorites,
    currentSong,
    isPlaying,
    resumeSong,
    pauseSong,
    openCreatePlaylistModal,
  } = usePlayer()

  const topNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Explorer', icon: Compass },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const isLibraryActive = location.pathname === '/library'
  const isFavoritesActive = location.pathname === '/favorites'

  const displayPlaylists =
    playlists && playlists.length > 0
      ? playlists
      : [
          { id: 'mixtape', name: 'Mix Tape', count: 12 },
          { id: 'indie', name: 'Indie Vibes', count: 24 },
          { id: 'night', name: 'Night Grooves', count: 18 },
          { id: 'lofi', name: 'Lo-Fi Chill', count: 30 },
        ]

  // Gradient combinations for playlist mini-art covers
  const playlistGradients = [
    'from-purple-600 to-indigo-600',
    'from-pink-500 to-rose-600',
    'from-blue-600 to-cyan-500',
    'from-violet-600 to-fuchsia-600',
    'from-emerald-500 to-teal-600',
  ]

  return (
    <aside className="hidden md:flex w-[260px] lg:w-[280px] flex-col shrink-0 h-full select-none relative z-20">
      {/* Outer Floating Obsidian Glass Container */}
      <div className="bg-[#0d0a18]/90 backdrop-blur-3xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/90 flex-1 flex flex-col overflow-hidden p-5 relative">
        
        {/* Soft Ambient Radial Background Glow Orbs */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-purple-600/18 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 -right-16 w-48 h-48 bg-indigo-600/12 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 1. Preserved Symphony Logo Section */}
        <div className="shrink-0 pb-5 relative z-10 border-b border-white/[0.06]">
          <NavLink to="/" className="flex items-center gap-3 px-1 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all duration-300">
              <Music2 className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
              Symphony
            </span>
          </NavLink>
        </div>

        {/* Scrollable Navigation & Content Section */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-6 pt-5 relative z-10 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {/* 2. Main Navigation Section */}
          <nav className="flex flex-col gap-2">
            {topNavItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path

              return (
                <NavLink key={path} to={path} className="relative block">
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-purple-400 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.9)] z-20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-purple-600/10 border border-purple-500/40 text-white shadow-lg shadow-purple-950/40 backdrop-blur-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.06]'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'text-zinc-400 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{label}</span>
                  </motion.div>
                </NavLink>
              )
            })}
          </nav>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent shrink-0" />

          {/* 3. Your Library Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold text-zinc-400/80 uppercase tracking-wider">
                Your Library
              </h3>
              <NavLink
                to="/library"
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                title="View full library"
              >
                <LibraryIcon className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            <div className="space-y-1.5">
              {/* Liked Songs Shortcut */}
              <NavLink to="/favorites" className="relative block">
                {isFavoritesActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-purple-400 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.9)] z-20" />
                )}
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isFavoritesActive
                      ? 'bg-white/10 text-white border border-purple-500/40 shadow-md shadow-purple-950/40 font-semibold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm shrink-0">
                    <Heart className="w-3.5 h-3.5 fill-purple-400/40" />
                  </div>
                  <span className="truncate">Liked Songs</span>
                  {favorites && favorites.length > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-normal">
                      {favorites.length}
                    </span>
                  )}
                </motion.div>
              </NavLink>

              {/* Recently Played Shortcut */}
              <NavLink to="/library" className="relative block">
                {isLibraryActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-indigo-400 to-blue-500 shadow-[0_0_12px_rgba(99,102,241,0.9)] z-20" />
                )}
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isLibraryActive
                      ? 'bg-white/10 text-white border border-indigo-500/40 shadow-md shadow-indigo-950/40 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">Recently Played</span>
                </motion.div>
              </NavLink>
            </div>
          </div>

          {/* 4. Playlists Section */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold text-zinc-400/80 uppercase tracking-wider">
                Playlists
              </h3>
              <button
                onClick={openCreatePlaylistModal}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer group flex items-center gap-1 text-xs"
                title="Create New Playlist"
              >
                <Plus className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="space-y-1">
              {displayPlaylists.map((pl, idx) => {
                const playlistIdStr = String(pl.id)
                const isActive = location.pathname === `/playlists/${playlistIdStr}`
                const gradientClass = pl.gradient || playlistGradients[idx % playlistGradients.length]

                return (
                  <NavLink
                    key={pl.id}
                    to={playlistIdStr.length > 5 ? `/playlists/${pl.id}` : '/library'}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-white/10 text-purple-300 font-semibold border border-purple-500/30'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-xs shadow-sm shrink-0 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all`}>
                        <ListMusic className="w-3.5 h-3.5 text-white/90" />
                      </div>
                      <span className="truncate flex-1">{pl.name}</span>
                      {pl.songs && (
                        <span className="text-[10px] text-zinc-400 font-normal">
                          {pl.songs.length}
                        </span>
                      )}
                    </motion.div>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>

        {/* 5. Mini Now Playing Visualizer Widget at Sidebar Bottom */}
        {currentSong && (
          <div className="shrink-0 pt-4 relative z-10 border-t border-white/[0.08] mt-2">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-2.5 backdrop-blur-md flex items-center gap-3 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
              {/* Cover Art or Music Icon */}
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-purple-900/40 relative shrink-0 flex items-center justify-center border border-white/10 shadow-md">
                {currentSong.thumbnail ? (
                  <img
                    src={currentSong.thumbnail}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music2 className="w-4 h-4 text-purple-300" />
                )}
              </div>

              {/* Track Title & Artist */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white truncate leading-tight">
                  {currentSong.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {currentSong.artist || currentSong.author || 'Unknown Artist'}
                </p>
              </div>

              {/* Sound Equalizer / Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Mini Equalizer animation bars */}
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-3.5 px-1">
                    <span className="w-0.5 bg-purple-400 rounded-full animate-bounce h-full" style={{ animationDuration: '0.6s' }} />
                    <span className="w-0.5 bg-indigo-400 rounded-full animate-bounce h-2/3" style={{ animationDuration: '0.9s' }} />
                    <span className="w-0.5 bg-purple-300 rounded-full animate-bounce h-4/5" style={{ animationDuration: '0.7s' }} />
                  </div>
                )}
                
                <button
                  onClick={isPlaying ? pauseSong : resumeSong}
                  className="w-7 h-7 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white text-white" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </aside>
  )
}
