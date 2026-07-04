import { Music } from "lucide-react";
import usePlayer from "../hooks/usePlayer";

export default function SearchResults({ songs, onSongSelect }) {
  if (songs.length === 0) return null;
  const { playSong } = usePlayer();
  return (
    <div className="space-y-3 mt-8">
      <h2 className="text-2xl font-bold text-white">
        Search Results
      </h2>

      {songs.map((song) => (
        <div
          key={song.videoId}
          onClick={() => {
              onSongSelect(song);
              playSong(song);
}}
          className="flex items-center gap-4 p-3 rounded-xl bg-surface-900 hover:bg-surface-800 transition cursor-pointer"
        >
          {/* Thumbnail */}
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-16 h-16 rounded-lg object-cover"
          />

          {/* Song Info */}
          <div className="flex-1">
            <h3 className="text-white font-semibold">
              {song.title}
            </h3>

            <p className="text-surface-400 text-sm">
              {song.artist}
            </p>

            <p className="text-surface-500 text-xs">
              {song.album}
            </p>
          </div>

          {/* Duration */}
          <div className="text-surface-400 text-sm">
            {song.duration}
          </div>

          <Music className="text-primary-500" />
        </div>
      ))}
    </div>
  );
}