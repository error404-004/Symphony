    import { useParams, useNavigate } from "react-router-dom";
    import { Trash2 , X, Music2, Play, Plus } from "lucide-react";
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
        addSongToPlaylist,
        playSong,
        deletePlaylist,
        removeSongFromPlaylist,
    } = usePlayer();

    const playlist = playlists.find(
        (p) => String(p.id) === id
    );

    if (!playlist) {
        return (
        <div className="flex flex-col items-center justify-center py-20">
            <Music2 className="w-16 h-16 text-[#B3B3B3]/20 mb-4" />
            <p className="text-xl font-semibold text-white">Playlist not found.</p>
            <p className="text-[#B3B3B3] text-sm mt-2">This playlist may have been deleted.</p>
        </div>
        );
    }

    return (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >

        {/* Header */}
        <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden p-8">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 via-primary-800/10 to-[#0D0D0D] z-0" />
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-500/[0.06] rounded-full blur-[80px] z-0" />

            <div className="relative z-10">
                <p className="text-xs uppercase tracking-widest text-primary-300 font-semibold mb-2">Playlist</p>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                    {playlist.name}
                </h1>

                <p className="text-[#B3B3B3] mt-1 text-sm">
                    {playlist.songs.length} songs
                </p>

                <div className="flex items-center gap-3 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (window.confirm("Delete this playlist?")) {
                                deletePlaylist(playlist.id);
                                navigate("/library");
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-sm font-medium transition-all duration-200"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Playlist
                    </motion.button>
                </div>
            </div>
        </motion.div>

        {/* Add Current Song Button */}
        <motion.div variants={itemVariants}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                    if (!currentSong) return;

                    addSongToPlaylist(
                        playlist.id,
                        currentSong
                    );
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200"
            >
                <Plus className="w-4 h-4" />
                Add Current Song
            </motion.button>
        </motion.div>

        {/* Songs */}
        <motion.div variants={itemVariants}>
        {playlist.songs.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-12 text-center">
                <Music2 className="w-14 h-14 mx-auto text-[#B3B3B3]/20 mb-4" />
                <h3 className="text-lg font-semibold text-white">No songs yet</h3>
                <p className="text-[#B3B3B3] text-sm mt-2">Play a song and click "Add Current Song" to get started.</p>
            </div>

        ) : (

            <div className="space-y-1.5">

            {playlist.songs.map((song, i) => (

                <motion.div
                    key={song.videoId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                        console.log("Clicked:", song.title);
                        playSong(song);
                    }}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-[#181818]/60 cursor-pointer hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group shadow-md shadow-black/10"
                >

                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-md shadow-black/20">
                    <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" fill="currentColor" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">

                    <p className="font-semibold text-white text-sm truncate group-hover:text-primary-300 transition-colors duration-200">
                        {song.title}
                    </p>

                    <p className="text-[#B3B3B3] text-sm truncate">
                        {song.artist}
                    </p>

                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();

                        removeSongFromPlaylist(
                            playlist.id,
                            song.videoId
                        );
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/15 text-[#B3B3B3]/50 hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                    <X className="w-4 h-4" />
                </motion.button>

                </motion.div>
                
            ))}

            </div>

        )}
        </motion.div>

        </motion.div>
    );
    }