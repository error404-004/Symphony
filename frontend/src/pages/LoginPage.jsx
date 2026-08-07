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
    <div className="min-h-screen w-full bg-[#07040f] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background Ambient Radial Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-fuchsia-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-md backdrop-blur-3xl bg-gradient-to-b from-[#140b2e]/90 via-[#0e0722]/95 to-[#080414]/98 border-2 border-purple-500/35 rounded-3xl p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Top Specular Purple Hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/80 to-transparent pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 pb-2">
          {/* Logo Badge */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-950 border border-purple-400/40 flex items-center justify-center shadow-xl relative text-white">
              <Music2 className="w-8 h-8 text-purple-100 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-[11px] font-extrabold uppercase tracking-widest w-fit mx-auto mb-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Symphony Music Suite</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-zinc-400 font-medium max-w-xs mt-1">
              Experience Hi-Res Lossless & 3D Spatial Audio
            </p>
          </div>
        </div>

        {/* Sign In / Sign Up Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-purple-500/20 my-5">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/60'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input (Sign Up Mode Only) */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5"
              >
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300/80">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-purple-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/40 border border-purple-500/25 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30 text-xs font-bold text-white placeholder:text-zinc-500 focus:outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300/80">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-purple-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-black/40 border border-purple-500/25 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30 text-xs font-bold text-white placeholder:text-zinc-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300/80">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-purple-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-2xl bg-black/40 border border-purple-500/25 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/30 text-xs font-bold text-white placeholder:text-zinc-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Preferred Vibe Chips (Sign Up Mode Only) */}
          {mode === 'signup' && (
            <div className="space-y-2 pt-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-300/80">
                Select Preferred Vibe
              </label>
              <div className="flex flex-wrap gap-1.5">
                {vibes.map((vibe) => (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => setSelectedVibe(vibe)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedVibe === vibe
                        ? 'bg-purple-600/40 border-purple-400 text-white'
                        : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/70 cursor-pointer border border-purple-400/30 transition-all mt-2"
          >
            <span>{mode === 'signin' ? 'Sign In to Symphony' : 'Create Symphony Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-500/20" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-[#0e0722] px-3 text-zinc-400">or quick access</span>
          </div>
        </div>

        {/* Instant Guest Demo Entry Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGuestDemo}
          className="w-full py-3 px-4 rounded-2xl bg-white/[0.05] hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-400/60 text-purple-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span>Instant Guest Entry (1-Click Demo)</span>
        </motion.button>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 font-medium pt-5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>End-to-end encrypted session & Hi-Fi audio stream</span>
        </div>
      </motion.div>
    </div>
  )
}
