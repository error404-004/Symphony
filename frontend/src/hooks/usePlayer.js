import { useState } from "react";
import { getPlayer } from "../services/player";
import { getAudio } from "../services/audio";

export default function usePlayer() {
  const player = getPlayer();

  const [isPlaying, setIsPlaying] = useState(false);

  async function playSong(song) {
    try {
      const stream = await getAudio(song.videoId);

      player.src = stream.audio_url;

      await player.play();

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

  return {
    player,
    isPlaying,
    playSong,
    pauseSong,
    resumeSong,
  };
}