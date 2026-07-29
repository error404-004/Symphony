import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Music2, Globe, Palette, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePlayer from '../../hooks/usePlayer';

const THEME_PRESETS = [
  { id: 'purple', name: 'Midnight Purple', gradient: 'from-purple-600 via-purple-700 to-indigo-800' },
  { id: 'indigo', name: 'Cosmic Indigo', gradient: 'from-indigo-600 via-blue-700 to-purple-900' },
  { id: 'rose', name: 'Sunset Magenta', gradient: 'from-rose-600 via-purple-700 to-indigo-900' },
  { id: 'emerald', name: 'Cyber Emerald', gradient: 'from-emerald-600 via-teal-700 to-purple-900' },
];

export default function CreatePlaylistModal() {
  const { isCreatePlaylistOpen, closeCreatePlaylistModal, createPlaylist } = usePlayer();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0]);
  const [error, setError] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCreatePlaylistOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreatePlaylistOpen]);

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    setSelectedTheme(THEME_PRESETS[0]);
    closeCreatePlaylistModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a playlist title');
      return;
    }

    const newPlaylist = createPlaylist({
      name: name.trim(),
      description: description.trim(),
      gradient: selectedTheme.gradient,
    });

    handleClose();

    if (newPlaylist && newPlaylist.id) {
      navigate(`/playlists/${newPlaylist.id}`);
    }
  };

  if (!isCreatePlaylistOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Deep Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xl transition-opacity"
        />

        {/* Square-Shaped Glassmorphic Popup Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative w-full max-w-[500px] sm:max-w-[540px] min-h-[540px] sm:min-h-[580px] bg-gradient-to-br from-[#130b2e]/95 via-[#0b061a]/95 to-[#05030e]/95 backdrop-blur-3xl border-2 border-purple-500/40 shadow-[0_30px_100px_rgba(168,85,247,0.5)] rounded-[36px] p-7 sm:p-8 z-10 flex flex-col justify-between overflow-hidden my-auto text-left"
        >
          {/* Top Specular Purple Hairline */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90 rounded-t-[36px] pointer-events-none" />

          {/* Ambient Glow Orbs */}
          <div className="absolute -top-28 -right-28 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-indigo-600/25 rounded-full blur-[100px] pointer-events-none" />

          {/* Watermark Icon Background */}
          <Music2 className="absolute -bottom-8 -right-8 w-48 h-48 text-purple-400/[0.03] pointer-events-none z-0 rotate-[-12deg]" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer z-20 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Header Section */}
          <div className="space-y-2 mb-6 relative z-10 pr-8">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[11px] font-black uppercase tracking-widest w-fit shadow-md">
              <Sparkles className="w-3 h-3 text-purple-300" />
              <span>Symphony Studio</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300">
              Create New Playlist
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
              Curate your custom soundscape and track vault for your library
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Playlist Title Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-purple-300/80 uppercase tracking-wider">
                  Playlist Title <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Late Night Vibes, Summer Highway..."
                  className={`w-full h-12 px-4 rounded-xl bg-black/40 border-2 ${
                    error
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-purple-500/35 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25'
                  } text-sm font-bold text-white placeholder:text-zinc-500 focus:outline-none backdrop-blur-md transition-all shadow-inner`}
                />
                {error && (
                  <p className="text-xs text-rose-400 font-bold mt-1 flex items-center gap-1">
                    ⚠️ {error}
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[11px] font-extrabold text-purple-300/80 uppercase tracking-wider">
                    Description <span className="text-zinc-500 font-normal lowercase">(optional)</span>
                  </label>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md">
                    <Globe className="w-3 h-3 text-purple-400" /> Public Playlist
                  </span>
                </div>
                <textarea
                  value={description}
                  rows={2}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give your playlist a mood, description or story..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border-2 border-purple-500/35 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none backdrop-blur-md transition-all resize-none shadow-inner leading-relaxed"
                />
              </div>

              {/* Theme Preset Selector */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-extrabold text-purple-300/80 uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cover Theme Palette</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {THEME_PRESETS.map((theme) => {
                    const isSelected = selectedTheme.id === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-purple-900/40 border-purple-400 shadow-md shadow-purple-950/60 text-white'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-xs font-bold truncate">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-white/10 relative z-10 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              type="submit"
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-600/40 hover:shadow-purple-500/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 border border-white/20"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              <span>Create Playlist</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
