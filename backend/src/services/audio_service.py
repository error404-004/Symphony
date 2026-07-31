from yt_dlp import YoutubeDL


def get_audio_url(video_id: str, quality: str = "high"):
    """
    Extract high-fidelity direct audio stream URLs using yt-dlp.
    Uses embedded player clients to bypass YouTube datacenter bot detection.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"
    quality_key = (quality or "high").lower()

    # Embedded player clients bypass YouTube's datacenter IP bot verification
    client_list = ["tv_embedded", "android_embedded", "ios_embedded", "mweb_embedded", "android", "mweb"]

    for client in client_list:
        ydl_opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
            "extractor_args": {
                "youtube": {
                    "player_client": [client]
                }
            }
        }
        try:
            with YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if info and info.get("url"):
                    return {
                        "title": info.get("title"),
                        "audio_url": info.get("url"),
                        "quality": quality_key,
                        "format": info.get("format"),
                        "abr": info.get("abr"),
                        "asr": info.get("asr"),
                        "ext": info.get("ext", "webm"),
                    }
        except Exception as e:
            print(f"yt-dlp attempt for {video_id} with client '{client}' failed:", e)

    # Final fallback attempt
    try:
        fallback_opts = {"format": "bestaudio/best", "quiet": True, "noplaylist": True}
        with YoutubeDL(fallback_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if info and info.get("url"):
                return {
                    "title": info.get("title"),
                    "audio_url": info.get("url"),
                    "quality": "fallback",
                    "ext": info.get("ext", "webm"),
                }
    except Exception as e:
        print(f"Ultimate fallback for video {video_id} failed:", e)

    return None