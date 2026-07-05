import { createContext, useContext, useState, useEffect } from "react";
import { getPlayer } from "../services/player";
import { getAudio } from "../services/audio";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const player = getPlayer();

    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
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
    }, [player, currentIndex, queue]);

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

  function pauseSong() {
    player.pause();
    setIsPlaying(false);
  }

  function resumeSong() {
    player.play();
    setIsPlaying(true);
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}