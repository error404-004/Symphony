  import { createContext, useContext, useEffect, useState } from "react";
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
        if (queue.length === 0) return;

        if (isRepeat) {
          playSong(queue[currentIndex]);
          return;
        }

        if (isShuffle) {
          const randomIndex = Math.floor(Math.random() * queue.length);
          setCurrentIndex(randomIndex);
          playSong(queue[randomIndex]);
          return;
        }

        if (currentIndex < queue.length - 1) {
          const nextSong = queue[currentIndex + 1];
          setCurrentIndex(currentIndex + 1);
          playSong(nextSong);
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

    console.log("Playing:", song.title);

    try {
      const stream = await getAudio(song.videoId);

      console.log(stream);
      console.log(song);
      player.src = stream.audio_url;

      await player.play();

      setCurrentSong(song);
      setIsPlaying(true);

      console.log("Finished");
    } catch (err) {
      console.error(err);
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
    function createPlaylist(name) {
      if (!name.trim()) return;

      const playlist = {
        id: Date.now(),
        name,
        songs: [],
      };

      setPlaylists((prev) => [...prev, playlist]);
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

          currentIndex,
          setCurrentIndex,

          playNext,
          playPrevious,

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

          playSong,
        }}
      >
        {children}
      </PlayerContext.Provider>
    );
  }

  export function usePlayer() {
    return useContext(PlayerContext);
  }