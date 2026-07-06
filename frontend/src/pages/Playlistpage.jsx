    import { useParams, useNavigate } from "react-router-dom";
    import { Trash2 , X } from "lucide-react";
    import usePlayer from "../hooks/usePlayer";

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
        <div className="p-10">
            Playlist not found.
        </div>
        );
    }

    return (
        <div className="space-y-8">

        {/* Header */}
        <div>
            <h1 className="text-5xl font-bold">
            {playlist.name}
            </h1>

            <p className="text-surface-500 mt-2">
            {playlist.songs.length} songs
            </p>
            <button
                onClick={() => {
                    if (window.confirm("Delete this playlist?")) {
                        deletePlaylist(playlist.id);
                        navigate("/library");
                    }
                }}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition"
        >
                <Trash2 className="w-4 h-4" />
                Delete Playlist
            </button>
        </div>

        {/* Temporary Testing Button */}
        <button
            onClick={() => {
            if (!currentSong) return;

            addSongToPlaylist(
                playlist.id,
                currentSong
            );
            }}
            className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
        >
            Add Current Song
        </button>

        {/* Songs */}
        {playlist.songs.length === 0 ? (

            <div className="rounded-xl border border-dashed border-surface-700 p-12 text-center">
            No songs yet.
            </div>

        ) : (

            <div className="space-y-2">

            {playlist.songs.map((song) => (

                <div
                key={song.videoId}
                onClick={() => {
                    console.log("Clicked:", song.title);
                    playSong(song);
                }}
                className="flex items-center gap-4 p-3 rounded-xl bg-surface-800 cursor-pointer hover:bg-surface-700 transition"
                >

                <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-14 h-14 rounded-lg"
                />

                <div className="flex-1">

                    <p className="font-semibold text-white">
                        {song.title}
                    </p>

                    <p className="text-surface-500">
                        {song.artist}
                    </p>

                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();

                        removeSongFromPlaylist(
                            playlist.id,
                            song.videoId
                        );
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-surface-500 hover:text-red-400 transition"
                >
                    <X className="w-4 h-4" />
                </button>

                </div>
                
            ))}

            </div>

        )}

        </div>
    );
    }