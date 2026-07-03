import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import TopNav from '../components/TopNav/TopNav'
import MusicPlayer from '../components/MusicPlayer/MusicPlayer'

/**
 * MainLayout - The application shell that wraps all pages.
 * Provides the sidebar, top navigation, main content area, and bottom music player.
 */
export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-950">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-4 pb-28">
          <Outlet />
        </main>
      </div>

      {/* Bottom Music Player - Fixed */}
      <MusicPlayer />
    </div>
  )
}
