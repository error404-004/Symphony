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
    const eqBassRef = useRef(null);
    const eqTrebleRef = useRef(null);

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

          // Low Shelf Bass Filter (120Hz Sub-bass Warmth)
          const bassFilter = ctx.createBiquadFilter();
          bassFilter.type = 'lowshelf';
          bassFilter.frequency.value = 120;
          eqBassRef.current = bassFilter;

          // High Shelf Treble Filter (8kHz Crystal Acoustics)
          const trebleFilter = ctx.createBiquadFilter();
          trebleFilter.type = 'highshelf';
          trebleFilter.frequency.value = 8000;
          eqTrebleRef.current = trebleFilter;

          // Dynamic Compressor / Limiter (Amazon HD Studio Mastering)
          const compressor = ctx.createDynamicCompressor();
          compressor.threshold.value = -12;
          compressor.knee.value = 30;
          compressor.ratio.value = 12;
          compressor.attack.value = 0.003;
          compressor.release.value = 0.25;
          compressorRef.current = compressor;

          // Stereo Panner (Apple Spatial Audio 3D Soundstage)
          let panner = null;
          if (ctx.createStereoPanner) {
            panner = ctx.createStereoPanner();
            panner.pan.value = 0;
            pannerRef.current = panner;
          }

          if (panner) {
            source.connect(bassFilter);
            bassFilter.connect(trebleFilter);
            trebleFilter.connect(panner);
            panner.connect(compressor);
            compressor.connect(ctx.destination);
          } else {
            source.connect(bassFilter);
            bassFilter.connect(trebleFilter);
            trebleFilter.connect(compressor);
            compressor.connect(ctx.destination);
          }
        } catch (err) {
          console.warn("WebAudio Master DSP init handled:", err);
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
        // Apple Spatial Audio 3D + Amazon HD: 3D soundstage, 4.5dB Bass boost, 3.5dB Treble lift
        if (eqBassRef.current) eqBassRef.current.gain.value = 4.5;
        if (eqTrebleRef.current) eqTrebleRef.current.gain.value = 3.5;
        if (pannerRef.current) pannerRef.current.pan.value = 0.15;
      } else if (q.includes('lossless') || q.includes('alac') || q.includes('flac') || q.includes('192khz')) {
        // Apple Lossless ALAC: Uncompressed Pure Studio Monitor Flat Response
        if (eqBassRef.current) eqBassRef.current.gain.value = 1.0;
        if (eqTrebleRef.current) eqTrebleRef.current.gain.value = 1.0;
        if (pannerRef.current) pannerRef.current.pan.value = 0;
      } else if (q.includes('ultra hd') || q.includes('amazon') || q.includes('320')) {
        // Amazon Ultra HD Master: 6dB Bass boost, crisp high-end treble
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

    // -------------------------------------------------------------
    // Genre Resolver & Dynamic Autoplay Radio Engine
    // -------------------------------------------------------------
    function getGenreForSong(song) {
      if (!song) return "Top Hits";
      if (song.genre) return song.genre;

      const text = `${song.title || ""} ${song.artist || ""} ${song.author || ""} ${song.album || ""}`.toLowerCase();

      if (
        /arijit|atif|lata|kishore|kumar sanu|udit|shreya|jubin|pritam|mithoon|armaan|nehha|badshah|rahat|mohit|sonu|palak|amaal|versatile|bollywood|hindi|tum hi|tereliye|khairiyat|pyaare|raabta|channa|kesariya/i.test(
          text
        )
      ) {
        return "Hindi Romantic Melodies";
      }

      if (
        /punjabi|diljit|sidhu|karan aujla|ap dhillon|shubh|harness|bhangra|guru randhawa|jassie|amrinder/i.test(
          text
        )
      ) {
        return "Punjabi Top Hits";
      }

      if (/lofi|lo-fi|chill|beat|study|relax|ambient|sleep|piano/i.test(text)) {
        return "Lo-Fi Beats Chill";
      }

      if (/synthwave|retro|80s|cyber|electronic|edm|dj|house|remix/i.test(text)) {
        return "Synthwave Electronic Beats";
      }

      if (/rock|metal|guitar|band|anthem|queen|linkin|nirvana/i.test(text)) {
        return "Rock Anthems";
      }

      if (/classical|mozart|beethoven|symphony|orchestra|piano/i.test(text)) {
        return "Classical Symphony";
      }

      if (song.artist && song.artist !== "Unknown Artist") {
        return `${song.artist} radio mix`;
      }

      return "Global Top Hits";
    }

    async function autoFetchNextGenreTracks(targetSong) {
      if (!targetSong) return null;
      try {
        const genreQuery = getGenreForSong(targetSong);
        const data = await searchMusic(genreQuery);
        const fetchedSongs = Array.isArray(data) ? data : data.songs || [];

        const currentHidden = JSON.parse(localStorage.getItem("symphony_not_recommended")) || [];
        const filtered = fetchedSongs.filter(
          (s) =>
            s.videoId !== targetSong.videoId &&
            !currentHidden.includes(s.videoId) &&
            !queue.some((q) => q.videoId === s.videoId)
        );

        if (filtered.length > 0) {
          const shuffled = [...filtered].sort(() => 0.5 - Math.random());
          setQueue((prevQueue) => [...prevQueue, ...shuffled]);
          return shuffled[0];
        }
      } catch (err) {
        console.error("Auto genre queue generation error:", err);
      }
      return null;
    }

    // -----------------------------
    // Song End & Continuous Genre Autoplay Logic
    // -----------------------------
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
      const stream = await getAudio(song.videoId, audioQuality);

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