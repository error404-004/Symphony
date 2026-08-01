import { createContext, useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPlayer } from "../services/player";
import { getAudio } from "../services/audio";
import { searchMusic } from "../services/api";

  export const PlayerContext = createContext();

  export function PlayerProvider({ children }) {
    const player = getPlayer();

    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [iframeSrc, setIframeSrc] = useState("");
    const [isIframeActive, setIsIframeActive] = useState(false);

    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
      const token = localStorage.getItem("symphony_auth_token");
      return token !== "logged_out";
    });

    const loginUser = (userData) => {
      const token = "symphony_session_" + Date.now();
      localStorage.setItem("symphony_auth_token", token);
      const userProfile = {
        name: userData?.name || "Zade",
        email: userData?.email || "zade@symphony.audio",
        avatarColor: "from-purple-500 via-indigo-600 to-purple-800",
        bio: "Audio Enthusiast & Music Curator • Symphony Hi-Fi Premier",
        genre: "Synthwave / Lo-Fi",
      };
      localStorage.setItem("symphony_user_profile", JSON.stringify(userProfile));
      window.dispatchEvent(new Event("symphony-profile-updated"));
      setIsAuthenticated(true);
      showToast("Welcome back to Symphony, " + userProfile.name);
    };

    const logoutUser = () => {
      localStorage.setItem("symphony_auth_token", "logged_out");
      setIsAuthenticated(false);
      showToast("Logged out of Symphony");
    };

    const [audioQuality, setAudioQuality] = useState(() => {
      return localStorage.getItem("symphony_audio_quality") || "👑 Symphony Spatial 3D Master (Binaural Soundstage)";
    });

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

    // -------------------------------------------------------------
    // WebAudio Master DSP Sound Engine (Apple & Amazon Master Audio)
    // -------------------------------------------------------------
    const audioCtxRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const compressorRef = useRef(null);
    const pannerRef = useRef(null);
    const gainNodeRef = useRef(null);
    const eqBassRef = useRef(null);
    const eqTrebleRef = useRef(null);
    const iframeTimerRef = useRef(null);

    useEffect(() => {
      const initAudioDSP = () => {
        if (audioCtxRef.current || !player) return;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          const source = ctx.createMediaElementSource(player);
          sourceNodeRef.current = source;

          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.value = -12;
          compressor.knee.value = 30;
          compressor.ratio.value = 8;
          compressor.attack.value = 0.003;
          compressor.release.value = 0.25;
          compressorRef.current = compressor;

          const bassFilter = ctx.createBiquadFilter();
          bassFilter.type = "lowshelf";
          bassFilter.frequency.value = 120;
          bassFilter.gain.value = 4.5;
          eqBassRef.current = bassFilter;

          const trebleFilter = ctx.createBiquadFilter();
          trebleFilter.type = "highshelf";
          trebleFilter.frequency.value = 8000;
          trebleFilter.gain.value = 3.5;
          eqTrebleRef.current = trebleFilter;

          const panner = ctx.createStereoPanner();
          panner.pan.value = 0.15;
          pannerRef.current = panner;

          // GainNode for volume control (player.volume has no effect after createMediaElementSource)
          const gainNode = ctx.createGain();
          gainNode.gain.value = 0.75; // default 75%
          gainNodeRef.current = gainNode;

          source.connect(bassFilter);
          bassFilter.connect(trebleFilter);
          trebleFilter.connect(compressor);
          compressor.connect(panner);
          panner.connect(gainNode);
          gainNode.connect(ctx.destination);
        } catch (e) {
          console.warn("WebAudio DSP Initialization fallback:", e);
          if (sourceNodeRef.current && audioCtxRef.current) {
            try {
              sourceNodeRef.current.connect(audioCtxRef.current.destination);
            } catch (e) {
              /* ignore fallback error */
            }
          }
        }
      };

      const handleFirstPlay = () => {
        initAudioDSP();
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      };

      player.addEventListener('play', handleFirstPlay);
      return () => {
        player.removeEventListener('play', handleFirstPlay);
      };
    }, [player]);

    // Update DSP parameters whenever audioQuality is changed
    useEffect(() => {
      localStorage.setItem("symphony_audio_quality", audioQuality);
      if (!audioCtxRef.current) return;
      const q = (audioQuality || '').toLowerCase();

      if (q.includes('spatial') || q.includes('dolby') || q.includes('3d')) {
        if (eqBassRef.current) eqBassRef.current.gain.value = 4.5;
        if (eqTrebleRef.current) eqTrebleRef.current.gain.value = 3.5;
        if (pannerRef.current) pannerRef.current.pan.value = 0.15;
      } else if (q.includes('lossless') || q.includes('alac') || q.includes('flac') || q.includes('192khz')) {
        if (eqBassRef.current) eqBassRef.current.gain.value = 1.0;
        if (eqTrebleRef.current) eqTrebleRef.current.gain.value = 1.0;
        if (pannerRef.current) pannerRef.current.pan.value = 0;
      } else if (q.includes('ultra hd') || q.includes('amazon') || q.includes('320')) {
        if (eqBassRef.current) eqBassRef.current.gain.value = 6.0;
        if (eqTrebleRef.current) eqTrebleRef.current.gain.value = 2.5;
        if (pannerRef.current) pannerRef.current.pan.value = 0;
      } else {
        if (eqBassRef.current) eqBassRef.current.gain.value = 0;
        if (eqTrebleRef.current) eqTrebleRef.current.gain.value = 0;
        if (pannerRef.current) pannerRef.current.pan.value = 0;
      }
    }, [audioQuality]);

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

    // Audio Events
    useEffect(() => {
      function updateTime() {
        if (!isIframeActive) {
          setCurrentTime(player.currentTime);
        }
      }

      function loadedMetadata() {
        if (!isIframeActive) {
          setDuration(player.duration || 0);
        }
      }

      player.addEventListener("timeupdate", updateTime);
      player.addEventListener("loadedmetadata", loadedMetadata);

      return () => {
        player.removeEventListener("timeupdate", updateTime);
        player.removeEventListener("loadedmetadata", loadedMetadata);
      };
    }, [player, isIframeActive]);

    // Parse "3:51" or "1:03:22" style duration strings into seconds
    function parseSongDuration(durationStr) {
      if (!durationStr) return 0;
      const parts = String(durationStr).split(":").map(Number);
      if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
      if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
      return 0;
    }

    function getGenreForSong(song) {
      if (!song) return "Top Hits";
      if (song.genre) return song.genre;

      const text = `${song.title || ""} ${song.artist || ""} ${song.author || ""} ${song.album || ""}`.toLowerCase();

      if (text.includes("pop") || text.includes("starboy") || text.includes("weeknd") || text.includes("taylor")) return "Pop Hits";
      if (text.includes("hip hop") || text.includes("rap") || text.includes("drake") || text.includes("travis") || text.includes("kanye")) return "Hip-Hop";
      if (text.includes("lofi") || text.includes("chill") || text.includes("relax") || text.includes("beats")) return "Lo-Fi Beats";
      if (text.includes("rock") || text.includes("metal") || text.includes("queen") || text.includes("nirvana")) return "Rock";
      if (text.includes("edm") || text.includes("dance") || text.includes("dj") || text.includes("house")) return "EDM & Dance";
      if (text.includes("indie") || text.includes("alt") || text.includes("arctic")) return "Indie Alternative";
      if (text.includes("classical") || text.includes("piano") || text.includes("mozart")) return "Classical & Piano";
      return "Top Hits";
    }

    async function autoFetchNextGenreTracks(currentSong) {
      if (!currentSong) return null;
      try {
        const genre = getGenreForSong(currentSong);
        const searchQuery = `${genre} popular songs`;
        const searchResults = await searchMusic(searchQuery);

        if (searchResults && searchResults.length > 0) {
          const notRec = JSON.parse(localStorage.getItem("symphony_not_recommended")) || [];
          const currentQueueIds = queue.map((s) => s.videoId);
          const filtered = searchResults.filter(
            (s) => s.videoId !== currentSong.videoId && !currentQueueIds.includes(s.videoId) && !notRec.includes(s.videoId)
          );

          const pool = filtered.length > 0 ? filtered : searchResults;
          const randomIndex = Math.floor(Math.random() * pool.length);
          const candidate = pool[randomIndex];

          setQueue((prevQueue) => [...prevQueue, candidate]);
          return candidate;
        }
      } catch (err) {
        console.warn("Autoplay fetch failed:", err);
      }
      return null;
    }

    useEffect(() => {
      async function handleSongEnd() {
        if (isRepeat && queue[currentIndex]) {
          playSong(queue[currentIndex]);
          return;
        }

        if (isShuffle && queue.length > 0) {
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
        } else if (currentSong && isAutoplayEnabled) {
          showToast("Autoplay: Loading next " + getGenreForSong(currentSong) + " track...", currentSong);
          const nextSong = await autoFetchNextGenreTracks(currentSong);
          if (nextSong) {
            setCurrentIndex((prev) => (prev < 0 ? 0 : prev + 1));
            playSong(nextSong);
          } else {
            setIsPlaying(false);
          }
        } else {
          setIsPlaying(false);
        }
      }

      player.addEventListener("ended", handleSongEnd);

      return () => {
        player.removeEventListener("ended", handleSongEnd);
      };
    }, [player, currentIndex, queue, isRepeat, isShuffle, currentSong, isAutoplayEnabled]);

    useEffect(() => {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
      localStorage.setItem("playlists", JSON.stringify(playlists));
    }, [playlists]);

    // Simulate progress bar movement when iframe is active (can't read YouTube iframe currentTime)
    useEffect(() => {
      if (isIframeActive && isPlaying) {
        if (iframeTimerRef.current) clearInterval(iframeTimerRef.current);
        iframeTimerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (duration > 0 && prev >= duration - 1) {
              clearInterval(iframeTimerRef.current);
              return duration;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        if (iframeTimerRef.current) {
          clearInterval(iframeTimerRef.current);
          iframeTimerRef.current = null;
        }
      }
      return () => {
        if (iframeTimerRef.current) clearInterval(iframeTimerRef.current);
      };
    }, [isIframeActive, isPlaying, duration]);

  // Player Controls
  async function playSong(song) {
    if (!song) return;

    setCurrentSong(song);

    try {
      const stream = await getAudio(song.videoId, audioQuality);

      if (stream && stream.audio_url) {
        setIsIframeActive(false);
        setIframeSrc("");
        player.crossOrigin = "anonymous";
        player.src = stream.audio_url;
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          await audioCtxRef.current.resume();
        }
        await player.play().catch((playErr) => {
          if (playErr.name !== "AbortError") {
            playIframeFallback(song.videoId);
          }
        });
        setIsPlaying(true);
      } else {
        playIframeFallback(song);
      }
    } catch (err) {
      console.warn("Direct stream load error, engaging embedded audio player fallback:", err);
      playIframeFallback(song);
    }

    // Update Recently Played
    const recentHistory = JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
    const uniqueRecent = recentHistory.filter((s) => s.videoId !== song.videoId);
    uniqueRecent.unshift(song);
    localStorage.setItem("recentlyPlayed", JSON.stringify(uniqueRecent.slice(0, 12)));
  }

  function playIframeFallback(songOrId) {
    const videoId = typeof songOrId === "string" ? songOrId : songOrId?.videoId;
    if (!videoId) return;

    try {
      player.pause();
    } catch (e) {
      /* ignore interrupt pause */
    }
    player.src = "";
    setIsIframeActive(true);
    setIframeSrc(`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`);
    setIsPlaying(true);
    setCurrentTime(0);

    // Set duration from song metadata so the progress bar can simulate movement
    const songObj = typeof songOrId === "object" ? songOrId : currentSong;
    const dur = parseSongDuration(songObj?.duration);
    if (dur > 0) setDuration(dur);
  }

  function pauseSong() {
    if (isIframeActive) {
      setIframeSrc((prev) => prev.replace("autoplay=1", "autoplay=0"));
    } else {
      try {
        player.pause();
      } catch (e) {
        /* ignore interrupt pause */
      }
    }
    setIsPlaying(false);
  }

  function resumeSong() {
    if (isIframeActive && currentSong) {
      setIframeSrc(`https://www.youtube-nocookie.com/embed/${currentSong.videoId}?autoplay=1&enablejsapi=1`);
    } else {
      player.play().catch((e) => {
        if (e.name !== "AbortError") console.warn("Resume play error:", e);
      });
    }
    setIsPlaying(true);
  }

  function playNext() {
    if (queue.length === 0) return;

    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex < queue.length - 1 ? currentIndex + 1 : 0;
    }

    setCurrentIndex(nextIndex);
    playSong(queue[nextIndex]);
  }

  function playPrev() {
    if (queue.length === 0) return;

    let prevIndex;

    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    }

    setCurrentIndex(prevIndex);
    playSong(queue[prevIndex]);
  }

  function setTrackQueue(newQueue, index = 0) {
    setQueue(newQueue);
    setCurrentIndex(index);
    if (newQueue[index]) {
      playSong(newQueue[index]);
    }
  }

  function togglePlay() {
    if (!currentSong) return;
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  }

  function seek(time) {
    if (!isIframeActive) {
      player.currentTime = time;
      setCurrentTime(time);
    }
  }

  function setVolume(vol) {
    // Use GainNode if DSP chain is active (player.volume is bypassed by createMediaElementSource)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = vol;
    }
    // Also set on the raw player as fallback (works when DSP chain hasn't initialized)
    player.volume = vol;
  }

  function toggleFavorite(song) {
    if (!song) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.videoId === song.videoId);

      if (exists) {
        showToast("Removed from Favorites", song);
        return prev.filter((item) => item.videoId !== song.videoId);
      } else {
        showToast("Added to Favorites", song);
        return [...prev, song];
      }
    });
  }

  function isFavorite(song) {
    if (!song) return false;
    return favorites.some((item) => item.videoId === song.videoId);
  }

  function createPlaylist(name, description = "") {
    if (!name || !name.trim()) return null;

    const newPlaylist = {
      id: "pl_" + Date.now(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
    showToast(`Playlist "${newPlaylist.name}" created`);
    return newPlaylist;
  }

  function addSongToPlaylist(playlistId, song) {
    if (!playlistId || !song) return;

    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;

        const exists = pl.songs.some((s) => s.videoId === song.videoId);
        if (exists) {
          showToast(`Already in "${pl.name}"`, song);
          return pl;
        }

        showToast(`Added to "${pl.name}"`, song);
        return {
          ...pl,
          songs: [...pl.songs, song],
        };
      })
    );
  }

  function removeSongFromPlaylist(playlistId, videoId) {
    if (!playlistId || !videoId) return;

    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;

        return {
          ...pl,
          songs: pl.songs.filter((s) => s.videoId !== videoId),
        };
      })
    );

    showToast("Song removed from playlist");
  }

  function deletePlaylist(playlistId) {
    if (!playlistId) return;

    setPlaylists((prev) => {
      const target = prev.find((p) => p.id === playlistId);
      if (target) {
        showToast(`Deleted playlist "${target.name}"`);
      }
      return prev.filter((p) => p.id !== playlistId);
    });
  }

  function updatePlaylistName(playlistId, newName) {
    if (!playlistId || !newName || !newName.trim()) return;

    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        return { ...pl, name: newName.trim() };
      })
    );

    showToast("Playlist renamed");
  }

  function updatePlaylistDetails(playlistId, { name, description }) {
    if (!playlistId) return;

    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        return {
          ...pl,
          name: name !== undefined ? name.trim() : pl.name,
          description: description !== undefined ? description.trim() : pl.description,
        };
      })
    );

    showToast("Playlist updated");
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,

        playSong,
        pauseSong,
        resumeSong,
        togglePlay,
        seek,
        setVolume,

        queue,
        setQueue,
        currentIndex,
        setCurrentIndex,
        playNext,
        playPrev,
        setTrackQueue,

        isShuffle,
        setIsShuffle,
        isRepeat,
        setIsRepeat,

        favorites,
        toggleFavorite,
        isFavorite,

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

        audioQuality,
        setAudioQuality,

        isAutoplayEnabled,
        setIsAutoplayEnabled,

        isAuthenticated,
        loginUser,
        logoutUser,
      }}
    >
      {children}

      {/* YouTube Audio Engine Fallback — must be in-viewport (1×1px) for Chrome autoplay policy */}
      {iframeSrc && (
        <iframe
          id="symphony-youtube-audio-player"
          width="1"
          height="1"
          src={iframeSrc}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          title="Symphony Audio Engine"
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "1px",
            height: "1px",
            border: "none",
            opacity: 0.01,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      )}

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