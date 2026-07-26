import { Play, Clock, Volume2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { motion } from "framer-motion";

export default function SearchResults({ songs }) {
  if (!Array.isArray(songs) || songs.length === 0) return null;

  const { playSong, setQueue, setCurrentIndex, currentSong, isPlaying } = usePlayer();

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold text-white tracking-tight">Songs</h2>

      {/* Spotify Tracklist Header */}
      <div className="grid grid-cols-[24px_1fr_1fr_60px] gap-4 px-4 py-2 text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider border-b border-[#282828] select-none">
        <span>#</span>
        <span>Title</span>
        <span className="hidden sm:block">Album</span>
        <div className="flex justify-end pr-2">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      {/* Tracklist Rows */}
      <div className="space-y-0.5">
        {songs.map((song, index) => {
          const isCurrent = currentSong?.videoId === song.videoId;

          return (
            <motion.div
              key={song.videoId || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              onClick={() => {
                setQueue(songs);
                setCurrentIndex(index);
                playSong(song);
              }}
              className={`grid grid-cols-[24px_1fr_1fr_60px] gap-4 items-center px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer transition-colors ${
                isCurrent ? "bg-white/10" : ""
              }`}
            >
              {/* Index Column / Hover Play Icon / Playing Indicator */}
              <div className="flex items-center justify-center w-6 text-sm font-medium text-[#B3B3B3]">
                {isCurrent && isPlaying ? (
                  <Volume2 className="w-4 h-4 text-[#1DB954] animate-pulse" />
                ) : (
                  <>
                    <span className={`group-hover:hidden ${isCurrent ? "text-[#1DB954]" : ""}`}>
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-white fill-white hidden group-hover:block ml-0.5" fill="white" />
                  </>
                )}
              </div>

              {/* Title & Thumbnail Column */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover shrink-0 shadow"
                />
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isCurrent ? "text-[#1DB954]" : "text-white group-hover:underline"
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-xs text-[#B3B3B3] truncate group-hover:text-white transition-colors">
                    {song.artist}
                  </p>
                </div>
              </div>

              {/* Album Column */}
              <p className="text-sm text-[#B3B3B3] truncate hidden sm:block group-hover:text-white transition-colors">
                {song.album || "Single"}
              </p>

              {/* Duration Column */}
              <div className="text-right text-sm text-[#B3B3B3] font-medium tabular-nums pr-2">
                {song.duration || "--:--"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}