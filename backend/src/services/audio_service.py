from yt_dlp import YoutubeDL

try:
    from pytubefix import YouTube
except ImportError:
    YouTube = None


def get_audio_url(video_id: str, quality: str = "high"):
    """
    Extract high-fidelity direct audio stream URLs using pytubefix & yt-dlp.
    Uses multi-engine & client fallback strategy to bypass YouTube bot detection on cloud servers.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"
    quality_key = (quality or "high").lower()

    # Strategy 1: Try pytubefix clients
    if YouTube:
        for client in ["ANDROID", "WEB", "IOS", "MWEB", "TV"]:
            try:
                yt = YouTube(url, client=client)
                stream = yt.streams.filter(only_audio=True).order_by("abr").desc().first()
                if stream and stream.url:
                    return {
                        "title": getattr(yt, "title", "Track"),
                        "audio_url": stream.url,
                        "quality": quality_key,
                        "ext": getattr(stream, "subtype", "webm"),
                    }
            except Exception as e:
                print(f"pytubefix attempt for {video_id} with client '{client}' failed:", e)

    # Strategy 2: yt-dlp with custom headers and client configurations
    for client in ["android", "ios", "mweb", "web"]:
        ydl_opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
            "nocheckcertificate": True,
            "geo_bypass": True,
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
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

    # Strategy 3: Ultimate standard fallback
    try:
        fallback_opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
            "nocheckcertificate": True,
            "geo_bypass": True
        }
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