import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Shuffle,
  Heart,
  Share2,
  CheckCircle2,
  Clock,
  Volume2,
  Music2,
  UserCheck,
  UserPlus,
  Sparkles,
} from "lucide-react";
import usePlayer from "../hooks/usePlayer";
import { searchMusic } from "../services/api";
import MusicCard from "../components/ui/MusicCard";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.08 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const similarArtistsList = [
  { name: 'Daft Punk', genre: 'Electronic / Synthwave', listeners: '18.4M' },
  { name: 'Kavinsky', genre: 'Synthwave / Electro', listeners: '4.2M' },
  { name: 'Justice', genre: 'French Touch / Electro', listeners: '6.1M' },
  { name: 'Gesaffelstein', genre: 'Techno / Darkwave', listeners: '3.8M' },
];

/**
 * ArtistPage - Premium Artist Profile in Symphony Design Language (SDL).
 */
export default function ArtistPage() {
  const { name } = useParams();
  const artistName = name || "The Weeknd";
  const navigate = useNavigate();
  const { playSong, setQueue, setCurrentIndex, currentSong, isPlaying } = usePlayer();

  const [topTracks, setTopTracks] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArtistData() {
      try {
        setIsLoading(true);
        const data = await searchMusic(artistName, 12);
        const songs = Array.isArray(data) ? data : data.songs || [];
        setTopTracks(songs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadArtistData();
  }, [artistName]);

  const handlePlayAll = () => {
    if (topTracks.length > 0) {
      setQueue(topTracks);
      setCurrentIndex(0);
      playSong(topTracks[0]);
    }
  };

  const handleShufflePlay = () => {
    if (topTracks.length > 0) {
      const shuffled = [...topTracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentIndex(0);
      playSong(shuffled[0]);
    }
  };

  const heroImage = topTracks[0]?.thumbnail || "/placeholder.png";

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-10 pb-32 sm:pb-36 relative"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-6 sm:p-10 glass-card backdrop-blur-2xl bg-surface-950/80 border border-white/10 flex flex-col md:flex-row items-center md:items-end gap-8 select-none shadow-2xl shadow-purple-950/30"
      >
        {/* Specular Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70 pointer-events-none" />

        {/* Large Circular Artist Portrait */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/40 via-purple-600/30 to-indigo-600/30 rounded-full blur-xl opacity-90 pointer-events-none" />
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl shadow-purple-950/80 relative bg-surface-900 flex items-center justify-center">
            {heroImage ? (
              <img
                src={heroImage}
                alt={artistName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <Music2 className="w-20 h-20 text-purple-300/40" />
            )}
          </div>
        </div>

        {/* Artist Information Header */}
        <div className="space-y-3 flex-1 min-w-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wider uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Verified Artist
            </span>
            <span className="text-xs font-semibold text-zinc-400">Symphony Canvas</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-sm truncate">
            {artistName}
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-semibold text-zinc-300 flex-wrap">
            <span className="text-purple-300 font-bold">4.8M Monthly Listeners</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 font-medium">Synthwave / R&B / Pop</span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl line-clamp-2 font-medium leading-relaxed">
            Grammy-winning visionary crafting futuristic sonic landscapes, ambient textures, and timeless pop anthems within Symphony's audio space.
          </p>
        </div>
      </motion.div>

      {/* Primary Actions Bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between py-1 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* ▶ Play Main Button */}
          <motion.button
            onClick={handlePlayAll}
            disabled={topTracks.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-950/60 border border-white/20 disabled:opacity-50 transition-all duration-200"
          >
            <Play className="w-5 h-5 ml-0.5 text-white fill-white" fill="white" />
            <span>Play Artist</span>
          </motion.button>

          {/* ❤ Follow Button */}
          <motion.button
            onClick={() => setIsFollowing(!isFollowing)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-full glass-card border transition-all duration-200 text-xs font-bold ${
              isFollowing
                ? "bg-purple-600/30 border-purple-500/40 text-purple-200 shadow-lg shadow-purple-950/40"
                : "border-white/10 hover:border-purple-500/40 text-white hover:bg-purple-600/20"
            }`}
          >
            {isFollowing ? <UserCheck className="w-4 h-4 text-purple-300" /> : <UserPlus className="w-4 h-4" />}
            <span>{isFollowing ? "Following" : "Follow"}</span>
          </motion.button>

          {/* 🔀 Shuffle */}
          <motion.button
            onClick={handleShufflePlay}
            disabled={topTracks.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3.5 rounded-full glass-card border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:bg-purple-600/20 disabled:opacity-50 transition-all duration-200 shadow-md"
            title="Shuffle artist tracks"
          >
            <Shuffle className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            navigator.clipboard?.writeText?.(window.location.href);
            alert("Artist link copied to clipboard!");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white hover:bg-purple-600/20 text-xs font-bold transition-all"
        >
          <Share2 className="w-4 h-4 text-purple-300" />
          Share Profile
        </motion.button>
      </motion.div>

      {/* Popular Songs Section */}
      <motion.section variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Popular Tracks
        </h2>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-sm font-semibold text-purple-300/60">
            Loading popular tracks...
          </div>
        ) : (
          <div className="space-y-2">
            {topTracks.slice(0, 5).map((song, i) => {
              const isCurrent = currentSong?.videoId === song.videoId;

              return (
                <motion.div
                  key={song.videoId || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => {
                    setQueue(topTracks);
                    setCurrentIndex(i);
                    playSong(song);
                  }}
                  className={`grid grid-cols-[32px_1fr_1fr_70px] gap-4 items-center p-3 rounded-2xl glass-card backdrop-blur-xl bg-surface-950/60 border border-white/5 hover:border-purple-500/40 group cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-500/15 ${
                    isCurrent ? "border-purple-500/50 bg-purple-600/20 shadow-purple-950/40" : ""
                  }`}
                >
                  {/* # Index */}
                  <div className="flex items-center justify-center w-8 text-sm font-bold text-zinc-400">
                    {isCurrent && isPlaying ? (
                      <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                    ) : (
                      <>
                        <span className={`group-hover:hidden ${isCurrent ? "text-purple-300" : ""}`}>
                          {i + 1}
                        </span>
                        <Play className="w-4 h-4 text-white fill-white hidden group-hover:block ml-0.5" fill="white" />
                      </>
                    )}
                  </div>

                  {/* Title & Artwork Column */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/5 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-bold truncate tracking-tight transition-colors ${
                          isCurrent ? "text-purple-300" : "text-white group-hover:text-purple-200"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate font-medium mt-0.5">{artistName}</p>
                    </div>
                  </div>

                  {/* Album Name Column */}
                  <p className="text-xs text-zinc-400 font-medium truncate hidden sm:block group-hover:text-zinc-200 transition-colors">
                    {song.album || `${artistName} Collection`}
                  </p>

                  {/* Duration Column */}
                  <div className="flex items-center justify-end pr-2">
                    <span className="text-xs text-zinc-400 font-bold tabular-nums">
                      {song.duration || "--:--"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Albums Showcase Grid */}
      <motion.section variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-black text-white tracking-tight">Discography & Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {topTracks.slice(0, 5).map((item, i) => (
            <MusicCard
              key={item.videoId || i}
              title={item.title}
              artist={artistName}
              thumbnail={item.thumbnail}
              index={i}
              onClick={() => playSong(item)}
            />
          ))}
        </div>
      </motion.section>

      {/* Singles & EPs Showcase */}
      <motion.section variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-black text-white tracking-tight">Singles & EPs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {topTracks.slice(5, 10).map((item, i) => (
            <MusicCard
              key={item.videoId || i}
              title={item.title}
              artist={`${artistName} • Single`}
              thumbnail={item.thumbnail}
              index={i}
              onClick={() => playSong(item)}
            />
          ))}
        </div>
      </motion.section>

      {/* Similar Artists Section */}
      <motion.section variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-black text-white tracking-tight">Similar Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {similarArtistsList.map(({ name, genre, listeners }) => (
            <motion.div
              key={name}
              onClick={() => navigate(`/artist/${encodeURIComponent(name)}`)}
              whileHover={{ y: -4, scale: 1.03 }}
              className="glass-card backdrop-blur-xl bg-surface-950/80 border border-white/10 hover:border-purple-500/40 p-5 rounded-2xl text-center cursor-pointer transition-all duration-300 shadow-xl shadow-purple-950/20 hover:shadow-purple-500/20 group"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <Music2 className="w-8 h-8 text-purple-300/60" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                {name}
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">{genre}</p>
              <span className="inline-block mt-2 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                {listeners} listeners
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Biography Glass Panel */}
      <motion.section variants={itemVariants} className="pt-2">
        <div className="glass-card backdrop-blur-xl bg-surface-950/80 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl shadow-purple-950/20">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-purple-400" />
            About {artistName}
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            Known for cinematic storytelling, ambient synthesizer arrangements, and chart-topping vocals, {artistName} stands as a central figure in modern music. Through Symphony's immersive spatial sound engine, listeners experience these tracks in uncompressed loss-free master clarity.
          </p>
          <div className="flex gap-6 pt-3 border-t border-white/5 text-xs font-semibold text-zinc-400">
            <div>
              <span className="text-purple-300 font-bold block text-sm">4,812,940</span>
              <span>Monthly Listeners</span>
            </div>
            <div>
              <span className="text-white font-bold block text-sm">Global Top 10</span>
              <span>Chart Ranking</span>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
