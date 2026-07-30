import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import TopNav from '../components/TopNav/TopNav'
import MusicPlayer from '../components/MusicPlayer/MusicPlayer'
import CreatePlaylistModal from '../components/ui/CreatePlaylistModal'
import { Music2 } from 'lucide-react'

/**
 * MainLayout - Symphony Desktop Application Shell.
 * Provides the dual-panel sidebar, top navigation, main container with ambient purple glow & watermark, and bottom music player.
 */
export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08060f] text-white p-2.5 gap-3 relative select-none">
      {/* Global Create Playlist Modal */}
      <CreatePlaylistModal />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Card Panel with Ambient Glow & Watermark */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#0d0a18]/90 backdrop-blur-3xl rounded-2xl border border-white/[0.08] relative shadow-2xl shadow-black">
        
        {/* Ambient Purple Radial Glow Orbs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-purple-600/18 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-600/12 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute -bottom-32 right-1/3 w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Ultra-Subtle Watermark Logo */}
        <div className="absolute top-6 right-16 text-purple-400/[0.025] pointer-events-none select-none z-0 rotate-[-15deg] drop-shadow-[0_0_35px_rgba(168,85,247,0.15)]">
          <Music2 className="w-[420px] h-[420px]" />
        </div>

        {/* Top Navigation Bar */}
        <div className="relative z-10">
          <TopNav />
        </div>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-4 relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div>
            <Outlet />
            {/* Master Spacer ensuring content ends cleanly above MusicPlayer */}
            <div className="h-32 sm:h-36 pointer-events-none" />
          </div>
        </main>

        {/* Floating Music Player fitted cleanly into Home/Main content alignment */}
        <MusicPlayer />
      </div>
    </div>
  )
}
