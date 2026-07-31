import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import usePlayer from '../hooks/usePlayer'
import {
  User,
  Palette,
  Volume2,
  Bell,
  Shield,
  HardDrive,
  Info,
  ChevronRight,
  Moon,
  Headphones,
  Sparkles,
  SlidersHorizontal,
  Check,
  X,
  Trash2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Sun,
  Eye,
  EyeOff,
  Radio,
  Laptop,
  Terminal,
  Activity,
  Zap,
  LogOut,
} from 'lucide-react'

/* ============================================
   Page & Item Animation Variants
   ============================================ */
const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

/* Default State Generators */
const getSavedProfile = () => {
  const saved = localStorage.getItem('symphony_user_profile')
  return saved
    ? JSON.parse(saved)
    : {
        name: 'User',
        email: 'user@symphony.audio',
        bio: 'Music enthusiast & Symphony power user 🎵',
        avatarColor: 'from-purple-500 to-indigo-600',
      }
}

const getSavedNotifications = () => {
  const saved = localStorage.getItem('symphony_notifications')
  return saved
    ? JSON.parse(saved)
    : { desktop: true, recommendations: true, toasts: true, email: false }
}

const getSavedPrivacy = () => {
  const saved = localStorage.getItem('symphony_privacy')
  return saved ? JSON.parse(saved) : { incognito: false, saveHistory: true }
}

const getSavedVolumeNorm = () => {
  const saved = localStorage.getItem('symphony_volume_norm')
  return saved
    ? JSON.parse(saved)
    : { enabled: true, target: 'Normal (-14 LUFS)', eq: 'Flat' }
}

/**
 * SettingsPage - Symphony Design Language (SDL) Interactive Control Center.
 */
export default function SettingsPage() {
  const navigate = useNavigate()
  const { showToast, audioQuality: playerAudioQuality, setAudioQuality: setPlayerAudioQuality, logoutUser } = usePlayer()

  /* Interactive States */
  const [profile, setProfile] = useState(getSavedProfile)
  const [notifications, setNotifications] = useState(getSavedNotifications)
  const [privacy, setPrivacy] = useState(getSavedPrivacy)
  const [audioQuality, setAudioQuality] = useState(
    () => localStorage.getItem('symphony_audio_quality') || '👑 Symphony Spatial 3D Master (Binaural Soundstage)'
  )
  const [volumeNorm, setVolumeNorm] = useState(getSavedVolumeNorm)
  const [theme, setTheme] = useState(
    () => localStorage.getItem('symphony_theme') || 'Dark'
  )
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem('symphony_accent_color') || 'Purple'
  )

  /* Active Modal Handler */
  const [activeModal, setActiveModal] = useState(null)
  const closeModal = () => setActiveModal(null)

  /* Storage Cache Estimation State */
  const [cacheSize, setCacheSize] = useState('48.5 MB')

  /* Backend Health Status for About Modal */
  const [apiStatus, setApiStatus] = useState('Checking...')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then((res) => (res.ok ? setApiStatus('Online & Connected') : setApiStatus('Offline')))
      .catch(() => setApiStatus('PyTube Engine Standby'))
  }, [activeModal])

  /* Sync & Dispatch Handlers */
  const updateProfile = (newProfile) => {
    setProfile(newProfile)
    localStorage.setItem('symphony_user_profile', JSON.stringify(newProfile))
    window.dispatchEvent(new Event('symphony-profile-updated'))
    showToast('Profile updated successfully')
  }

  const updateNotifications = (newNotifs) => {
    setNotifications(newNotifs)
    localStorage.setItem('symphony_notifications', JSON.stringify(newNotifs))
    showToast('Notification settings saved')
  }

  const updatePrivacy = (newPrivacy) => {
    setPrivacy(newPrivacy)
    localStorage.setItem('symphony_privacy', JSON.stringify(newPrivacy))
    showToast(newPrivacy.incognito ? 'Incognito mode enabled' : 'Privacy settings updated')
  }

  const updateAudioQuality = (quality) => {
    setAudioQuality(quality)
    localStorage.setItem('symphony_audio_quality', quality)
    showToast(`Audio Quality set to ${quality}`)
  }

  const updateVolumeNorm = (newNorm) => {
    setVolumeNorm(newNorm)
    localStorage.setItem('symphony_volume_norm', JSON.stringify(newNorm))
    showToast(`Volume Normalization ${newNorm.enabled ? 'Enabled' : 'Disabled'}`)
  }

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('symphony_theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme.toLowerCase())
    window.dispatchEvent(new Event('symphony-theme-updated'))
    showToast(`Theme changed to ${newTheme}`)
  }

  const updateAccentColor = (color) => {
    setAccentColor(color)
    localStorage.setItem('symphony_accent_color', color)
    window.dispatchEvent(new Event('symphony-accent-updated'))
    showToast(`Accent Color set to ${color}`)
  }

  const handleClearCache = () => {
    setCacheSize('0.0 MB')
    showToast('Image & stream cache cleared')
  }

  const handleResetAppData = () => {
    if (window.confirm('Are you sure you want to reset all Symphony data? This will clear favorites and playlists.')) {
      localStorage.clear()
      setCacheSize('0.0 MB')
      window.location.reload()
    }
  }

  /* Data structure for settings sections */
  const sections = [
    {
      title: 'ACCOUNT',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          description: `View & edit profile, avatar, email (${profile.name})`,
          icon: User,
          badge: profile.name,
          onClick: () => navigate('/profile'),
        },
        {
          id: 'notifications',
          label: 'Notifications',
          description: 'Configure desktop alerts and playback toasts',
          icon: Bell,
          badge: Object.values(notifications).filter(Boolean).length + ' Enabled',
          onClick: () => setActiveModal('notifications'),
        },
        {
          id: 'privacy',
          label: 'Privacy & Security',
          description: 'Control data history and incognito listening mode',
          icon: Shield,
          badge: privacy.incognito ? 'Incognito ON' : 'Standard',
          onClick: () => setActiveModal('privacy'),
        },
        {
          id: 'logout',
          label: 'Log Out',
          description: 'Sign out of your active Symphony session',
          icon: LogOut,
          badge: 'Log Out',
          isDanger: true,
          onClick: () => {
            if (logoutUser) logoutUser()
            else showToast('Log out requested')
          },
        },
      ],
    },
    {
      title: 'PLAYBACK',
      items: [
        {
          id: 'quality',
          label: 'Audio Quality',
          description: 'Set streaming bitrates and download audio quality',
          icon: Headphones,
          badge: audioQuality,
          onClick: () => setActiveModal('quality'),
        },
        {
          id: 'volnorm',
          label: 'Volume Normalization',
          description: 'Equalize volume dynamics & set equalizer presets',
          icon: Volume2,
          badge: volumeNorm.enabled ? volumeNorm.target : 'Disabled',
          onClick: () => setActiveModal('volnorm'),
        },
      ],
    },
    {
      title: 'APPEARANCE',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          description: `${theme} mode is currently active`,
          icon: Moon,
          badge: theme,
          onClick: () => setActiveModal('theme'),
        },
        {
          id: 'accent',
          label: 'Accent Color',
          description: 'Customize the primary application glow & highlight color',
          icon: Palette,
          badge: accentColor,
          onClick: () => setActiveModal('accent'),
        },
      ],
    },
    {
      title: 'STORAGE & SYSTEM',
      items: [
        {
          id: 'cache',
          label: 'Cache & Downloads',
          description: `Manage cached media data (${cacheSize} stored)`,
          icon: HardDrive,
          badge: cacheSize,
          onClick: () => setActiveModal('cache'),
        },
        {
          id: 'about',
          label: 'About Symphony',
          description: 'Symphony v1.0.0 • Architecture & shortcuts',
          icon: Info,
          badge: 'v1.0.0',
          onClick: () => setActiveModal('about'),
        },
      ],
    },
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10 sm:space-y-12 pb-36 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative"
    >
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/12 rounded-full blur-[130px] pointer-events-none" />

      {/* Symphony Hero Header Card */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-8 sm:p-10 lg:p-12 backdrop-blur-2xl bg-gradient-to-br from-purple-950/75 via-[#0d091e]/85 to-[#070410]/95 border border-purple-500/25 flex flex-col sm:flex-row items-center sm:items-end gap-8 sm:gap-10 select-none shadow-2xl shadow-purple-950/60"
      >
        {/* Top Specular Purple Hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-90 rounded-t-3xl pointer-events-none" />

        {/* Hero Icon Box */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 rounded-[32px] blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-950 border border-purple-400/35 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            <SlidersHorizontal className="w-12 h-12 sm:w-16 sm:h-16 text-purple-100 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-200/90 mt-2">Control Center</span>
          </div>
        </div>

        {/* Header Info Column */}
        <div className="space-y-3.5 text-center sm:text-left flex-1 min-w-0 pb-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase tracking-widest w-fit mx-auto sm:mx-0 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Symphony Preferences</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 drop-shadow-sm leading-tight">
            Settings
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base font-semibold max-w-xl leading-relaxed">
            Manage your profile, audio streaming engine, theme preferences, and security control center.
          </p>

          {/* Quick Active Status Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-purple-400" />
              {audioQuality}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              {theme}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              {profile.name}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections Grid / Cards */}
      {sections.map(({ title, items }) => (
        <motion.section key={title} variants={itemVariants} className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-purple-300/80 font-black px-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400/80" />
            {title}
          </h2>

          <div className="glass-card backdrop-blur-2xl bg-gradient-to-br from-[#120a26]/90 via-[#0a0618]/90 to-[#06030e]/95 border border-purple-500/20 rounded-3xl overflow-hidden divide-y divide-purple-500/10 shadow-2xl shadow-purple-950/30">
            {items.map(({ id, label, description, icon: Icon, badge, isDanger, onClick }) => (
              <motion.button
                key={id}
                onClick={onClick}
                whileHover={{ backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.04)' }}
                whileTap={{ scale: 0.995 }}
                className={`flex items-center gap-4.5 w-full p-4 sm:p-5 text-left transition-all duration-200 group cursor-pointer ${
                  isDanger ? 'hover:bg-red-500/10' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 shrink-0 shadow-md ${
                    isDanger
                      ? 'bg-red-500/15 border border-red-500/30 text-red-400 group-hover:bg-red-600/30 group-hover:border-red-400/50 group-hover:text-red-200'
                      : 'bg-purple-500/10 border border-purple-500/20 text-purple-300 group-hover:text-purple-200 group-hover:bg-purple-600/25 group-hover:border-purple-400/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
                      isDanger ? 'text-red-300 group-hover:text-red-100' : 'text-white group-hover:text-purple-200'
                    }`}
                  >
                    {label}
                  </p>
                  <p className="text-xs text-zinc-400 truncate mt-0.5 font-medium">{description}</p>
                </div>

                {badge && (
                  <span
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border shadow-sm shrink-0 ${
                      isDanger
                        ? 'bg-red-500/15 text-red-300 border-red-500/30'
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {badge}
                  </span>
                )}

                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                    isDanger
                      ? 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500/30 text-red-300 group-hover:text-white'
                      : 'bg-white/[0.03] border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-400/40 text-zinc-400 group-hover:text-white'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Footer Branding */}
      <motion.div variants={itemVariants} className="text-center py-8 border-t border-purple-500/15">
        <p className="text-xs font-bold text-zinc-500 tracking-wider">
          Symphony • v1.0.0 • High-Performance Audio Suite
        </p>
      </motion.div>

      {/* =========================================================
          INTERACTIVE SETTINGS MODALS
         ========================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-lg bg-gradient-to-br from-[#160c33] via-[#0d0722] to-[#080415] border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(168,85,247,0.4)] overflow-hidden text-left"
            >
              {/* Top Specular Line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>



              {/* --- 2. NOTIFICATIONS MODAL --- */}
              {activeModal === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Notifications</h3>
                      <p className="text-xs text-zinc-400">Configure real-time alerts & toasts</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'desktop', title: 'Desktop Push Alerts', desc: 'Notify when new tracks start playing' },
                      { key: 'recommendations', title: 'Recommendation Drops', desc: 'Get updates on newly curated songs' },
                      { key: 'toasts', title: 'Playback Toast Banners', desc: 'Show floating queue & action toasts' },
                      { key: 'email', title: 'Weekly Listening Summaries', desc: 'Receive email statistics' },
                    ].map((item) => (
                      <div
                        key={item.key}
                        onClick={() => {
                          const updated = { ...notifications, [item.key]: !notifications[item.key] }
                          updateNotifications(updated)
                        }}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-black/30 border border-purple-500/20 hover:border-purple-500/40 cursor-pointer transition-all"
                      >
                        <div>
                          <p className="text-sm font-bold text-white">{item.title}</p>
                          <p className="text-xs text-zinc-400">{item.desc}</p>
                        </div>
                        <div
                          className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                            notifications[item.key] ? 'bg-purple-600 justify-end' : 'bg-zinc-800 justify-start'
                          }`}
                        >
                          <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* --- 3. PRIVACY MODAL --- */}
              {activeModal === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Privacy & Security</h3>
                      <p className="text-xs text-zinc-400">Manage listening history & session privacy</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div
                      onClick={() => updatePrivacy({ ...privacy, incognito: !privacy.incognito })}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        privacy.incognito
                          ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                          : 'bg-black/30 border-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {privacy.incognito ? <EyeOff className="w-5 h-5 text-purple-300" /> : <Eye className="w-5 h-5 text-zinc-400" />}
                        <div>
                          <p className="text-sm font-bold">Incognito Listening Mode</p>
                          <p className="text-xs text-zinc-400">Don't save played tracks to history</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-300">{privacy.incognito ? 'Active' : 'Off'}</span>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        onClick={() => showToast('Search history cleared')}
                        className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-purple-600/20 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>Clear Search History</span>
                        <Trash2 className="w-4 h-4 text-purple-300" />
                      </button>

                      <button
                        onClick={() => {
                          localStorage.removeItem('recentlyPlayed')
                          showToast('Listening history cleared')
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-purple-600/20 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>Clear Recently Played Tracks</span>
                        <Trash2 className="w-4 h-4 text-purple-300" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* --- 4. AUDIO QUALITY MODAL --- */}
              {activeModal === 'quality' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Audio Quality & Master DSP</h3>
                      <p className="text-xs text-zinc-400">Select Symphony Ultra High-Fidelity streaming sound profile</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        label: '👑 Symphony Spatial 3D Master (Binaural Soundstage)',
                        badge: '3D Spatial Soundstage',
                        desc: 'Binaural 3D audio expansion, immersive surround warmth & master DSP processing',
                        tech: '48kHz / 32-bit DSP • Symphony Spatial 3D Master Engine',
                        accent: 'border-purple-400/50 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-fuchsia-950/40',
                      },
                      {
                        label: '💎 Studio Lossless Master (24-bit / 192kHz Pure FLAC)',
                        badge: 'Studio Master Lossless',
                        desc: 'Bit-perfect uncompressed studio monitor fidelity & pure acoustic transparency',
                        tech: '192kHz / 24-bit FLAC/ALAC • Uncompressed Studio Reference Sound',
                        accent: 'border-cyan-400/50 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40',
                      },
                      {
                        label: '🔥 Ultra HD Dynamic Pulse (320kbps Master)',
                        badge: 'Ultra HD 320kbps',
                        desc: 'Punchy sub-bass boost, crystal clear acoustics & dynamic range mastering',
                        tech: '320kbps Opus / AAC • Sub-bass & Treble Enhancement',
                        accent: 'border-amber-400/50 bg-gradient-to-r from-amber-950/40 via-orange-950/40 to-red-950/40',
                      },
                      {
                        label: '🎵 High Fidelity Clarity (256kbps AAC / Opus)',
                        badge: 'High Fidelity',
                        desc: 'Full fidelity high-bitrate clear audio streaming',
                        tech: '256kbps AAC / Opus • Balanced Studio Response',
                        accent: 'border-emerald-400/50 bg-gradient-to-r from-emerald-950/40 to-teal-950/40',
                      },
                      {
                        label: '📉 Data Saver (96kbps Low)',
                        badge: 'Data Saver',
                        desc: 'Low bandwidth data-saving mode for slow networks',
                        tech: '96kbps Opus • Optimized for low data usage',
                        accent: 'border-zinc-500/40 bg-black/40',
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        onClick={() => updateAudioQuality(item.label)}
                        className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          audioQuality === item.label
                            ? `${item.accent} text-white shadow-xl shadow-purple-950/50 ring-1 ring-purple-400/40`
                            : 'bg-black/30 border-white/10 hover:border-purple-500/30 text-zinc-300'
                        }`}
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">{item.label}</p>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-purple-200 border border-white/10">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 font-medium">{item.desc}</p>
                          <p className="text-[11px] text-purple-300/80 font-mono pt-0.5">{item.tech}</p>
                        </div>
                        {audioQuality === item.label && <CheckCircle2 className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-extrabold text-white cursor-pointer shadow-lg shadow-purple-950/60"
                    >
                      Apply & Save Settings
                    </button>
                  </div>
                </div>
              )}

              {/* --- 5. VOLUME NORMALIZATION MODAL --- */}
              {activeModal === 'volnorm' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Volume Normalization</h3>
                      <p className="text-xs text-zinc-400">Equalize playback loudness & EQ presets</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div
                      onClick={() => updateVolumeNorm({ ...volumeNorm, enabled: !volumeNorm.enabled })}
                      className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-purple-500/20 cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">Enable Volume Normalization</p>
                        <p className="text-xs text-zinc-400">Keep volume consistent across all tracks</p>
                      </div>
                      <div
                        className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                          volumeNorm.enabled ? 'bg-purple-600 justify-end' : 'bg-zinc-800 justify-start'
                        }`}
                      >
                        <div className="w-4.5 h-4.5 rounded-full bg-white" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-2">
                        Target Loudness Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Quiet (-19 LUFS)', 'Normal (-14 LUFS)', 'Loud (-11 LUFS)'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateVolumeNorm({ ...volumeNorm, target: lvl })}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              volumeNorm.target === lvl
                                ? 'bg-purple-600/30 border-purple-400 text-white'
                                : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {lvl.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* --- 6. THEME MODAL --- */}
              {activeModal === 'theme' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Visual Theme</h3>
                      <p className="text-xs text-zinc-400">Select application aesthetic mode</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Dark', desc: 'Classic Symphony Purple-Dark', icon: Moon },
                      { name: 'Midnight', desc: 'Deep Violet & Cosmic Indigo', icon: Zap },
                      { name: 'AMOLED', desc: 'Pure Pitch Black', icon: EyeOff },
                      { name: 'Cyberpunk', desc: 'Neon Fuchsia & Cyan', icon: Sun },
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => updateTheme(item.name)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          theme === item.name
                            ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg'
                            : 'bg-black/30 border-white/10 hover:border-purple-500/30 text-zinc-400'
                        }`}
                      >
                        <item.icon className="w-5 h-5 text-purple-300 mb-2" />
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* --- 7. ACCENT COLOR MODAL --- */}
              {activeModal === 'accent' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Accent Color</h3>
                      <p className="text-xs text-zinc-400">Choose primary highlight color</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { name: 'Purple', color: 'bg-purple-500' },
                      { name: 'Emerald', color: 'bg-emerald-500' },
                      { name: 'Pink', color: 'bg-pink-500' },
                      { name: 'Cyan', color: 'bg-cyan-500' },
                      { name: 'Amber', color: 'bg-amber-500' },
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => updateAccentColor(item.name)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                          accentColor === item.name
                            ? 'bg-white/10 border-white text-white'
                            : 'bg-black/30 border-white/10 hover:border-white/30 text-zinc-400'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${item.color} shadow-md`} />
                        <span className="text-xs font-bold">{item.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* --- 8. CACHE MODAL --- */}
              {activeModal === 'cache' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Cache & Storage</h3>
                      <p className="text-xs text-zinc-400">Manage downloaded assets & data</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/30 border border-purple-500/20 space-y-1">
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Estimated Cache Size</p>
                    <p className="text-3xl font-black text-white">{cacheSize}</p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleClearCache}
                      className="w-full py-3 px-4 rounded-xl bg-purple-500/15 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold text-purple-200 flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span>Clear Temporary Media Cache</span>
                      <RefreshCw className="w-4 h-4 text-purple-300" />
                    </button>

                    <button
                      onClick={handleResetAppData}
                      className="w-full py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span>Reset All Symphony Application Data</span>
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* --- 9. ABOUT MODAL --- */}
              {activeModal === 'about' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">About Symphony</h3>
                      <p className="text-xs text-zinc-400">Futuristic Control Center & Audio Engine</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/20 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400 font-medium">Version:</span>
                        <span className="text-white font-bold">1.0.0 (Build 2026)</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400 font-medium">PyTube Backend:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5" />
                          {apiStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400 font-medium">Audio Engine:</span>
                        <span className="text-purple-300 font-bold">HTML5 WebAudio API</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                        Keyboard Shortcuts
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                        <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex justify-between">
                          <span className="text-zinc-400">Play / Pause</span>
                          <kbd className="px-1.5 bg-white/10 rounded text-purple-200">Space</kbd>
                        </div>
                        <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex justify-between">
                          <span className="text-zinc-400">Search</span>
                          <kbd className="px-1.5 bg-white/10 rounded text-purple-200">/</kbd>
                        </div>
                        <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex justify-between">
                          <span className="text-zinc-400">Next Track</span>
                          <kbd className="px-1.5 bg-white/10 rounded text-purple-200">N</kbd>
                        </div>
                        <div className="p-2 rounded-lg bg-black/30 border border-white/5 flex justify-between">
                          <span className="text-zinc-400">Previous Track</span>
                          <kbd className="px-1.5 bg-white/10 rounded text-purple-200">P</kbd>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
