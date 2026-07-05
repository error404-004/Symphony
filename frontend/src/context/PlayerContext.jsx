import { createContext, useContext, useState, useEffect } from "react";
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
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        function updateTime() {
            setCurrentTime(player.currentTime);
        }

        function loadedMetadata() {
            setDuration(player.duration);
        }

        player.addEventListener("timeupdate", updateTime);
        player.addEventListener("loadedmetadata", loadedMetadata);

        return () => {
            player.removeEventListener("timeupdate", updateTime);
            player.removeEventListener("loadedmetadata", loadedMetadata);
        };
    }, [player]);

    useEffect(() => {
        function handleSongEnd() {
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
    }, [player, currentIndex, queue, playSong]);

    useEffect(() => {
      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
    }, [favorites]);

  async function playSong(song) {
  setCurrentSong(song);

  try {
    const stream = await getAudio(song.videoId);

    player.src = stream.audio_url;

    await player.play();

    setCurrentSong(song);
    setIsPlaying(true);
  } catch (err) {
    console.error(err);
  }
}

function playNext() {
  if (currentIndex < queue.length - 1) {
    const nextSong = queue[currentIndex + 1];

    setCurrentIndex(currentIndex + 1);

    playSong(nextSong);
  }
}

function playPrevious() {
  if (currentIndex > 0) {
    const previousSong = queue[currentIndex - 1];

    setCurrentIndex(currentIndex - 1);

    playSong(previousSong);
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}