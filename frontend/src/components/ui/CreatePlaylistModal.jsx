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

        {/* Glassmorphic Popup Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative w-full max-w-[620px] bg-[#120b29] backdrop-blur-3xl border border-purple-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.85)] rounded-3xl p-6 sm:p-8 z-10 flex flex-col justify-between overflow-hidden my-auto text-left"
        >
          {/* Top Specular Purple Hairline */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent opacity-90 rounded-t-3xl pointer-events-none" />

          {/* Ambient Glow Orbs */}
          <div className="absolute -top-28 -right-28 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Header Section */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-sm">
                <Music2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Create Playlist
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  Curate your custom soundscape & track vault
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content — Split Layout (Artwork Preview + Inputs) */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              {/* Left Column: Cover Artwork Preview */}
              <div className="sm:col-span-4 flex flex-col items-center space-y-3">
                <div className={`w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br ${selectedTheme.gradient} border border-white/20 shadow-2xl flex flex-col items-center justify-center text-white relative group overflow-hidden`}>
                  <Music2 className="w-12 h-12 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-2">
                    {selectedTheme.name}
                  </span>
                </div>

                {/* Theme Palette Swatches */}
                <div className="flex items-center gap-2 pt-1">
                  {THEME_PRESETS.map((theme) => {
                    const isSelected = selectedTheme.id === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme)}
                        title={theme.name}
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${theme.gradient} border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-white scale-110 shadow-md ring-2 ring-purple-500/50' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Title & Description Inputs */}
              <div className="sm:col-span-8 space-y-4">
                {/* Playlist Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200">
                    Playlist title <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="My Playlist #1"
                    className={`w-full h-11 px-4 rounded-xl bg-black/40 border ${
                      error
                        ? 'border-rose-500 focus:ring-rose-500/30'
                        : 'border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25'
                    } text-sm font-semibold text-white placeholder:text-zinc-500 focus:outline-none transition-all shadow-inner`}
                  />
                  {error && (
                    <p className="text-xs text-rose-400 font-bold mt-1">
                      ⚠️ {error}
                    </p>
                  )}
                </div>

                {/* Description Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200">
                    Description <span className="text-zinc-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    rows={3}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add an optional description or mood..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar (Cancel & Create Pill Button) */}
            <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-6">
              <span className="text-[11px] font-medium text-zinc-400 hidden sm:inline-block">
                Visible to everyone on your profile
              </span>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-950/60 cursor-pointer flex items-center gap-2 border border-purple-400/30 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Playlist</span>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
