import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import usePlayer from '../hooks/usePlayer'
import {
  User,
  Mail,
  Sparkles,
  Heart,
  ListMusic,
  Edit3,
  Share2,
  Settings,
  Check,
  Music2,
  Play,
  Volume2,
  Clock,
  Radio,
  ShieldCheck,
  Disc,
  Plus,
  Shuffle,
  Search,
} from 'lucide-react'
import SongContextMenu from '../components/ui/SongContextMenu'

/* ============================================
   Page & Section Animation Variants
   ============================================ */
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

const getSavedProfile = () => {
  const saved = localStorage.getItem('symphony_user_profile')
  return saved
    ? JSON.parse(saved)
    : {
        name: 'User',
        email: 'user@symphony.audio',
        bio: 'Music enthusiast & Symphony power user 🎵',
        avatarColor: 'from-purple-500 via-indigo-600 to-purple-800',
        genre: 'Electronic & Lo-Fi',
      }
}

/**
 * ProfilePage - Dedicated User Profile & Account Center with Full Glass Panels.
 */
export default function ProfilePage() {
  const navigate = useNavigate()
  const {
    favorites,
    playlists,
    playSong,
    setQueue,
    setCurrentIndex,
    currentSong,
    isPlaying,
    showToast,
    openCreatePlaylistModal,
    isShuffle,
    setIsShuffle,
  } = usePlayer()

  const [profile, setProfile] = useState(getSavedProfile)
  const [activeTab, setActiveTab] = useState('overview')
  const [draft, setDraft] = useState(profile)
  const [playlistSearch, setPlaylistSearch] = useState('')

  useEffect(() => {
    setDraft(profile)
  }, [profile])

  const handleSaveProfile = () => {
    setProfile(draft)
    localStorage.setItem('symphony_user_profile', JSON.stringify(draft))
    window.dispatchEvent(new Event('symphony-profile-updated'))
    showToast('Profile updated successfully')
  }

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      showToast('Profile link copied to clipboard')
    } else {
      showToast('Profile shared successfully')
    }
  }

  const handlePlayAllFavorites = () => {
    if (favorites.length > 0) {
      setQueue(favorites)
      setCurrentIndex(0)
      playSong(favorites[0])
    }
  }

  const avatarGradients = [
    { id: 'purple', class: 'from-purple-500 via-indigo-600 to-purple-800', label: 'Cosmic Purple' },
    { id: 'emerald', class: 'from-emerald-400 via-teal-600 to-cyan-800', label: 'Emerald Neon' },
    { id: 'rose', class: 'from-pink-500 via-rose-600 to-red-800', label: 'Rose Sunset' },
    { id: 'cyan', class: 'from-cyan-400 via-blue-600 to-indigo-800', label: 'Oceanic Blue' },
    { id: 'amber', class: 'from-amber-400 via-orange-600 to-red-800', label: 'Solar Amber' },
  ]

  const recentlyPlayed = (JSON.parse(localStorage.getItem('recentlyPlayed')) || [])

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 sm:space-y-10 pb-36 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative"
    >
      {/* Ambient Background Radial Glows */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/12 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Profile Header Panel (Full Glass Panel) */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-8 sm:p-10 lg:p-12 backdrop-blur-3xl bg-gradient-to-br from-purple-950/75 via-[#0d091e]/85 to-[#070410]/95 border-2 border-purple-500/30 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-10 select-none shadow-[0_25px_85px_rgba(0,0,0,0.7)]"
      >
        {/* Top Specular Purple Hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90 rounded-t-3xl pointer-events-none" />

        {/* Avatar Display */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 rounded-[40px] blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br ${profile.avatarColor} border-2 border-white/30 flex items-center justify-center shadow-2xl relative overflow-hidden text-white font-black text-5xl sm:text-6xl uppercase tracking-tighter`}>
            {profile.name ? profile.name.charAt(0) : 'U'}
            <button
              onClick={() => setActiveTab('settings')}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200 cursor-pointer text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm"
              title="Edit Profile Avatar"
            >
              <Edit3 className="w-6 h-6 text-purple-300" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Info Column */}
        <div className="space-y-3.5 text-center md:text-left flex-1 min-w-0 pb-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Symphony Member
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Account
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 drop-shadow-sm leading-tight">
            {profile.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-zinc-400 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-purple-200">
              <Mail className="w-4 h-4 text-purple-400" />
              {profile.email}
            </span>
            <span className="hidden sm:inline text-purple-400/40">•</span>
            <span className="text-zinc-400 font-medium">@{profile.name.toLowerCase().replace(/\s+/g, '')}</span>
            {profile.genre && (
              <>
                <span className="hidden sm:inline text-purple-400/40">•</span>
                <span className="text-purple-300 font-medium">{profile.genre}</span>
              </>
            )}
          </div>

          <p className="text-zinc-300 text-sm font-medium italic max-w-xl">
            "{profile.bio}"
          </p>

          {/* Action Bar Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(activeTab === 'settings' ? 'overview' : 'settings')}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-950/60 border border-white/20"
            >
              <Edit3 className="w-4 h-4 text-purple-200" />
              <span>{activeTab === 'settings' ? 'View Overview' : 'Edit Profile'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleShareProfile}
              className="px-5 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-purple-300" />
              <span>Share</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/settings')}
              className="px-5 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-purple-300" />
              <span>Settings</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Interactive Glass Navigation Tabs Bar */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 p-1.5 rounded-2xl glass-card backdrop-blur-2xl bg-black/40 border border-purple-500/25 overflow-x-auto [&::-webkit-scrollbar]:none select-none">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'playlists', label: `Playlists (${playlists.length})`, icon: ListMusic },
          { id: 'favorites', label: `Liked Songs (${favorites.length})`, icon: Heart },
          { id: 'history', label: `Recently Played (${recentlyPlayed.length})`, icon: Disc },
          { id: 'settings', label: 'Account Details', icon: Edit3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/60 border border-purple-400/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <tab.icon className="w-4 h-4 text-purple-300" />
            <span>{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {/* =========================================================
            TAB 1: OVERVIEW (Full Glass Panel Modules)
           ========================================================= */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Top Stats Overview Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <div
                onClick={() => setActiveTab('favorites')}
                className="glass-card backdrop-blur-3xl bg-gradient-to-br from-purple-950/60 via-[#0e0722]/80 to-[#070312]/90 border-2 border-purple-500/30 hover:border-purple-400/50 rounded-3xl p-6 flex items-center justify-between transition-all duration-300 group cursor-pointer shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-80" />
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest text-purple-300">Liked Songs</span>
                  <p className="text-4xl font-black text-white group-hover:text-purple-200 transition-colors">
                    {favorites.length}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">Curated tracks in library</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="w-7 h-7 fill-purple-400/40" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('playlists')}
                className="glass-card backdrop-blur-3xl bg-gradient-to-br from-purple-950/60 via-[#0e0722]/80 to-[#070312]/90 border-2 border-purple-500/30 hover:border-purple-400/50 rounded-3xl p-6 flex items-center justify-between transition-all duration-300 group cursor-pointer shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-80" />
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest text-purple-300">Playlists</span>
                  <p className="text-4xl font-black text-white group-hover:text-purple-200 transition-colors">
                    {playlists.length}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">Custom created collections</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shadow-lg">
                  <ListMusic className="w-7 h-7" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('history')}
                className="glass-card backdrop-blur-3xl bg-gradient-to-br from-purple-950/60 via-[#0e0722]/80 to-[#070312]/90 border-2 border-purple-500/30 hover:border-purple-400/50 rounded-3xl p-6 flex items-center justify-between transition-all duration-300 group cursor-pointer shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-80" />
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest text-purple-300">Recently Played</span>
                  <p className="text-4xl font-black text-white group-hover:text-purple-200 transition-colors">
                    {recentlyPlayed.length}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">Tracks in active history</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shadow-lg">
                  <Disc className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Public Playlists Full Glass Panel Container */}
            <div className="glass-card backdrop-blur-3xl bg-gradient-to-br from-[#140b2e]/90 via-[#0c061c]/90 to-[#06030f]/95 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_85px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90" />

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <ListMusic className="w-5 h-5 text-purple-400" />
                    Public Playlists
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                    Playlists created by {profile.name}
                  </p>
                </div>
                <button
                  onClick={openCreatePlaylistModal}
                  className="px-4 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-extrabold transition-all cursor-pointer shadow-sm"
                >
                  + Create Playlist
                </button>
              </div>

              {playlists.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border border-white/10 bg-black/20">
                  <ListMusic className="w-10 h-10 text-purple-400/60 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">No playlists created yet</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Start building your music collection by creating custom playlists.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map((pl) => (
                    <div
                      key={pl.id}
                      onClick={() => navigate(`/playlists/${pl.id}`)}
                      className="glass-card backdrop-blur-xl bg-black/30 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-400/40 rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 group cursor-pointer shadow-md"
                    >
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pl.gradient || 'from-purple-600 to-indigo-800'} border border-white/20 flex items-center justify-center shrink-0 shadow-md text-white`}>
                        <Music2 className="w-8 h-8 text-purple-100" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-bold text-white group-hover:text-purple-200 truncate tracking-tight">
                          {pl.name}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {pl.songs?.length || 0} {pl.songs?.length === 1 ? 'track' : 'tracks'}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 group-hover:bg-purple-600 border border-purple-400/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                        <Play className="w-4 h-4 fill-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Tracks Full Glass Panel Container */}
            {favorites.length > 0 && (
              <div className="glass-card backdrop-blur-3xl bg-gradient-to-br from-[#140b2e]/90 via-[#0c061c]/90 to-[#06030f]/95 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_85px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90" />

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                      <Heart className="w-5 h-5 text-purple-400 fill-purple-400/30" />
                      Favorite Tracks Preview
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                      Top liked tracks in your personal vault
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className="text-xs font-extrabold text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    View All ({favorites.length}) →
                  </button>
                </div>

                <div className="space-y-2">
                  {favorites.slice(0, 5).map((song, i) => {
                    const isCurrent = currentSong?.videoId === song.videoId

                    return (
                      <div
                        key={song.videoId || i}
                        onClick={() => {
                          setQueue(favorites)
                          setCurrentIndex(i)
                          playSong(song)
                        }}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                          isCurrent
                            ? 'bg-purple-900/40 border-purple-500/50 text-purple-200 shadow-lg'
                            : 'bg-black/20 border-white/5 hover:bg-purple-900/20 hover:border-purple-500/25 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center w-6 text-xs font-bold text-zinc-400">
                          {isCurrent && isPlaying ? (
                            <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                          ) : (
                            <span className="group-hover:hidden">{i + 1}</span>
                          )}
                          {!isPlaying && <Play className="w-3.5 h-3.5 text-white fill-white hidden group-hover:block" fill="white" />}
                        </div>

                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
                        />

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className={`text-sm font-bold truncate ${isCurrent ? 'text-purple-200' : 'text-white'}`}>
                            {song.title}
                          </p>
                          <p className="text-xs text-zinc-400 truncate font-medium">{song.artist}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400 font-semibold tabular-nums">
                            {song.duration || '--:--'}
                          </span>
                          <SongContextMenu song={song} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* =========================================================
            TAB 2: PLAYLISTS (Full Glass Panel Module)
           ========================================================= */}
        {activeTab === 'playlists' && (
          <motion.div
            key="playlists"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card backdrop-blur-3xl bg-gradient-to-br from-[#140b2e]/90 via-[#0c061c]/90 to-[#06030f]/95 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 sm:p-10 shadow-[0_25px_85px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <ListMusic className="w-6 h-6 text-purple-400" />
                  Your Playlists Collection
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                  Manage and listen to all custom created playlists ({playlists.length})
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={playlistSearch}
                    onChange={(e) => setPlaylistSearch(e.target.value)}
                    placeholder="Search playlists..."
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-black/40 border border-purple-500/30 text-xs font-semibold text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <button
                  onClick={openCreatePlaylistModal}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-purple-950/60 shrink-0"
                >
                  + Create Playlist
                </button>
              </div>
            </div>

            {playlists.filter((p) => p.name.toLowerCase().includes(playlistSearch.toLowerCase())).length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-white/10 bg-black/20">
                <ListMusic className="w-12 h-12 text-purple-400/60 mx-auto mb-3" />
                <p className="text-base font-bold text-white">No playlists found</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  {playlistSearch ? 'Try a different search term.' : 'Create your first custom playlist to build your music collection.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {playlists
                  .filter((p) => p.name.toLowerCase().includes(playlistSearch.toLowerCase()))
                  .map((pl) => (
                    <div
                      key={pl.id}
                      onClick={() => navigate(`/playlists/${pl.id}`)}
                      className="glass-card backdrop-blur-xl bg-black/30 hover:bg-purple-900/30 border border-purple-500/20 hover:border-purple-400/50 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 group cursor-pointer shadow-xl relative overflow-hidden"
                    >
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${pl.gradient || 'from-purple-600 to-indigo-800'} border border-white/20 flex items-center justify-center shrink-0 shadow-lg text-white group-hover:scale-105 transition-transform`}>
                        <Music2 className="w-10 h-10 text-purple-100" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-base font-black text-white group-hover:text-purple-200 truncate tracking-tight">
                          {pl.name}
                        </p>
                        <p className="text-xs text-zinc-400 truncate font-semibold">
                          {pl.songs?.length || 0} {pl.songs?.length === 1 ? 'track' : 'tracks'}
                        </p>
                      </div>
                      <div className="w-11 h-11 rounded-full bg-purple-500/20 group-hover:bg-purple-600 border border-purple-400/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </motion.div>
        )}

        {/* =========================================================
            TAB 3: LIKED SONGS (Full Glass Panel Module)
           ========================================================= */}
        {activeTab === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card backdrop-blur-3xl bg-gradient-to-br from-[#140b2e]/90 via-[#0c061c]/90 to-[#06030f]/95 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 sm:p-10 shadow-[0_25px_85px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <Heart className="w-6 h-6 text-purple-400 fill-purple-400" fill="currentColor" />
                  Liked Songs Collection
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                  Your saved track vault ({favorites.length} tracks)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayAllFavorites}
                  disabled={favorites.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-950/60 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-white" fill="white" />
                  <span>Play Collection</span>
                </button>
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isShuffle ? 'bg-purple-600/30 border-purple-400 text-purple-200' : 'bg-black/30 border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4 text-purple-300" />
                </button>
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-white/10 bg-black/20">
                <Heart className="w-12 h-12 text-purple-400/60 mx-auto mb-3" />
                <p className="text-base font-bold text-white">Your vault is empty</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Save your favorite tracks by clicking the heart icon on any song.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {favorites.map((song, i) => {
                  const isCurrent = currentSong?.videoId === song.videoId

                  return (
                    <div
                      key={song.videoId || i}
                      onClick={() => {
                        setQueue(favorites)
                        setCurrentIndex(i)
                        playSong(song)
                      }}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-900/40 border-purple-500/50 text-purple-200 shadow-lg'
                          : 'bg-black/20 border-white/5 hover:bg-purple-900/20 hover:border-purple-500/25 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-center w-6 text-xs font-bold text-zinc-400">
                        {isCurrent && isPlaying ? (
                          <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                        ) : (
                          <span className="group-hover:hidden">{i + 1}</span>
                        )}
                        {!isPlaying && <Play className="w-3.5 h-3.5 text-white fill-white hidden group-hover:block" fill="white" />}
                      </div>

                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
                      />

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className={`text-sm font-bold truncate ${isCurrent ? 'text-purple-200' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate font-medium">{song.artist}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 font-semibold tabular-nums">
                          {song.duration || '--:--'}
                        </span>
                        <SongContextMenu song={song} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* =========================================================
            TAB 4: RECENTLY PLAYED (Full Glass Panel Module)
           ========================================================= */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card backdrop-blur-3xl bg-gradient-to-br from-[#140b2e]/90 via-[#0c061c]/90 to-[#06030f]/95 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 sm:p-10 shadow-[0_25px_85px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <Disc className="w-6 h-6 text-purple-400" />
                  Recently Played History
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                  Tracks listened to in your current sessions ({recentlyPlayed.length})
                </p>
              </div>
            </div>

            {recentlyPlayed.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-white/10 bg-black/20">
                <Disc className="w-12 h-12 text-purple-400/60 mx-auto mb-3" />
                <p className="text-base font-bold text-white">No listening history yet</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Start listening to songs and your recent history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentlyPlayed.map((song, i) => {
                  const isCurrent = currentSong?.videoId === song.videoId

                  return (
                    <div
                      key={song.videoId || i}
                      onClick={() => {
                        setQueue(recentlyPlayed)
                        setCurrentIndex(i)
                        playSong(song)
                      }}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-900/40 border-purple-500/50 text-purple-200 shadow-lg'
                          : 'bg-black/20 border-white/5 hover:bg-purple-900/20 hover:border-purple-500/25 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-center w-6 text-xs font-bold text-zinc-400">
                        {isCurrent && isPlaying ? (
                          <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                        ) : (
                          <span className="group-hover:hidden">{i + 1}</span>
                        )}
                        {!isPlaying && <Play className="w-3.5 h-3.5 text-white fill-white hidden group-hover:block" fill="white" />}
                      </div>

                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
                      />

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className={`text-sm font-bold truncate ${isCurrent ? 'text-purple-200' : 'text-white'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate font-medium">{song.artist}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 font-semibold tabular-nums">
                          {song.duration || '--:--'}
                        </span>
                        <SongContextMenu song={song} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* =========================================================
            TAB 5: ACCOUNT DETAILS (Full Glass Panel Module)
           ========================================================= */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-card backdrop-blur-3xl bg-gradient-to-br from-[#140b2e]/90 via-[#0c061c]/90 to-[#06030f]/95 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 sm:p-10 shadow-[0_25px_85px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Account Details & Preferences</h3>
                  <p className="text-xs text-zinc-400">Update your public profile and music information</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-purple-500/30 text-sm font-semibold text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-purple-500/30 text-sm font-semibold text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block mb-2">
                  Preferred Music Genre
                </label>
                <input
                  type="text"
                  value={draft.genre || ''}
                  onChange={(e) => setDraft({ ...draft, genre: e.target.value })}
                  placeholder="e.g. Synthwave, Pop, Classical"
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-purple-500/30 text-sm font-semibold text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block mb-2">
                  Bio / Status Quote
                </label>
                <input
                  type="text"
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-black/40 border border-purple-500/30 text-sm font-semibold text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block mb-3">
                  Avatar Theme Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {avatarGradients.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDraft({ ...draft, avatarColor: item.class })}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        draft.avatarColor === item.class
                          ? 'bg-purple-900/40 border-purple-400 text-white shadow-lg'
                          : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.class} border border-white/20 shadow-sm`} />
                      <span>{item.label}</span>
                      {draft.avatarColor === item.class && <Check className="w-4 h-4 text-purple-300" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setDraft(profile)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-extrabold text-white shadow-lg shadow-purple-950/60 hover:scale-105 transition-all cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
