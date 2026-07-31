import { Play, Clock, Volume2, ListMusic, Loader2, Music2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { motion } from "framer-motion";
import SongContextMenu from "./ui/SongContextMenu";

export default function SearchResults({ songs, query, isLoading }) {
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <p className="text-sm font-medium text-zinc-300">Searching songs for "{query}"...</p>
      </div>
    );
  }

  if (query && (!Array.isArray(songs) || songs.length === 0)) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 gap-3">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Music2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">No songs found</h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          We couldn't find any songs matching "{query}". Try checking your spelling or searching for a different track.
        </p>
      </div>
    );
  }

  if (!Array.isArray(songs) || songs.length === 0) return null;

  const { playSong, setQueue, setCurrentIndex, currentSong, isPlaying } = usePlayer();

  return (
    <div className="mt-6 space-y-5" style={{ marginTop: '24px' }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-sm">
          <ListMusic className="w-5 h-5" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>Songs</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-inner">
            {songs.length} results
          </span>
        </h2>
      </div>

      {/* Spotify Tracklist Header */}
      <div className="grid grid-cols-[32px_1fr_1fr_110px] gap-4 px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-white/10 select-none">
        <span className="text-center">#</span>
        <span>Title</span>
        <span className="hidden sm:block">Album</span>
        <div className="flex justify-end pr-2">
          <Clock className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {/* Tracklist Rows */}
      <div className="space-y-1">
        {songs.map((song, index) => {
          const isCurrent = currentSong?.videoId === song.videoId;

          return (
            <motion.div
              key={song.videoId || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              onClick={() => {
                setQueue(songs);
                setCurrentIndex(index);
                playSong(song);
              }}
              className={`grid grid-cols-[32px_1fr_1fr_110px] gap-4 items-center px-4 py-2.5 rounded-md group cursor-pointer transition-colors duration-150 ${
                isCurrent
                  ? "bg-purple-900/30 text-purple-200"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              {/* Index Column / Hover Play Icon / Playing Indicator */}
              <div className="flex items-center justify-center w-8 text-sm font-medium text-zinc-400">
                {isCurrent && isPlaying ? (
                  <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                ) : (
                  <>
                    <span className={`group-hover:hidden ${isCurrent ? "text-purple-400 font-bold" : ""}`}>
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-white fill-white hidden group-hover:block" />
                  </>
                )}
              </div>

              {/* Title & Thumbnail Column */}
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover shrink-0 shadow-md"
                />
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate transition-colors duration-200 ${
                      isCurrent ? "text-purple-300" : "text-white group-hover:text-purple-200"
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-200 transition-colors">
                    {song.artist}
                  </p>
                </div>
              </div>

              {/* Album Column */}
              <p className="text-sm text-zinc-400 truncate hidden sm:block group-hover:text-zinc-200 transition-colors">
                {song.album || "Single"}
              </p>

              {/* Duration & Context Menu Column */}
              <div className="flex items-center justify-end gap-2 text-xs text-zinc-400 font-medium tabular-nums pr-1 group-hover:text-white transition-colors">
                <span>{song.duration || "--:--"}</span>
                <SongContextMenu song={song} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}