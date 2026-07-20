import { Music, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { motion } from "framer-motion";

export default function SearchResults({ songs, onSongSelect }) {
  if (!Array.isArray(songs) || songs.length === 0)
    return null;
  const {
    playSong,
    setQueue,
    setCurrentIndex,
  }  = usePlayer();
  return (
    <div className="space-y-3 mt-8">
      <h2 className="text-2xl font-bold text-white">
        Search Results
      </h2>

      {songs.map((song, index) => (
        <motion.div
          key={song.videoId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          onClick={() => {
              setQueue(songs);

              setCurrentIndex(index);

              playSong(song);
          }}
      
          className="flex items-center gap-4 p-3 rounded-xl bg-[#181818]/60 hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 cursor-pointer group shadow-md shadow-black/10"
        >
          {/* Thumbnail */}
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md shadow-black/20">
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-full h-full object-cover"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" fill="currentColor" />
            </div>
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate group-hover:text-primary-300 transition-colors duration-200">
              {song.title}
            </h3>

            <p className="text-[#B3B3B3] text-sm truncate">
              {song.artist}
            </p>

            <p className="text-[#B3B3B3]/50 text-xs truncate">
              {song.album}
            </p>
          </div>

          {/* Duration */}
          <div className="text-[#B3B3B3] text-sm tabular-nums font-medium">
            {song.duration}
          </div>

          <Music className="text-primary-500/60 group-hover:text-primary-400 transition-colors duration-200 shrink-0" />
        </motion.div>
      ))}
    </div>
  );
}