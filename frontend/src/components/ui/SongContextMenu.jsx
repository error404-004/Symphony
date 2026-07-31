import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ListPlus,
  ListMinus,
  Heart,
  Plus,
  User,
  Share2,
  ChevronRight,
  Check,
  EyeOff,
} from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";

/**
 * SongContextMenu - Spotify-style triple-dot (...) context menu.
 * Renders via React Portal to prevent clipping by parent overflow bounds.
 *
 * @param {Object} props
 * @param {Object} props.song - Song data object
 * @param {boolean} [props.isInQueue] - Optional explicit queue status override
 * @param {string} [props.buttonClassName] - Custom classes for the triple dot button
 * @param {string} [props.iconClassName] - Custom classes for the MoreHorizontal icon
 */
export default function SongContextMenu({
  song,
  isInQueue: propIsInQueue,
  buttonClassName = "p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer",
  iconClassName = "w-4.5 h-4.5",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylistsSubmenu, setShowPlaylistsSubmenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const {
    queue,
    addToQueue,
    removeFromQueue,
    favorites,
    toggleFavorite,
    playlists,
    addSongToPlaylist,
    openCreatePlaylistModal,
    showToast,
    hideFromRecommendations,
  } = usePlayer();

  if (!song) return null;

  const isFavorite = favorites.some((item) => item.videoId === song.videoId);
  const isInQueue =
    propIsInQueue !== undefined
      ? propIsInQueue
      : queue.some((item) => item.videoId === song.videoId);

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Position calculations (prefer displaying below button, flip up if near bottom)
      const menuWidth = 220;
      const menuHeight = 260;

      let left = rect.right - menuWidth;
      if (left < 10) left = rect.left;
      if (left + menuWidth > windowWidth - 10) left = windowWidth - menuWidth - 10;

      let top = rect.bottom + 6;
      if (top + menuHeight > windowHeight - 10) {
        top = rect.top - menuHeight - 6;
      }

      setMenuPosition({ top, left });
      setShowPlaylistsSubmenu(false);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on outside click or scroll or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(song);
    setIsOpen(false);
  };

  const handleRemoveFromQueue = (e) => {
    e.stopPropagation();
    if (removeFromQueue) removeFromQueue(song);
    setIsOpen(false);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(song);
    if (showToast) {
      showToast(
        isFavorite ? "Removed from Liked Songs" : "Saved to Liked Songs",
        song
      );
    }
    setIsOpen(false);
  };

  const handleGoToArtist = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    if (song.artist || song.author) {
      navigate(`/artist/${encodeURIComponent(song.artist || song.author)}`);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    const shareText = `${song.title} - ${song.artist || "Artist"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      if (showToast) showToast("Copied track info to clipboard", song);
    }
  };

  const handleAddPlaylist = (e, playlistId) => {
    e.stopPropagation();
    addSongToPlaylist(playlistId, song);
    if (showToast) showToast("Added to playlist", song);
    setIsOpen(false);
  };

  const handleNotRecommend = (e) => {
    e.stopPropagation();
    if (hideFromRecommendations) {
      hideFromRecommendations(song);
    } else {
      const hidden = JSON.parse(localStorage.getItem("symphony_not_recommended")) || [];
      if (song.videoId && !hidden.includes(song.videoId)) {
        hidden.push(song.videoId);
        localStorage.setItem("symphony_not_recommended", JSON.stringify(hidden));
      }
      window.dispatchEvent(new CustomEvent("symphony-not-recommended", { detail: song }));
    }
    if (showToast) {
      showToast("We won't recommend this song anymore", song);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={buttonClassName}
        title={`More options for ${song.title}`}
        aria-label={`More options for ${song.title}`}
      >
        <MoreHorizontal className={iconClassName} />
      </button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
              className="fixed z-[9999] w-56 rounded-2xl bg-[#18181b]/95 backdrop-blur-2xl border border-white/12 p-1.5 shadow-2xl shadow-black/80 font-sans text-xs text-zinc-200 select-none overflow-visible"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Menu Header / Song Title Preview */}
              <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center gap-2.5">
                {song.thumbnail && (
                  <img
                    src={song.thumbnail}
                    alt=""
                    className="w-7 h-7 rounded-lg object-cover shrink-0 border border-white/10"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white truncate text-[11px]">
                    {song.title}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {song.artist || "Unknown Artist"}
                  </p>
                </div>
              </div>

              {/* Add to Queue / Remove from Queue */}
              {isInQueue ? (
                <button
                  onClick={handleRemoveFromQueue}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-red-600/20 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <ListMinus className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-xs">Remove from queue</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleAddToQueue}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-600/20 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <ListPlus className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-xs">Add to queue</span>
                  </div>
                </button>
              )}

              {/* Save / Remove from Liked Songs */}
              <button
                onClick={handleToggleFavorite}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-600/20 hover:text-white transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Heart
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isFavorite
                        ? "text-pink-500 fill-pink-500"
                        : "text-zinc-400 group-hover:text-pink-400"
                    }`}
                  />
                  <span className="font-medium text-xs">
                    {isFavorite ? "Remove from Liked Songs" : "Save to Liked Songs"}
                  </span>
                </div>
                {isFavorite && <Check className="w-3.5 h-3.5 text-pink-400" />}
              </button>

              {/* Add to Playlist (Submenu Toggle) */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPlaylistsSubmenu(!showPlaylistsSubmenu);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-600/20 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-4 h-4 text-zinc-400 group-hover:text-purple-300 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-xs">Add to playlist</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                      showPlaylistsSubmenu ? "rotate-90 text-purple-400" : ""
                    }`}
                  />
                </button>

                {/* Submenu of playlists */}
                {showPlaylistsSubmenu && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-1 ml-3 pl-2 border-l border-purple-500/30 space-y-0.5 max-h-36 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10"
                  >
                    {playlists.length === 0 ? (
                      <p className="px-2 py-1 text-[11px] text-zinc-500 italic">
                        No playlists created
                      </p>
                    ) : (
                      playlists.map((pl) => (
                        <button
                          key={pl.id}
                          onClick={(e) => handleAddPlaylist(e, pl.id)}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-zinc-300 hover:text-purple-300 hover:bg-white/10 truncate font-medium transition-colors cursor-pointer"
                        >
                          {pl.name}
                        </button>
                      ))
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        openCreatePlaylistModal();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] text-purple-400 hover:bg-purple-500/20 font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New Playlist
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="my-1 border-t border-white/10" />

              {/* Go to Artist */}
              {(song.artist || song.author) && (
                <button
                  onClick={handleGoToArtist}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-600/20 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-zinc-400 group-hover:text-purple-300 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-xs">Go to artist</span>
                  </div>
                </button>
              )}

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-600/20 hover:text-white transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4 text-zinc-400 group-hover:text-purple-300 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-xs">Share track</span>
                </div>
              </button>

              {/* Don't recommend */}
              <button
                onClick={handleNotRecommend}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-red-600/20 hover:text-white transition-colors cursor-pointer group text-left mt-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <EyeOff className="w-4 h-4 text-zinc-400 group-hover:text-red-400 group-hover:scale-110 transition-all" />
                  <span className="font-medium text-xs">Don't recommend</span>
                </div>
              </button>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
