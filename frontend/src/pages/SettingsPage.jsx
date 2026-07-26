import { motion } from 'framer-motion'
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
} from 'lucide-react'

const settingsSections = [
  {
    title: 'Account',
    items: [
      { label: 'Profile', description: 'Manage your profile information', icon: User },
      { label: 'Notifications', description: 'Configure notification preferences', icon: Bell },
      { label: 'Privacy & Security', description: 'Control your data and security', icon: Shield },
    ],
  },
  {
    title: 'Playback',
    items: [
      { label: 'Audio Quality', description: 'Set streaming and download quality', icon: Headphones, badge: 'High' },
      { label: 'Volume Normalization', description: 'Equalize volume across tracks', icon: Volume2 },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { label: 'Theme', description: 'Dark mode is currently active', icon: Moon, badge: 'Dark' },
      { label: 'Accent Color', description: 'Customize the primary accent color', icon: Palette, badge: 'Purple' },
    ],
  },
  {
    title: 'Storage',
    items: [
      { label: 'Cache', description: 'Manage cached data and downloads', icon: HardDrive },
      { label: 'About', description: 'Symphony v1.0.0', icon: Info },
    ],
  },
]

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

/**
 * SettingsPage - Application control center organized into Symphony Design Language (SDL) glass modules.
 */
export default function SettingsPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="max-w-4xl space-y-10 pb-36 relative"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div variants={itemVariants} className="relative">
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
          Settings
        </h1>
        <p className="text-zinc-400 mt-2 text-sm font-medium">
          Manage your Symphony preferences and control center
        </p>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map(({ title, items }) => (
        <motion.section key={title} variants={itemVariants} className="relative">
          <h2 className="text-xs uppercase tracking-widest text-purple-400/80 font-bold mb-3 px-1">
            {title}
          </h2>
          <div className="glass-card backdrop-blur-xl bg-surface-950/80 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-xl shadow-purple-950/20">
            {items.map(({ label, description, icon: Icon, badge }) => (
              <motion.button
                key={label}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="flex items-center gap-4 w-full p-4 sm:p-5 text-left hover:bg-white/[0.04] transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-400 group-hover:text-purple-300 group-hover:bg-purple-600/20 group-hover:border-purple-500/30 transition-all duration-300 shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{description}</p>
                </div>
                {badge && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-semibold border border-purple-500/30 shadow-sm">
                    {badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-300 transition-colors shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Version Info */}
      <motion.div variants={itemVariants} className="text-center py-8">
        <p className="text-xs font-medium text-zinc-500/70 tracking-wide">
          Symphony • v1.0.0 • Futuristic Control Center
        </p>
      </motion.div>
    </motion.div>
  )
}
