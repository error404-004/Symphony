import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  Search,
  Library,
  Heart,
  Settings,
  Music2,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/library', label: 'Library', icon: Library },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/settings', label: 'Settings', icon: Settings },
]

/**
 * Sidebar - Left navigation panel with logo and nav links.
 */
export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden md:flex w-64 lg:w-72 flex-col border-r border-surface-800/50 bg-surface-950 py-6 px-4 shrink-0">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3 px-3 mb-10 group">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-lg shadow-primary-600/20 group-hover:shadow-primary-500/30 transition-shadow duration-300">
          <Music2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Symphony
        </span>
      </NavLink>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path

          return (
            <NavLink
              key={path}
              to={path}
              className="relative"
            >
              <motion.div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? 'text-white'
                    : 'text-surface-400 hover:text-surface-200'
                  }
                `}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-surface-800/60 border border-surface-700/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary-400' : ''}`} />
                <span className="relative z-10">{label}</span>

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 relative z-10"
                  />
                )}
              </motion.div>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom section - Now Playing mini indicator */}
      <div className="mt-auto pt-6 border-t border-surface-800/50">
        <div className="glass-light rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shrink-0">
              <Music2 className="w-4 h-4 text-white/80" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-200 truncate">Now Playing</p>
              <p className="text-[11px] text-surface-500 truncate">Nothing is playing</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
