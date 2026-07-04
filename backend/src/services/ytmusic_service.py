from ytmusicapi import YTMusic

ytmusic = YTMusic()


def search_music(query: str, limit: int = 10):
    """
    Search songs on YouTube Music.
    """

    try:
        results = ytmusic.search(
            query=query,
            filter="songs",
            limit=limit
        )

        songs = []

        for song in results:
            songs.append({
                "videoId": song.get("videoId"),
                "title": song.get("title"),
                "artist": song.get("artists", [{}])[0].get("name"),
                "album": song.get("album", {}).get("name"),
                "duration": song.get("duration"),
                "thumbnail": song.get("thumbnails", [{}])[-1].get("url")
            })

        return songs

    except Exception as e:
        return {
            "error": str(e)
        }