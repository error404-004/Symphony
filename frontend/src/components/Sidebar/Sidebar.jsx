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
    <aside className="hidden md:flex w-[280px] lg:w-[300px] flex-col m-2 mb-[104px] rounded-2xl glass-card py-6 px-3 shrink-0 relative z-10">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3 px-3 mb-8 group">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300">
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
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'text-white'
                    : 'text-[#B3B3B3] hover:text-white hover:bg-white/[0.04]'
                  }
                `}
                whileHover={{ x: isActive ? 0 : 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.08] shadow-lg shadow-primary-500/[0.05]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Active left accent bar */}
                {isActive && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary-500 shadow-md shadow-primary-500/50"
                  />
                )}

                <Icon className={`w-[18px] h-[18px] relative z-10 transition-colors duration-200 ${isActive ? 'text-primary-400' : ''}`} />
                <span className="relative z-10">{label}</span>

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 relative z-10 shadow-sm shadow-primary-400/50"
                  />
                )}
              </motion.div>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom section - Now Playing mini indicator */}
      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <div className="glass rounded-xl p-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/20">
              <Music2 className="w-4 h-4 text-white/80" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">Now Playing</p>
              <p className="text-[11px] text-[#B3B3B3] truncate">Nothing is playing</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
