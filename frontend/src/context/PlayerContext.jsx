import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPlayer } from "../services/player";
import { getAudio } from "../services/audio";

  export const PlayerContext = createContext();

  export function PlayerProvider({ children }) {
    const player = getPlayer();

    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    const [favorites, setFavorites] = useState(() => {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    });

    const [playlists, setPlaylists] = useState(() => {
      const saved = localStorage.getItem("playlists");
      return saved ? JSON.parse(saved) : [];
    });

    const [notRecommended, setNotRecommended] = useState(() => {
      const saved = localStorage.getItem("symphony_not_recommended");
      return saved ? JSON.parse(saved) : [];
    });

    const hideFromRecommendations = (song) => {
      if (!song || !song.videoId) return;
      setNotRecommended((prev) => {
        if (prev.includes(song.videoId)) return prev;
        const updated = [...prev, song.videoId];
        localStorage.setItem("symphony_not_recommended", JSON.stringify(updated));
        return updated;
      });
      window.dispatchEvent(new CustomEvent("symphony-not-recommended", { detail: song }));
    };

    const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

    const openCreatePlaylistModal = () => setIsCreatePlaylistOpen(true);
    const closeCreatePlaylistModal = () => setIsCreatePlaylistOpen(false);

    const [toast, setToast] = useState(null);

    const showToast = (message, song = null) => {
      setToast({ message, song, id: Date.now() });
    };

    useEffect(() => {
      if (!toast) return;
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }, [toast]);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // -----------------------------
    // Audio Events
    // -----------------------------
    useEffect(() => {
      function updateTime() {
        setCurrentTime(player.currentTime);
      }

      function loadedMetadata() {
        setDuration(player.duration || 0);
      }

      player.addEventListener("timeupdate", updateTime);
      player.addEventListener("loadedmetadata", loadedMetadata);

      return () => {
        player.removeEventListener("timeupdate", updateTime);
        player.removeEventListener("loadedmetadata", loadedMetadata);
      };
    }, [player]);

    // -----------------------------
    // Song End Logic
    // -----------------------------
    useEffect(() => {
      function handleSongEnd() {
        if (queue.length === 0) {
          setIsPlaying(false);
          return;
        }

        if (isRepeat && queue[currentIndex]) {
          playSong(queue[currentIndex]);
          return;
        }

        if (isShuffle) {
          const randomIndex = Math.floor(Math.random() * queue.length);
          setCurrentIndex(randomIndex);
          playSong(queue[randomIndex]);
          return;
        }

        if (currentIndex >= 0 && currentIndex < queue.length - 1) {
          const nextIndex = currentIndex + 1;
          const nextSong = queue[nextIndex];
          setCurrentIndex(nextIndex);
          playSong(nextSong);
        } else {
          // Reached end of queue: pause playback & set isPlaying to false
          setIsPlaying(false);
        }
      }

      player.addEventListener("ended", handleSongEnd);

      return () => {
        player.removeEventListener("ended", handleSongEnd);
      };
    }, [player, currentIndex, queue, isRepeat, isShuffle]);

    // -----------------------------
    // Local Storage
    // -----------------------------
    useEffect(() => {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
      localStorage.setItem("playlists", JSON.stringify(playlists));
    }, [playlists]);


  // Player Controls
  // -----------------------------

  async function playSong(song) {
    if (!song) return;

    setCurrentSong(song);

    try {
      const stream = await getAudio(song.videoId);

      if (stream && stream.audio_url) {
        player.src = stream.audio_url;
        await player.play();
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }

      // Update Recently Played (Single track chronological history)
      const recentHistory = JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
      const uniqueRecent = recentHistory.filter(
        (s) => s.videoId !== song.videoId
      );
      uniqueRecent.unshift(song);
      localStorage.setItem(
        "recentlyPlayed",
        JSON.stringify(uniqueRecent.slice(0, 12))
      );
    } catch (err) {
      console.error("Error playing song:", err);
      setIsPlaying(false);
    }
  }

  function pauseSong() {
    player.pause();
    setIsPlaying(false);
  }

  function resumeSong() {
    player.play();
    setIsPlaying(true);
  }

  function playNext() {
    if (queue.length === 0) return;

    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex =
        currentIndex < queue.length - 1 ? currentIndex + 1 : 0;
    }

    setCurrentIndex(nextIndex);
    playSong(queue[nextIndex]);
  }

  function playPrevious() {
    if (queue.length === 0) return;

    let prevIndex;

    if (currentIndex <= 0) {
      prevIndex = queue.length - 1;
    } else {
      prevIndex = currentIndex - 1;
    }

    setCurrentIndex(prevIndex);
    playSong(queue[prevIndex]);
  }
  function addToQueue(song) {
    if (!song) return;

    const exists = queue.some((item) => item.videoId === song.videoId);

    if (exists) {
      showToast(`Already in queue`, song);
      return;
    }

    setQueue((prev) => {
      if (currentIndex >= 0 && currentIndex < prev.length) {
        const updated = [...prev];
        updated.splice(currentIndex + 1, 0, song);
        return updated;
      }
      return [...prev, song];
    });

    showToast(`Added to queue`, song);
  }

  function removeFromQueue(songOrId) {
    if (!songOrId) return;
    const targetId = typeof songOrId === "object" ? songOrId.videoId : songOrId;
    const removedSong = typeof songOrId === "object" ? songOrId : queue.find((s) => s.videoId === targetId);

    setQueue((prev) => {
      const idx = prev.findIndex((item) => item.videoId === targetId);
      if (idx === -1) return prev;

      if (idx < currentIndex) {
        setCurrentIndex((c) => Math.max(0, c - 1));
      } else if (idx === currentIndex) {
        if (prev.length <= 1) {
          setCurrentIndex(-1);
        } else if (currentIndex >= prev.length - 1) {
          setCurrentIndex(prev.length - 2);
        }
      }

      return prev.filter((item) => item.videoId !== targetId);
    });

    showToast(`Removed from queue`, removedSong);
  }
    // -----------------------------
    // Favorites
    // -----------------------------
    function toggleFavorite(song) {
      const exists = favorites.some(
        (item) => item.videoId === song.videoId
      );

      if (exists) {
        setFavorites(
          favorites.filter(
            (item) => item.videoId !== song.videoId
          )
        );
      } else {
        setFavorites([...favorites, song]);
      }
    }

    // -----------------------------
    // Playlists
    // -----------------------------
    function createPlaylist(playlistData) {
      let name = "";
      let description = "";
      let gradient = "from-purple-600 to-indigo-600";

      if (typeof playlistData === "object" && playlistData !== null) {
        name = playlistData.name || "";
        description = playlistData.description || "";
        gradient = playlistData.gradient || gradient;
      } else if (typeof playlistData === "string") {
        name = playlistData;
      }

      if (!name.trim()) return null;

      const playlist = {
        id: `pl-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        gradient: gradient,
        songs: [],
        createdAt: new Date().toISOString(),
      };

      setPlaylists((prev) => [...prev, playlist]);
      return playlist;
    }
    function deletePlaylist(id) {
      setPlaylists((prev) =>
        prev.filter((playlist) => playlist.id !== id)
      );
    } 

    function addSongToPlaylist(playlistId, song) {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        const exists = playlist.songs.some(
          (s) => s.videoId === song.videoId
        );

        if (exists) return playlist;

        return {
          ...playlist,
          songs: [...playlist.songs, song],
        };
      })
    );
  }

    function removeSongFromPlaylist(playlistId, videoId) {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        return {
          ...playlist,
          songs: playlist.songs.filter(
            (song) => song.videoId !== videoId
          ),
        };
      })
    );
  }

    function updatePlaylistName(playlistId, newName) {
      if (!newName || !newName.trim()) return;
      setPlaylists((prev) =>
        prev.map((playlist) => {
          if (String(playlist.id) !== String(playlistId)) return playlist;
          return {
            ...playlist,
            name: newName.trim(),
          };
        })
      );
    }

    function updatePlaylistDetails(playlistId, { name, description }) {
      setPlaylists((prev) =>
        prev.map((playlist) => {
          if (String(playlist.id) !== String(playlistId)) return playlist;
          return {
            ...playlist,
            name: name !== undefined && name.trim() ? name.trim() : playlist.name,
            description: description !== undefined ? description.trim() : (playlist.description || ""),
          };
        })
      );
    }

    return (
      <PlayerContext.Provider
        value={{
          player,

          currentSong,
          setCurrentSong,

          isPlaying,
          playSong,
          pauseSong,
          resumeSong,

          currentTime,
          duration,

          queue,
          setQueue,
          customQueue: queue,
          setCustomQueue: setQueue,

          currentIndex,
          setCurrentIndex,

          playNext,
          playPrevious,
          addToQueue,
          removeFromQueue,

          toast,
          showToast,

          isShuffle,
          setIsShuffle,

          isRepeat,
          setIsRepeat,

          favorites,
          toggleFavorite,

          playlists,
          createPlaylist,
          addSongToPlaylist,

          deletePlaylist,
          removeSongFromPlaylist,
          updatePlaylistName,
          updatePlaylistDetails,

          isCreatePlaylistOpen,
          openCreatePlaylistModal,
          closeCreatePlaylistModal,

          notRecommended,
          hideFromRecommendations,
        }}
      >
        {children}

        {/* Global Symphony Toast Banner */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[#18181b]/95 border border-purple-500/40 text-white shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-none select-none max-w-xs sm:max-w-sm"
            >
              {toast.song?.thumbnail && (
                <img
                  src={toast.song.thumbnail}
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
                />
              )}
              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-purple-300 tracking-tight">
                  {toast.message}
                </span>
                {toast.song?.title && (
                  <span className="text-[11px] text-zinc-300 font-medium truncate mt-0.5">
                    {toast.song.title}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PlayerContext.Provider>
    );
  }

  export function usePlayer() {
    return useContext(PlayerContext);
  }