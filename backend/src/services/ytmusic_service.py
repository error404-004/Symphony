from ytmusicapi import YTMusic

ytmusic = YTMusic()


def search_music(query: str, limit: int = 10):
    """
    Search songs on YouTube Music with safe null checks.
    """
    try:
        results = ytmusic.search(
            query=query,
            filter="songs",
            limit=limit
        )

        songs = []

        for song in results:
            if not isinstance(song, dict):
                continue

            # Safe extraction of artists
            artists = song.get("artists") or []
            artist_name = "Unknown Artist"
            if isinstance(artists, list) and len(artists) > 0 and isinstance(artists[0], dict):
                artist_name = artists[0].get("name") or "Unknown Artist"

            # Safe extraction of album
            album = song.get("album")
            album_name = "Single"
            if isinstance(album, dict):
                album_name = album.get("name") or "Single"

            # Safe extraction of thumbnails
            thumbnails = song.get("thumbnails") or []
            thumbnail_url = ""
            if isinstance(thumbnails, list) and len(thumbnails) > 0:
                last_thumb = thumbnails[-1]
                if isinstance(last_thumb, dict):
                    thumbnail_url = last_thumb.get("url") or ""

            songs.append({
                "videoId": song.get("videoId"),
                "title": song.get("title") or "Untitled",
                "artist": artist_name,
                "album": album_name,
                "duration": song.get("duration") or "--:--",
                "thumbnail": thumbnail_url
            })

        return songs

    except Exception as e:
        print(f"ytmusic search error for '{query}':", e)
        return []