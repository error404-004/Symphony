import { createContext, useContext, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPlayer } from "../services/player";
import { getAudio, pingBackend } from "../services/audio";
import { searchMusic } from "../services/api";
import { signUpWithEmail, signInWithEmail, signOutUser, isSupabaseConfigured, supabase } from "../services/supabase";

  export const PlayerContext = createContext();

  export function PlayerProvider({ children }) {
    const player = getPlayer();

    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isIframeActive, setIsIframeActive] = useState(false);
    const ytPlayerRef = useRef(null);
    const ytContainerRef = useRef(null);

    const [queue, setQueue] = useState([]);
    const [customQueue, setCustomQueue] = useState([]); // User added custom queue ("Next in Queue")
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
      const token = localStorage.getItem("symphony_auth_token");
      return token !== "logged_out";
    });

    const [userProfile, setUserProfile] = useState(() => {
      try {
        const saved = localStorage.getItem("symphony_user_profile");
        return saved ? JSON.parse(saved) : { name: "Guest User", email: "guest@symphony.audio" };
      } catch {
        return { name: "Guest User", email: "guest@symphony.audio" };
      }
    });

    // Listen to Supabase auth state changes
    useEffect(() => {
      if (!isSupabaseConfigured) return;

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          const user = session.user;
          const profile = {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || "Symphony Listener",
            email: user.email,
            preferredVibe: user.user_metadata?.preferredVibe || "Hindi Melodies",
            avatarColor: "from-purple-500 via-indigo-600 to-purple-800",
            bio: "Audio Enthusiast & Music Curator • Symphony Hi-Fi Premier",
          };
          localStorage.setItem("symphony_auth_token", session.access_token);
          localStorage.setItem("symphony_user_profile", JSON.stringify(profile));
          setUserProfile(profile);
          setIsAuthenticated(true);
          window.dispatchEvent(new Event("symphony-profile-updated"));
        } else if (event === 'SIGNED_OUT') {
          localStorage.setItem("symphony_auth_token", "logged_out");
          setIsAuthenticated(false);
          window.dispatchEvent(new Event("symphony-profile-updated"));
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }, []);

    const signUpUser = async (userData) => {
      const { email, password, name, preferredVibe } = userData;
      const { data, error } = await signUpWithEmail(email, password, { name, preferredVibe });

      if (error) {
        throw error;
      }

      const user = data?.user;
      const profile = {
        id: user?.id || 'demo_' + Date.now(),
        name: name || "Guest User",
        email: email || "guest@symphony.audio",
        preferredVibe: preferredVibe || "Hindi Melodies",
        avatarColor: "from-purple-500 via-indigo-600 to-purple-800",
        bio: "Audio Enthusiast & Music Curator • Symphony Hi-Fi Premier",
      };

      localStorage.setItem("symphony_auth_token", "symphony_session_" + Date.now());
      localStorage.setItem("symphony_user_profile", JSON.stringify(profile));
      setUserProfile(profile);
      setIsAuthenticated(true);
      window.dispatchEvent(new Event("symphony-profile-updated"));
      showToast("Welcome to Symphony, " + profile.name);
      return profile;
    };

    const loginUser = async (userData) => {
      const { email, password } = userData || {};

      if (email && password && isSupabaseConfigured) {
        const { data, error } = await signInWithEmail(email, password);
        if (error) throw error;
        const user = data?.user;
        const profile = {
          id: user?.id,
          name: user?.user_metadata?.name || email.split('@')[0],
          email: user?.email,
          preferredVibe: user?.user_metadata?.preferredVibe || "Hindi Melodies",
          avatarColor: "from-purple-500 via-indigo-600 to-purple-800",
          bio: "Audio Enthusiast & Music Curator • Symphony Hi-Fi Premier",
        };
        localStorage.setItem("symphony_auth_token", data?.session?.access_token || "symphony_session_" + Date.now());
        localStorage.setItem("symphony_user_profile", JSON.stringify(profile));
        setUserProfile(profile);
        setIsAuthenticated(true);
        window.dispatchEvent(new Event("symphony-profile-updated"));
        showToast("Welcome back to Symphony, " + profile.name);
        return profile;
      }

      // Demo/Local fallback mode
      const token = "symphony_session_" + Date.now();
      localStorage.setItem("symphony_auth_token", token);
      const userProfileData = {
        name: userData?.name || "Guest User",
        email: userData?.email || "guest@symphony.audio",
        avatarColor: "from-purple-500 via-indigo-600 to-purple-800",
        bio: "Audio Enthusiast & Music Curator • Symphony Hi-Fi Premier",
        genre: "Synthwave / Lo-Fi",
      };
      localStorage.setItem("symphony_user_profile", JSON.stringify(userProfileData));
      setUserProfile(userProfileData);
      window.dispatchEvent(new Event("symphony-profile-updated"));
      setIsAuthenticated(true);
      showToast("Welcome back to Symphony, " + userProfileData.name);
      return userProfileData;
    };

    const logoutUser = async () => {
      await signOutUser();
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
    const volumeRef = useRef(75); // track current volume 0-100 for YT player

    // Load YouTube IFrame API script once & ping Render backend cold-start
    useEffect(() => {
      pingBackend();
      if (window.YT && window.YT.Player) return;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
    }, []);

    useEffect(() => {
      const initAudioDSP = () => {
        if (audioCtxRef.current || !player) return;
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          // Automatically auto-resume AudioContext whenever Chrome attempts to suspend it in background tabs
          ctx.onstatechange = () => {
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }
          };

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

          // Continuous Silent Oscillator keepalive to prevent Chrome from suspending AudioContext in background tabs
          try {
            const silentOsc = ctx.createOscillator();
            const silentGain = ctx.createGain();
            silentGain.gain.value = 0.000001; // Inaudible
            silentOsc.connect(silentGain);
            silentGain.connect(ctx.destination);
            silentOsc.start();
          } catch (e) {
            /* ignore */
          }
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

      const ensureAudioContextResumed = () => {
        initAudioDSP();
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      };

      player.addEventListener('play', ensureAudioContextResumed);
      player.addEventListener('playing', ensureAudioContextResumed);
      player.addEventListener('timeupdate', ensureAudioContextResumed);

      return () => {
        player.removeEventListener('play', ensureAudioContextResumed);
        player.removeEventListener('playing', ensureAudioContextResumed);
        player.removeEventListener('timeupdate', ensureAudioContextResumed);
      };
    }, [player]);

    // Handle tab switching & background/foreground transitions seamlessly
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
        // Strictly only resume playback if the user has NOT paused the track
        if (isPlaying) {
          if (!isIframeActive && player && player.paused) {
            player.play().catch(() => {});
          }
          if (isIframeActive && ytPlayerRef.current?.playVideo) {
            try { ytPlayerRef.current.unMute(); } catch (e) {}
            try { ytPlayerRef.current.playVideo(); } catch (e) {}
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleVisibilityChange);
      };
    }, [player, isIframeActive, isPlaying]);

    // MediaSession API Integration for OS Media Controls & Uninterrupted Background Playback
    useEffect(() => {
      if (!currentSong || typeof window === 'undefined' || !('mediaSession' in navigator)) return;

      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: currentSong.title || 'Symphony Track',
          artist: currentSong.artist || currentSong.author || 'Symphony Artist',
          album: currentSong.album || 'Symphony Music',
          artwork: [
            { src: currentSong.thumbnail || currentSong.cover || currentSong.coverUrl || '/logo.png', sizes: '512x512', type: 'image/png' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          if (isIframeActive && ytPlayerRef.current?.playVideo) {
            ytPlayerRef.current.playVideo();
          } else {
            player.play().catch(() => {});
          }
          setIsPlaying(true);
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          if (isIframeActive && ytPlayerRef.current?.pauseVideo) {
            ytPlayerRef.current.pauseVideo();
          } else {
            player.pause();
          }
          setIsPlaying(false);
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          playNext();
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
          playPrev();
        });
      } catch (e) {
        console.warn('MediaSession handler setup notice:', e);
      }
    }, [currentSong, isIframeActive]);

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
        // Continuous WebAudio Keep-Alive: Resumes AudioContext on every timeupdate tick if Chrome attempts background suspension
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
      }

      function loadedMetadata() {
        if (!isIframeActive) {
          setDuration(player.duration || 0);
        }
      }

      function handleAudioError(e) {
        if (!isIframeActive && currentSong) {
          console.warn("Direct audio stream error detected, engaging seamless auto-recovery:", e);
          const resumeTime = player.currentTime || 0;
          playIframeFallback(currentSong, resumeTime);
        }
      }

      player.addEventListener("timeupdate", updateTime);
      player.addEventListener("loadedmetadata", loadedMetadata);
      player.addEventListener("error", handleAudioError);
      player.addEventListener("stalled", handleAudioError);

      return () => {
        player.removeEventListener("timeupdate", updateTime);
        player.removeEventListener("loadedmetadata", loadedMetadata);
        player.removeEventListener("error", handleAudioError);
        player.removeEventListener("stalled", handleAudioError);
      };
    }, [player, isIframeActive, currentSong]);

    // Audio stream stall watchdog timer (catches silent cut-offs at 4-minute YouTube stream expiration)
    useEffect(() => {
      if (isIframeActive || !isPlaying || !currentSong) return;

      let lastTime = player.currentTime;
      let stallCount = 0;

      const stallInterval = setInterval(() => {
        if (player.paused || isIframeActive) return;

        // If audio time has not advanced for 4 consecutive seconds while playing
        if (player.currentTime === lastTime && player.currentTime > 0) {
          stallCount++;
          if (stallCount >= 4) {
            console.warn("Audio playback stalled mid-stream, engaging seamless YouTube player auto-recovery...");
            const resumeTime = player.currentTime || 0;
            playIframeFallback(currentSong, resumeTime);
          }
        } else {
          lastTime = player.currentTime;
          stallCount = 0;
        }
      }, 1000);

      return () => clearInterval(stallInterval);
    }, [isPlaying, isIframeActive, currentSong, player]);

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
        if (isRepeat && currentSong) {
          playSong(currentSong);
          return;
        }

        // 1. Check custom user-added queue first ("Next in Queue")
        if (customQueue.length > 0) {
          const nextSong = customQueue[0];
          setCustomQueue((prev) => prev.slice(1));
          playSong(nextSong);
          return;
        }

        // 2. Shuffle mode on normal queue
        if (isShuffle && queue.length > 0) {
          const randomIndex = Math.floor(Math.random() * queue.length);
          setCurrentIndex(randomIndex);
          playSong(queue[randomIndex]);
          return;
        }

        // 3. Sequential normal queue
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
      window.addEventListener("symphony-yt-ended", handleSongEnd);

      return () => {
        player.removeEventListener("ended", handleSongEnd);
        window.removeEventListener("symphony-yt-ended", handleSongEnd);
      };
    }, [player, currentIndex, queue, customQueue, isRepeat, isShuffle, currentSong, isAutoplayEnabled]);

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
        player.volume = (volumeRef.current || 75) / 100;
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          await audioCtxRef.current.resume().catch(() => {});
        }

        await player.play().catch((playErr) => {
          if (playErr.name !== "AbortError") {
            playIframeFallback(song);
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

  function playIframeFallback(songOrId, startTimeSeconds = 0) {
    const videoId = typeof songOrId === "string" ? songOrId : songOrId?.videoId;
    if (!videoId) return;

    try {
      player.pause();
    } catch (e) {
      /* ignore interrupt pause */
    }
    player.src = "";
    setIsIframeActive(true);
    setIsPlaying(true);

    if (startTimeSeconds > 0) {
      setCurrentTime(startTimeSeconds);
    } else {
      setCurrentTime(0);
    }

    // Set duration from song metadata so the progress bar can simulate movement
    const songObj = typeof songOrId === "object" ? songOrId : currentSong;
    const dur = parseSongDuration(songObj?.duration);
    if (dur > 0) setDuration(dur);

    const startSecs = Math.floor(startTimeSeconds || 0);

    // Create or reuse YouTube IFrame Player cleanly for every track change
    const createPlayer = () => {
      // Ensure target DIV exists in container
      if (!document.getElementById('symphony-yt-player') && ytContainerRef.current) {
        ytContainerRef.current.innerHTML = '<div id="symphony-yt-player"></div>';
      }

      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try { ytPlayerRef.current.destroy(); } catch (e) { /* ignore */ }
      }

      if (!document.getElementById('symphony-yt-player') && ytContainerRef.current) {
        ytContainerRef.current.innerHTML = '<div id="symphony-yt-player"></div>';
      }

      ytPlayerRef.current = new window.YT.Player('symphony-yt-player', {
        height: '200',
        width: '320',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start: startSecs,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            try {
              const iframe = document.getElementById('symphony-yt-player');
              if (iframe && iframe.tagName === 'IFRAME') {
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
              }
            } catch (e) {}
            try { event.target.unMute(); } catch (e) {}
            try { event.target.setVolume(volumeRef.current); } catch (e) {}
            if (startSecs > 0) {
              try { event.target.seekTo(startSecs, true); } catch (e) { /* ignore */ }
            }
            try { event.target.playVideo(); } catch (e) {}
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING === 1
            if (event.data === 1) {
              setIsPlaying(true);
              try { event.target.unMute(); } catch (e) {}
              try { event.target.setVolume(volumeRef.current || 75); } catch (e) {}
            }
            // YT.PlayerState.ENDED === 0
            if (event.data === 0) {
              setIsPlaying(false);
              // Trigger next song via same ended logic
              window.dispatchEvent(new Event('symphony-yt-ended'));
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Wait for API to load
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }

  function pauseSong() {
    if (isIframeActive) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }
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
    if (isIframeActive) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        ytPlayerRef.current.playVideo();
      }
    } else if (currentSong) {
      player.play().catch((e) => {
        if (e.name !== "AbortError") console.warn("Resume failed:", e);
      });
    }
    setIsPlaying(true);
  }

  async function playNext() {
    // 1. Consume custom user queue first if present ("Next in Queue")
    if (customQueue.length > 0) {
      const nextSong = customQueue[0];
      setCustomQueue((prev) => prev.slice(1));
      playSong(nextSong);
      return;
    }

    // 2. Consume normal queue if available
    if (queue.length > 0) {
      let nextIndex;

      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else {
        nextIndex = currentIndex < queue.length - 1 ? currentIndex + 1 : 0;
      }

      setCurrentIndex(nextIndex);
      playSong(queue[nextIndex]);
      return;
    }

    // 3. Fallback: If queue is empty, auto-fetch next genre track
    if (currentSong) {
      showToast("Autoplay: Loading next " + getGenreForSong(currentSong) + " track...", currentSong);
      const nextSong = await autoFetchNextGenreTracks(currentSong);
      if (nextSong) {
        playSong(nextSong);
      }
    }
  }

  function addToCustomQueue(song) {
    if (!song) return;
    setCustomQueue((prev) => [...prev, song]);
    showToast(`Added "${song.title || 'Track'}" to Next in Queue`);
  }

  function addToQueue(song) {
    addToCustomQueue(song);
  }

  function removeFromQueue(index, isCustom = false) {
    if (isCustom) {
      setCustomQueue((prev) => {
        const target = prev[index];
        if (target) showToast(`Removed "${target.title || 'Track'}" from queue`);
        return prev.filter((_, i) => i !== index);
      });
    } else {
      setQueue((prev) => {
        const target = prev[index];
        if (target) showToast(`Removed "${target.title || 'Track'}" from queue`);
        return prev.filter((_, i) => i !== index);
      });
    }
  }

  function moveQueueItem(index, direction, isCustom = false) {
    const targetQueue = isCustom ? customQueue : queue;
    const setTarget = isCustom ? setCustomQueue : setQueue;

    if (index < 0 || index >= targetQueue.length) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= targetQueue.length) return;

    const updated = [...targetQueue];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);

    setTarget(updated);
  }

  function playPrev() {
    // If track has been playing for >3s, restart current song (Spotify standard)
    if (player && player.currentTime > 3) {
      seek(0);
      return;
    }

    if (queue.length > 0) {
      let prevIndex;

      if (isShuffle) {
        prevIndex = Math.floor(Math.random() * queue.length);
      } else {
        prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
      }

      setCurrentIndex(prevIndex);
      playSong(queue[prevIndex]);
    } else {
      seek(0);
    }
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
    if (isIframeActive) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(time, true);
      }
    } else {
      player.currentTime = time;
    }
    setCurrentTime(time);
  }

  function setVolume(vol) {
    volumeRef.current = Math.round(vol * 100); // store as 0-100 for YT
    // Use GainNode if DSP chain is active (player.volume is bypassed by createMediaElementSource)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = vol;
    }
    // Also set on the raw player as fallback (works when DSP chain hasn't initialized)
    player.volume = vol;
    // Control YouTube player volume if iframe is active
    if (isIframeActive && ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      ytPlayerRef.current.setVolume(Math.round(vol * 100));
    }
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

  function createPlaylist(nameOrObj, descriptionStr = "") {
    let name = "";
    let description = "";
    let gradient = "";

    if (typeof nameOrObj === "object" && nameOrObj !== null) {
      name = nameOrObj.name || "";
      description = nameOrObj.description || "";
      gradient = nameOrObj.gradient || "";
    } else {
      name = nameOrObj || "";
      description = descriptionStr || "";
    }

    if (!name || !name.trim()) return null;

    const newPlaylist = {
      id: "pl_" + Date.now(),
      name: name.trim(),
      description: description.trim(),
      gradient: gradient || "from-purple-600 via-purple-700 to-indigo-800",
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
        customQueue,
        setCustomQueue,
        addToCustomQueue,
        addToQueue,
        removeFromQueue,
        moveQueueItem,
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
        userProfile,
        signUpUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}

      {/* YouTube Player API container — 200x200px satisfies YouTube embed policy while remaining invisible */}
      <div
        ref={ytContainerRef}
        style={{
          position: 'fixed',
          bottom: '0px',
          right: '0px',
          width: '200px',
          height: '200px',
          overflow: 'hidden',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div id="symphony-yt-player" />
      </div>

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