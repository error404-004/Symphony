import { useState } from 'react'
import logoImg from '../../assets/logo.png'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Compass,
  Settings,
  Heart,
  Music2,
  ListMusic,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Info,
  Maximize2,
  X,
  Disc3,
  Calendar,
  Sparkles
} from 'lucide-react'
import usePlayer from '../../hooks/usePlayer'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:45'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

/**
 * Sidebar - Symphony Glassmorphic Side Panel
 * Features:
 * - Real user playlists only (dummy playlists removed)
 * - Conditional Now Playing card (hidden when idle)
 * - Click-to-open Glassmorphic Popup Modal for full song, author, album & release details
 */
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  // State to manage collapsible sidebar
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('symphony_sidebar_collapsed') === 'true'
  })

  // State to manage expanding the Now Playing glassmorphic popup modal
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('symphony_sidebar_collapsed', String(next))
      return next
    })
  }

  const {
    playlists,
    favorites,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    openCreatePlaylistModal,
  } = usePlayer()

  const topNavItems = [
    { path: '/', label: 'Home', icon: Home, shortBadge: 'H' },
    { path: '/search', label: 'Explore', icon: Compass },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const isFavoritesActive = location.pathname === '/favorites'

  const userPlaylists = playlists && playlists.length > 0 ? playlists : []

  // Dynamic values for the bottom visualizer card & popup modal
  const hasSelectedTrack = Boolean(currentSong && (currentSong.title || isPlaying))
  const songTitle = currentSong?.title || ''
  const authorName = currentSong?.artist || currentSong?.author || 'Unknown Artist'
  const albumName = currentSong?.album || currentSong?.title || 'Symphony Singles'
  const releaseYear = currentSong?.year || '2024'
  const genreName = currentSong?.genre || 'Ambient / Pop'
  const coverArt = currentSong?.cover || currentSong?.coverUrl || logoImg
  const timeFormatted = duration > 0 ? `(${formatTime(currentTime)} / ${formatTime(duration)})` : '(0:45 / 3:12)'
  const aboutText = currentSong?.about || currentSong?.description || `${songTitle} is a signature release by ${authorName}, featuring spatial soundscapes, deep atmospheric basslines, and polished vocal textures.`

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 84 : 295 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="hidden md:flex flex-col shrink-0 h-full select-none relative z-20 p-2 overflow-hidden"
      >
        {/* Outer Glass Panel with Glowing Violet Border */}
        <div className={`bg-[#0c071e]/85 backdrop-blur-3xl rounded-[32px] border-2 border-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.4)] flex-1 flex flex-col overflow-hidden relative transition-all duration-300 ${
          isCollapsed ? 'p-3 items-center' : 'p-4'
        }`}>
          
          {/* Soft Radial Neon Glow Aura in background */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/30 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute top-1/2 -right-20 w-56 h-56 bg-indigo-600/25 rounded-full blur-[110px] pointer-events-none" />

          {/* 1. Header: SYMPHONY Logo & Expand/Collapse Toggle */}
          <div className={`shrink-0 pb-4 relative z-10 flex items-center w-full ${
            isCollapsed ? 'flex-col gap-2.5 items-center justify-center' : 'justify-between px-1'
          }`}>
            <NavLink to="/" className="flex items-center gap-3 group min-w-0">
              <img 
                src={logoImg} 
                alt="Symphony Logo" 
                className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-purple-500/40 group-hover:scale-105 transition-all duration-300 border border-purple-400/40 shrink-0"
              />
              {!isCollapsed && (
                <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-purple-300 transition-colors uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  SYMPHONY
                </span>
              )}
            </NavLink>

            {/* Toggle Sidebar Button */}
            <button
              onClick={toggleCollapse}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] hover:bg-purple-600/30 border border-white/15 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-500/25 shrink-0 cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Scrollable Nav & Library Container */}
          <div className={`flex-1 overflow-y-auto pr-0.5 space-y-4 relative z-10 w-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-purple-500/20 [&::-webkit-scrollbar-thumb]:rounded-full ${
            isCollapsed ? 'flex flex-col items-center' : ''
          }`}>
            
            {/* 2. Main Navigation Items */}
            <nav className={`flex flex-col gap-2 w-full ${isCollapsed ? 'items-center' : ''}`}>
              {topNavItems.map(({ path, label, icon: Icon, shortBadge }) => {
                const isActive = location.pathname === path

                if (isCollapsed) {
                  return (
                    <NavLink key={path} to={path} className="block relative group" title={label}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.94 }}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_22px_rgba(168,85,247,0.6)] border border-purple-300/40'
                            : 'bg-white/[0.04] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-purple-300 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    </NavLink>
                  )
                }

                return (
                  <NavLink key={path} to={path} className="relative block w-full">
                    <motion.div
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.65)] border border-purple-300/40'
                          : 'text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent'
                      }`}
                    >
                      {shortBadge && isActive ? (
                        <div className="w-7 h-7 rounded-xl bg-white text-purple-950 font-black flex items-center justify-center text-sm shadow-md shrink-0">
                          {shortBadge}
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                      )}

                      <span className="tracking-wide text-base font-semibold truncate">{label}</span>
                    </motion.div>
                  </NavLink>
                )
              })}
            </nav>

            {/* 3. YOUR LIBRARY Container (Real Playlists Only) */}
            <div className={`bg-white/[0.04] border border-white/10 rounded-2xl shadow-inner backdrop-blur-xl w-full ${
              isCollapsed ? 'p-2 space-y-2 flex flex-col items-center' : 'p-3.5 space-y-2.5'
            }`}>
              {!isCollapsed && (
                <div className="flex items-center justify-between px-1 pb-1">
                  <h3 className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    YOUR LIBRARY
                  </h3>
                  <button
                    onClick={openCreatePlaylistModal}
                    className="text-purple-400 hover:text-purple-300 p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    title="Create Playlist"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className={`w-full max-h-[300px] overflow-y-auto pr-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-purple-500/20 [&::-webkit-scrollbar-thumb]:rounded-full ${
                isCollapsed ? 'flex flex-col items-center gap-2' : 'space-y-2'
              }`}>
                {/* Liked Songs Item */}
                <NavLink to="/favorites" className={isCollapsed ? 'block' : 'block w-full'} title="Liked Songs">
                  <motion.div
                    whileHover={{ scale: isCollapsed ? 1.1 : 1.02, x: isCollapsed ? 0 : 3, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    whileTap={{ scale: 0.94 }}
                    className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${
                      isCollapsed ? 'p-0 justify-center' : 'p-2'
                    } ${
                      isFavoritesActive && !isCollapsed
                        ? 'bg-purple-600/30 text-white border border-purple-500/50 shadow-md'
                        : 'text-zinc-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30 shrink-0 border border-white/20">
                      <Heart className="w-4 h-4 fill-white" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate text-sm">Liked Songs</div>
                        <div className="text-[11px] text-zinc-400 truncate font-medium">
                          {favorites && favorites.length > 0 ? `${favorites.length} songs` : '0 songs'}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </NavLink>

                {/* Real User Created Playlists */}
                {userPlaylists.map((pl, idx) => (
                  <NavLink key={pl.id} to={`/playlists/${pl.id}`} className={isCollapsed ? 'block' : 'block w-full'} title={pl.name}>
                    <motion.div
                      whileHover={{ scale: isCollapsed ? 1.1 : 1.02, x: isCollapsed ? 0 : 3, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                      whileTap={{ scale: 0.94 }}
                      className={`flex items-center gap-3 rounded-xl transition-all border border-transparent ${
                        isCollapsed ? 'p-0 justify-center' : 'p-2'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${pl.gradient || (idx % 2 === 0 ? 'from-purple-700 to-indigo-800' : 'from-indigo-700 to-pink-800')} flex items-center justify-center text-white shadow-sm shrink-0 border border-purple-400/30`}>
                        <ListMusic className="w-4 h-4 text-purple-200" />
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white truncate text-sm">{pl.name}</div>
                          <div className="text-[11px] text-zinc-400 truncate font-medium">
                            {pl.songs ? `${pl.songs.length} tracks` : 'Playlist'}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Interactive Now Playing Card (Displayed ONLY when a track is playing/selected) */}
          <AnimatePresence>
            {hasSelectedTrack && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 pt-3 relative z-10 border-t border-purple-500/30 mt-2 w-full flex justify-center pb-2"
              >
                {isCollapsed ? (
                  /* Collapsed Sleek Visualizer Square Tile */
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPopupOpen(true)}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-b from-purple-900/60 to-[#12092b] border border-purple-500/40 flex items-center justify-center shadow-lg cursor-pointer group hover:border-purple-400/80 transition-all mb-1"
                    title={`${songTitle} - ${authorName}`}
                  >
                    <div className="flex items-end gap-1 h-5">
                      <span className={`w-0.5 rounded-full bg-purple-400 ${isPlaying ? 'animate-bounce' : 'h-3'}`} style={{ animationDuration: '0.6s' }} />
                      <span className={`w-0.5 rounded-full bg-pink-400 ${isPlaying ? 'animate-bounce' : 'h-5'}`} style={{ animationDuration: '0.8s' }} />
                      <span className={`w-0.5 rounded-full bg-purple-300 ${isPlaying ? 'animate-bounce' : 'h-2'}`} style={{ animationDuration: '0.7s' }} />
                    </div>
                  </motion.div>
                ) : (
                  /* Compact Dialogue Card (Clicking opens full Glassmorphic Popup Modal) */
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-gradient-to-b from-purple-900/50 via-purple-950/85 to-[#12092b] border border-purple-500/50 rounded-2xl p-3.5 shadow-[0_0_35px_rgba(168,85,247,0.4)] relative overflow-hidden backdrop-blur-2xl group hover:border-purple-400/80 transition-all duration-300 w-full mb-1 cursor-pointer"
                  >
                    {/* Ambient Backlight Glow inside card */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

                    {/* Header Row: NOW PLAYING badge & expand prompt */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase text-purple-300/90 tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        NOW PLAYING
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300/80 group-hover:text-white transition-colors">
                        <span>Details</span>
                        <Maximize2 className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-all" />
                      </div>
                    </div>

                    {/* Glowing Soundwave Audio Waveform Visualizer or Track Cover */}
                    <div className="flex items-center justify-between gap-[3px] h-8 my-1 px-0.5">
                      {Array.from({ length: 24 }).map((_, i) => {
                        const norm = Math.sin((i / 23) * Math.PI)
                        const barHeight = Math.max(20, Math.round(norm * 90))
                        const delays = [0, 0.15, 0.3, 0.45, 0.6]

                        return (
                          <span
                            key={i}
                            className={`w-[3px] rounded-full bg-gradient-to-t from-purple-600 via-purple-400 to-pink-400 shadow-[0_0_8px_rgba(192,132,252,0.9)] ${
                              isPlaying ? 'animate-waveform' : ''
                            }`}
                            style={{
                              height: `${barHeight}%`,
                              animationDelay: `${delays[i % delays.length]}s`,
                              opacity: isPlaying ? 0.95 : 0.6,
                            }}
                          />
                        )
                      })}
                    </div>

                    {/* Basic Track Details (Title & Artist) */}
                    <div className="mt-2 space-y-0.5">
                      <h4 className="text-sm font-bold text-white tracking-tight truncate leading-snug">
                        {songTitle}
                      </h4>
                      <p className="text-xs text-purple-200/90 font-medium truncate flex items-center justify-between">
                        <span>{authorName}</span>
                        <span className="font-mono text-[10px] text-purple-300/70">{timeFormatted}</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.aside>

      {/* 5. Glassmorphic Popup Modal (Square-Proportioned, Rounded-36px, Spacious & Clean Alignment) */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setIsPopupOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="bg-[#0f0724]/95 border-2 border-purple-500/60 shadow-[0_0_80px_rgba(168,85,247,0.5)] backdrop-blur-3xl rounded-[36px] p-7 sm:p-9 max-w-[620px] w-full relative z-10 overflow-hidden text-white select-none space-y-5"
            >
              {/* Backlight glowing orb inside popup card */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/30 rounded-full blur-[130px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/30 rounded-full blur-[130px] pointer-events-none" />

              {/* Top Bar with Badge & Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-purple-500/30">
                <span className="text-xs font-black uppercase text-purple-300 tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  SONG & AUTHOR DETAILS
                </span>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-purple-600/40 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer shadow-md hover:scale-110 active:scale-95"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content: Current Track Artwork & Metadata */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Current Song Album Artwork Thumbnail */}
                <div className="relative shrink-0 group">
                  <img
                    src={coverArt}
                    alt={songTitle}
                    className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-[0_16px_40px_rgba(0,0,0,0.65)] border-2 border-purple-400/40 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-900/40 to-transparent pointer-events-none" />
                </div>

                {/* Track Info & Metadata Badges */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug break-words">
                      {songTitle}
                    </h3>
                    <p className="text-base font-bold text-purple-300 mt-1">
                      {authorName}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <div className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 px-3.5 py-1.5 rounded-xl text-xs text-purple-200 font-medium max-w-full break-words">
                      <Disc3 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="truncate">{albumName}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 px-3.5 py-1.5 rounded-xl text-xs text-purple-200 font-medium w-fit">
                      <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{releaseYear} ({genreName})</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-purple-300/90 pt-0.5">
                    Duration: <span className="text-white font-bold">{timeFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Animated Soundwave Audio Equalizer */}
              <div className="pt-2 border-t border-purple-500/30">
                <div className="flex items-center justify-between gap-[4px] h-10 px-1 my-1">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const norm = Math.sin((i / 31) * Math.PI)
                    const barHeight = Math.max(20, Math.round(norm * 95))
                    const delays = [0, 0.1, 0.2, 0.3, 0.4, 0.5]

                    return (
                      <span
                        key={i}
                        className={`w-[3px] rounded-full bg-gradient-to-t from-purple-600 via-purple-400 to-pink-400 shadow-[0_0_8px_rgba(192,132,252,0.9)] ${
                          isPlaying ? 'animate-waveform' : ''
                        }`}
                        style={{
                          height: `${barHeight}%`,
                          animationDelay: `${delays[i % delays.length]}s`,
                          opacity: isPlaying ? 0.95 : 0.6,
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* ABOUT THE SONG & AUTHOR Glass Box */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-2 shadow-inner">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-purple-400" /> ABOUT THE SONG & AUTHOR
                </h4>
                <p className="text-xs leading-relaxed text-zinc-200/95 font-normal">
                  {aboutText}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}



