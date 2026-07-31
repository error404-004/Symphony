from pytubefix import YouTube
from yt_dlp import YoutubeDL


def get_audio_url(video_id: str, quality: str = "high"):
    """
    Extract high-fidelity direct audio stream URLs using pytubefix & yt-dlp.
    Uses multi-engine & client fallback strategy to bypass YouTube bot detection on cloud servers.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"
    quality_key = (quality or "high").lower()

    # Strategy 1: Try pytubefix (WEB, MWEB, TV, ANDROID)
    for client in ["WEB", "MWEB", "TV", "ANDROID"]:
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

    # Strategy 2: yt-dlp fallback
    client_list = ["tv_embedded", "android_embedded", "ios_embedded", "mweb_embedded", "android", "mweb"]
    for client in client_list:
        ydl_opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
            "nocheckcertificate": True,
            "geo_bypass": True,
            "extractor_args": {"youtube": {"player_client": [client]}}
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

    return None