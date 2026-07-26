import { useParams, useNavigate } from "react-router-dom";
import { Trash2, X, Music2, Play, Plus, Clock, Volume2 } from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.06 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    playlists,
    currentSong,
    isPlaying,
    addSongToPlaylist,
    playSong,
    setQueue,
    setCurrentIndex,
    deletePlaylist,
    removeSongFromPlaylist,
  } = usePlayer();

  const playlist = playlists.find((p) => String(p.id) === id);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Music2 className="w-16 h-16 text-[#B3B3B3]/20 mb-4" />
        <p className="text-xl font-bold text-white">Playlist not found</p>
        <p className="text-[#B3B3B3] text-sm mt-1">This playlist may have been deleted.</p>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      setQueue(playlist.songs);
      setCurrentIndex(0);
      playSong(playlist.songs[0]);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Playlist Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-lg overflow-hidden p-6 md:p-8 bg-gradient-to-b from-[#282828] to-[#121212] flex items-end gap-6 select-none"
      >
        <div className="w-36 h-36 lg:w-48 lg:h-48 rounded-md bg-[#282828] flex items-center justify-center shrink-0 shadow-2xl">
          <Music2 className="w-16 h-16 lg:w-24 lg:h-24 text-[#B3B3B3]" />
        </div>

        <div className="space-y-2 flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest font-bold text-white">Playlist</p>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight truncate">
            {playlist.name}
          </h1>
          <p className="text-[#B3B3B3] text-sm font-semibold pt-1">
            User • <span className="text-white">{playlist.songs.length} songs</span>
          </p>
        </div>
      </motion.div>

      {/* Action Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handlePlayAll}
            disabled={playlist.songs.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black shadow-lg shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Play playlist"
          >
            <Play className="w-6 h-6 ml-0.5 text-black fill-black" fill="black" />
          </motion.button>

          {currentSong && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addSongToPlaylist(playlist.id, currentSong)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#727272] hover:border-white text-white text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Current Song
            </motion.button>
          )}
        </div>

        <button
          onClick={() => {
            if (window.confirm("Delete this playlist?")) {
              deletePlaylist(playlist.id);
              navigate("/library");
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Playlist
        </button>
      </motion.div>

      {/* Tracklist Table View */}
      <motion.div variants={itemVariants}>
        {/* Table Header */}
        <div className="grid grid-cols-[24px_1fr_1fr_60px] gap-4 px-4 py-2 text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider border-b border-[#282828] select-none">
          <span>#</span>
          <span>Title</span>
          <span className="hidden sm:block">Artist</span>
          <div className="flex justify-end pr-2">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Track Rows */}
        {playlist.songs.length === 0 ? (
          <div className="text-center py-16 rounded-md bg-[#181818] mt-4">
            <Music2 className="w-12 h-12 mx-auto text-[#B3B3B3] mb-3" />
            <h3 className="text-lg font-bold text-white">This playlist is empty</h3>
            <p className="text-[#B3B3B3] text-sm mt-1">
              Play a track and click "Add Current Song" to fill it up.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5 mt-2">
            {playlist.songs.map((song, i) => {
              const isCurrent = currentSong?.videoId === song.videoId;

              return (
                <motion.div
                  key={song.videoId || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    setQueue(playlist.songs);
                    setCurrentIndex(i);
                    playSong(song);
                  }}
                  className={`grid grid-cols-[24px_1fr_1fr_60px] gap-4 items-center px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer transition-colors ${
                    isCurrent ? "bg-white/10" : ""
                  }`}
                >
                  {/* # Column */}
                  <div className="flex items-center justify-center w-6 text-sm font-medium text-[#B3B3B3]">
                    {isCurrent && isPlaying ? (
                      <Volume2 className="w-4 h-4 text-[#1DB954] animate-pulse" />
                    ) : (
                      <>
                        <span className={`group-hover:hidden ${isCurrent ? "text-[#1DB954]" : ""}`}>
                          {i + 1}
                        </span>
                        <Play className="w-4 h-4 text-white fill-white hidden group-hover:block ml-0.5" fill="white" />
                      </>
                    )}
                  </div>

                  {/* Title & Artwork Column */}
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
                      <p className="text-xs text-[#B3B3B3] truncate sm:hidden">{song.artist}</p>
                    </div>
                  </div>

                  {/* Artist Column */}
                  <p className="text-sm text-[#B3B3B3] truncate hidden sm:block group-hover:text-white transition-colors">
                    {song.artist}
                  </p>

                  {/* Remove Button / Duration Column */}
                  <div className="flex items-center justify-end gap-2 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(playlist.id, song.videoId);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#B3B3B3] hover:text-red-400 transition-all"
                      title="Remove from playlist"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-[#B3B3B3] font-medium tabular-nums">
                      {song.duration || "--:--"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}