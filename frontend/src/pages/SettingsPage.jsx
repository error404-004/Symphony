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
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

/**
 * SettingsPage - Application settings organized by category.
 */
export default function SettingsPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="max-w-3xl space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-[#B3B3B3] mt-1 text-sm">Manage your preferences and account</p>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map(({ title, items }) => (
        <motion.section key={title} variants={itemVariants}>
          <h2 className="text-xs uppercase tracking-widest text-[#B3B3B3]/50 font-semibold mb-3 px-1">
            {title}
          </h2>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
            {items.map(({ label, description, icon: Icon, badge }) => (
              <motion.button
                key={label}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 w-full p-4 text-left hover:bg-white/[0.04] transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] text-[#B3B3B3] group-hover:text-primary-400 group-hover:bg-primary-500/[0.08] transition-all duration-200 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-[#B3B3B3]/70 truncate">{description}</p>
                </div>
                {badge && (
                  <span className="px-2.5 py-1 rounded-lg bg-primary-500/[0.1] text-primary-400 text-xs font-medium border border-primary-500/[0.15]">
                    {badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[#B3B3B3]/30 group-hover:text-[#B3B3B3]/60 transition-colors shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Version Info */}
      <motion.div variants={itemVariants} className="text-center py-6">
        <p className="text-xs text-[#B3B3B3]/30">
          Symphony • v1.0.0 • Made with ♥
        </p>
      </motion.div>
    </motion.div>
  )
}
