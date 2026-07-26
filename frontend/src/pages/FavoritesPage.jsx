import { motion } from 'framer-motion'
import { Heart, Play, Clock, Shuffle, Volume2 } from 'lucide-react'
import usePlayer from "../hooks/usePlayer";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.05 } },
}

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

/**
 * FavoritesPage - Spotify Liked Songs Playlist View
 */
export default function FavoritesPage() {
  const { favorites, playSong, setQueue, setCurrentIndex, currentSong, isPlaying } = usePlayer();

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      setQueue(favorites);
      setCurrentIndex(0);
      playSong(favorites[0]);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Hero Header */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-lg overflow-hidden p-6 md:p-8 bg-gradient-to-b from-[#5038a0] to-[#121212] flex items-end gap-6 select-none"
      >
        <div className="w-36 h-36 lg:w-48 lg:h-48 rounded-md bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shadow-2xl shrink-0">
          <Heart className="w-16 h-16 lg:w-24 lg:h-24 text-white fill-white" fill="white" />
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-bold text-white">Playlist</p>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
            Liked Songs
          </h1>
          <p className="text-[#B3B3B3] text-sm font-semibold pt-2">
            User • <span className="text-white">{favorites.length} songs</span>
          </p>
        </div>
      </motion.div>

      {/* Action Play Bar */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 py-2">
        <motion.button
          onClick={handlePlayAll}
          disabled={favorites.length === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black shadow-lg shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Play all liked songs"
        >
          <Play className="w-6 h-6 ml-0.5 text-black fill-black" fill="black" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full text-[#B3B3B3] hover:text-white transition-colors"
          aria-label="Shuffle"
        >
          <Shuffle className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Tracklist View */}
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

        {/* Tracks List */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#181818] flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-[#B3B3B3]" />
            </div>
            <h2 className="text-xl font-bold text-white">Songs you like will appear here</h2>
            <p className="text-[#B3B3B3] mt-1 text-sm">
              Save songs by tapping the heart icon.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5 mt-2">
            {favorites.map((song, i) => {
              const isCurrent = currentSong?.videoId === song.videoId;

              return (
                <motion.div
                  key={song.videoId || i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    setQueue(favorites);
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

                  {/* Title & Cover */}
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

                  {/* Artist */}
                  <p className="text-sm text-[#B3B3B3] truncate hidden sm:block group-hover:text-white transition-colors">
                    {song.artist}
                  </p>

                  {/* Duration & Heart */}
                  <div className="flex items-center justify-end gap-3 pr-2">
                    <Heart className="w-4 h-4 text-[#1DB954] fill-[#1DB954]" fill="#1DB954" />
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
