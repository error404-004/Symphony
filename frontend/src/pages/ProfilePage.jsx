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
        avatarColor: 'from-purple-500 to-indigo-600',
        genre: 'Electronic & Lo-Fi',
      }
}

/**
 * ProfilePage - Dedicated User Profile & Account Center for Symphony.
 */
export default function ProfilePage() {
  const navigate = useNavigate()
  const { favorites, playlists, playSong, setQueue, setCurrentIndex, currentSong, isPlaying, showToast, openCreatePlaylistModal } = usePlayer()

  const [profile, setProfile] = useState(getSavedProfile)
  const [isEditing, setIsEditing] = useState(false)

  /* Draft state for edit form */
  const [draft, setDraft] = useState(profile)

  useEffect(() => {
    setDraft(profile)
  }, [profile])

  const handleSaveProfile = () => {
    setProfile(draft)
    localStorage.setItem('symphony_user_profile', JSON.stringify(draft))
    window.dispatchEvent(new Event('symphony-profile-updated'))
    setIsEditing(false)
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

  const avatarGradients = [
    { id: 'purple', class: 'from-purple-500 via-indigo-600 to-purple-800', label: 'Cosmic Purple' },
    { id: 'emerald', class: 'from-emerald-400 via-teal-600 to-cyan-800', label: 'Emerald Neon' },
    { id: 'rose', class: 'from-pink-500 via-rose-600 to-red-800', label: 'Rose Sunset' },
    { id: 'cyan', class: 'from-cyan-400 via-blue-600 to-indigo-800', label: 'Oceanic Blue' },
    { id: 'amber', class: 'from-amber-400 via-orange-600 to-red-800', label: 'Solar Amber' },
  ]

  const recentlyPlayed = (JSON.parse(localStorage.getItem('recentlyPlayed')) || []).slice(0, 5)

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10 sm:space-y-12 pb-36 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative"
    >
      {/* Ambient Background Radial Glows */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-600/12 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Profile Header (Spotify / Apple Music / Amazon Music Style) */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-8 sm:p-10 lg:p-12 backdrop-blur-2xl bg-gradient-to-br from-purple-950/75 via-[#0d091e]/85 to-[#070410]/95 border border-purple-500/25 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-10 select-none shadow-2xl shadow-purple-950/60"
      >
        {/* Top Specular Purple Hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-90 rounded-t-3xl pointer-events-none" />

        {/* Avatar Display */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 rounded-[40px] blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
          <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br ${profile.avatarColor} border-2 border-white/20 flex items-center justify-center shadow-2xl relative overflow-hidden text-white font-black text-5xl sm:text-6xl uppercase tracking-tighter`}>
            {profile.name ? profile.name.charAt(0) : 'U'}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200 cursor-pointer text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm"
              title="Edit Profile Avatar"
            >
              <Edit3 className="w-6 h-6 text-purple-300" />
              <span>Edit</span>
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
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isEditing
                  ? 'bg-purple-600 text-white border border-purple-400 shadow-purple-950/50'
                  : 'bg-white/10 hover:bg-purple-600/30 border border-white/15 text-white'
              }`}
            >
              <Edit3 className="w-4 h-4 text-purple-300" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
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

      {/* User Stats Overview Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <Link
          to="/favorites"
          className="glass-card backdrop-blur-2xl bg-gradient-to-br from-purple-950/40 via-[#0d091e]/60 to-[#070410]/80 border border-purple-500/20 hover:border-purple-500/40 rounded-3xl p-6 flex items-center justify-between transition-all duration-300 group cursor-pointer shadow-xl"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Liked Songs</span>
            <p className="text-3xl font-black text-white group-hover:text-purple-200 transition-colors">
              {favorites.length}
            </p>
            <p className="text-xs text-zinc-400 font-medium">Curated tracks in library</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
            <Heart className="w-7 h-7 fill-purple-500/30" />
          </div>
        </Link>

        <Link
          to="/library"
          className="glass-card backdrop-blur-2xl bg-gradient-to-br from-purple-950/40 via-[#0d091e]/60 to-[#070410]/80 border border-purple-500/20 hover:border-purple-500/40 rounded-3xl p-6 flex items-center justify-between transition-all duration-300 group cursor-pointer shadow-xl"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Playlists</span>
            <p className="text-3xl font-black text-white group-hover:text-purple-200 transition-colors">
              {playlists.length}
            </p>
            <p className="text-xs text-zinc-400 font-medium">Custom created collections</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
            <ListMusic className="w-7 h-7" />
          </div>
        </Link>

        <div className="glass-card backdrop-blur-2xl bg-gradient-to-br from-purple-950/40 via-[#0d091e]/60 to-[#070410]/80 border border-purple-500/20 rounded-3xl p-6 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Recently Played</span>
            <p className="text-3xl font-black text-white">{recentlyPlayed.length}</p>
            <p className="text-xs text-zinc-400 font-medium">Tracks in active history</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Disc className="w-7 h-7" />
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Form (Expandable) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="glass-card backdrop-blur-2xl bg-gradient-to-br from-[#150a30]/90 via-[#0d0620]/95 to-[#080315]/95 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Account Details & Preferences</h3>
                    <p className="text-xs text-zinc-400">Update your public profile and music information</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  Close Form
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1.5">
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
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    Avatar Theme Preset
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {avatarGradients.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setDraft({ ...draft, avatarColor: item.class })}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          draft.avatarColor === item.class
                            ? 'bg-purple-900/40 border-purple-400 text-white shadow-lg'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${item.class} border border-white/20`} />
                        <span>{item.label}</span>
                        {draft.avatarColor === item.class && <Check className="w-4 h-4 text-purple-300" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-extrabold text-white shadow-lg shadow-purple-950/60 hover:scale-105 transition-all cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Playlists Section */}
      <motion.section variants={itemVariants} className="space-y-4">
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
            className="px-4 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            + Create Playlist
          </button>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-white/10 glass-card bg-white/[0.02]">
            <ListMusic className="w-10 h-10 text-purple-400/60 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">No playlists created yet</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
              Start building your music collection by creating your first custom playlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigate(`/playlists/${pl.id}`)}
                className="glass-card backdrop-blur-xl bg-white/[0.03] hover:bg-purple-900/20 border border-white/10 hover:border-purple-500/35 rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 group cursor-pointer shadow-lg"
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
      </motion.section>

      {/* Liked Songs Preview Section */}
      {favorites.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-purple-400 fill-purple-400/30" />
                Favorite Tracks
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                Quick preview of top liked tracks
              </p>
            </div>
            <Link
              to="/favorites"
              className="text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors"
            >
              See All ({favorites.length}) →
            </Link>
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
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-900/40 border-purple-500/40 text-purple-200 shadow-lg'
                      : 'border-transparent hover:bg-purple-900/20 hover:border-purple-500/25 text-white'
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
                    className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-md border border-white/10"
                  />

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className={`text-sm font-bold truncate ${isCurrent ? 'text-purple-200' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
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
        </motion.section>
      )}
    </motion.div>
  )
}
