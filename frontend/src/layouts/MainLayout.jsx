import { Outlet, Navigate } from 'react-router-dom'
import usePlayer from '../hooks/usePlayer'
import Sidebar from '../components/Sidebar/Sidebar'
import TopNav from '../components/TopNav/TopNav'
import MusicPlayer from '../components/MusicPlayer/MusicPlayer'
import CreatePlaylistModal from '../components/ui/CreatePlaylistModal'
import MobileNav from '../components/ui/MobileNav'
import { Music2 } from 'lucide-react'

/**
 * MainLayout - Symphony Desktop & Mobile Application Shell.
 */
export default function MainLayout() {
  const { isAuthenticated } = usePlayer()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070412] text-white p-1 sm:p-2.5 gap-2 sm:gap-3 relative select-none">
      {/* Global Create Playlist Modal */}
      <CreatePlaylistModal />

      {/* Left Sidebar (Desktop View) */}
      <Sidebar />

      {/* Main Content Card Panel with Ambient Glow & Newest Symphony Logo Watermark */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#0c071e]/90 backdrop-blur-3xl rounded-xl sm:rounded-2xl border border-purple-500/20 relative shadow-2xl shadow-purple-950/80">
        
        {/* Ambient Deep Violet & Indigo Radial Glow Orbs */}
        <div className="absolute -top-32 -right-32 w-[650px] h-[650px] bg-purple-600/22 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="absolute top-1/4 -left-32 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="absolute -bottom-32 right-1/3 w-[500px] h-[500px] bg-fuchsia-600/12 rounded-full blur-[160px] pointer-events-none z-0" />

        {/* Official Newest Symphony Logo Ambient Watermark */}
        <div className="absolute top-0 right-4 pointer-events-none select-none z-0 opacity-[0.065] rotate-[-12deg] filter contrast-200 brightness-150 drop-shadow-[0_0_60px_rgba(168,85,247,0.35)]">
          <img src="/logo.png" alt="Symphony Logo Watermark" className="w-[450px] h-[450px] sm:w-[520px] sm:h-[520px] object-contain" />
        </div>

        {/* Top Navigation Bar */}
        <div className="relative z-10">
          <TopNav />
        </div>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 relative z-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div>
            <Outlet />
            {/* Master Spacer ensuring content ends cleanly above MusicPlayer & MobileNav */}
            <div className="h-44 sm:h-36 pointer-events-none" />
          </div>
        </main>

        {/* Floating Music Player fitted cleanly into Home/Main content alignment */}
        <MusicPlayer />

        {/* Mobile Bottom Navigation Bar (Visible on mobile < md) */}
        <MobileNav />
      </div>
    </div>
  )
}
