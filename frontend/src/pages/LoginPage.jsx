import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import usePlayer from '../hooks/usePlayer'
import {
  Music2,
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Zap,
  Globe,
  Radio,
} from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginUser, isAuthenticated } = usePlayer()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false)

  /* Form Fields */
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedVibe, setSelectedVibe] = useState('Hindi Melodies')

  const vibes = [
    'Hindi Melodies',
    'Punjabi Hits',
    'Lo-Fi Beats',
    'Synthwave 80s',
    'Pop Anthems',
    'Rock Classics',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const userName = name.trim() || (mode === 'signup' ? 'Symphony Listener' : 'Guest User')
    const userEmail = email.trim() || 'guest@symphony.audio'
    
    if (mode === 'signup' && selectedVibe) {
      localStorage.setItem('symphony_user_vibe', selectedVibe)
    }

    loginUser({
      name: userName,
      email: userEmail,
      password,
    })
    navigate('/')
  }

  const handleGuestDemo = () => {
    loginUser({
      name: 'Guest User',
      email: 'guest@symphony.audio',
      password: 'demo',
    })
    navigate('/')
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen w-full bg-[#080414] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background Ambient Radial Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/18 rounded-full blur-[170px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[550px] h-[550px] bg-indigo-600/18 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Glass Container — Spacious & Elegant */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-[440px] bg-[#120a2a]/90 backdrop-blur-3xl border border-purple-500/30 rounded-[32px] p-8 sm:p-11 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden text-left"
      >
        {/* Top Specular Purple Hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          {/* Logo Badge */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-950 border border-purple-400/40 flex items-center justify-center shadow-2xl relative text-white">
              <Music2 className="w-8 h-8 text-purple-100 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-[11px] font-extrabold uppercase tracking-widest w-fit mx-auto mb-2 shadow-sm">
              <Sparkles className="w-3 h-3 text-purple-300" />
              <span>Symphony Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-xs mx-auto pt-1 leading-relaxed">
              Experience Hi-Res Lossless & 3D Spatial Audio
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input (Sign Up Mode Only) */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-xs font-semibold text-zinc-200">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-4 h-4 text-purple-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{ paddingLeft: '48px' }}
                    className="w-full h-12 rounded-2xl bg-black/40 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 text-sm font-semibold text-white placeholder:text-zinc-500 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-200">
              Email address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-purple-400 pointer-events-none z-10" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{ paddingLeft: '48px' }}
                className="w-full h-12 rounded-2xl bg-black/40 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 text-sm font-semibold text-white placeholder:text-zinc-500 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-200">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-purple-400 pointer-events-none z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ paddingLeft: '48px' }}
                className="w-full h-12 pr-11 rounded-2xl bg-black/40 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 text-sm font-semibold text-white placeholder:text-zinc-500 focus:outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Preferred Vibe Chips (Sign Up Mode Only) */}
          {mode === 'signup' && (
            <div className="space-y-2.5 pt-1">
              <label className="block text-xs font-semibold text-zinc-200">
                Select Preferred Vibe
              </label>
              <div className="flex flex-wrap gap-2">
                {vibes.map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => setSelectedVibe(vibe)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      selectedVibe === vibe
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Submit Pill Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/70 cursor-pointer border border-purple-400/30 transition-all mt-4"
          >
            <span>{mode === 'signin' ? 'Sign In to Symphony' : 'Create Symphony Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Spacious Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs font-medium text-zinc-400">
            <span className="bg-[#120a2a] px-4">or</span>
          </div>
        </div>

        {/* Secondary Pill Button: Instant Guest Entry */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGuestDemo}
          className="w-full h-12 rounded-full bg-purple-500/15 hover:bg-purple-600/25 border border-purple-500/40 text-purple-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Instant Guest Entry (1-Click Demo)</span>
        </motion.button>

        {/* Spotify-Style Mode Switcher Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <p className="text-xs font-medium text-zinc-400">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-white font-bold underline hover:text-purple-300 ml-1.5 transition-colors cursor-pointer"
            >
              {mode === 'signin' ? 'Sign up for free' : 'Sign in here'}
            </button>
          </p>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 font-medium pt-5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>End-to-end encrypted session & Hi-Fi audio stream</span>
        </div>
      </motion.div>
    </div>
  )
}
