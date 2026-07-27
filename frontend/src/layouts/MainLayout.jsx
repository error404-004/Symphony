import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import TopNav from '../components/TopNav/TopNav'
import MusicPlayer from '../components/MusicPlayer/MusicPlayer'

/**
 * MainLayout - Spotify Desktop Application Shell.
 * Provides the dual-panel sidebar, top navigation, main container, and bottom music player.
 */
export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white p-2 gap-2 relative select-none">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Card Panel */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#121212] rounded-lg relative">
        {/* Top Navigation Bar */}
        <TopNav />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#2a2a2a] [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="pb-32 sm:pb-36">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Fixed Bottom Music Player */}
      <MusicPlayer />
    </div>
  )
}
