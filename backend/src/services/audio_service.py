import time
import shutil
from pytubefix import YouTube
from yt_dlp import YoutubeDL

_url_cache = {}


def get_audio_url(video_id: str, quality: str = "high"):
    """
    Extract high-fidelity direct audio stream URLs using pytubefix & yt-dlp.
    Uses multi-engine & client fallback strategy with Node.js JS solver to bypass YouTube bot detection on cloud servers.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"
    quality_key = (quality or "high").lower()

    # Check cache first
    cached = _url_cache.get(video_id)
    if cached and (time.time() - cached["timestamp"] < 3600):
        return cached["data"]

    # Configure JS runtime if node is present
    has_node = bool(shutil.which("node"))
    js_runtimes = {"node": {}} if has_node else {}

    # Strategy 1: yt-dlp with node JS solver & player client fallback
    for client in ["android_vr", "android", "ios", "mweb", "web"]:
        ydl_opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
            "nocheckcertificate": True,
            "geo_bypass": True,
            "extractor_args": {"youtube": {"player_client": [client]}}
        }
        if js_runtimes:
            ydl_opts["js_runtimes"] = js_runtimes

        try:
            with YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if info and info.get("url"):
                    res_data = {
                        "title": info.get("title"),
                        "audio_url": info.get("url"),
                        "quality": quality_key,
                        "format": info.get("format"),
                        "abr": info.get("abr"),
                        "asr": info.get("asr"),
                        "ext": info.get("ext", "webm"),
                    }
                    _url_cache[video_id] = {"timestamp": time.time(), "data": res_data}
                    return res_data
        except Exception as e:
            print(f"yt-dlp attempt for {video_id} with client '{client}' failed:", e)

    # Strategy 2: pytubefix fallback
    for client in ["WEB", "MWEB", "TV", "ANDROID"]:
        try:
            yt = YouTube(url, client=client)
            stream = yt.streams.filter(only_audio=True).order_by("abr").desc().first()
            if stream and stream.url:
                res_data = {
                    "title": getattr(yt, "title", "Track"),
                    "audio_url": stream.url,
                    "quality": quality_key,
                    "ext": getattr(stream, "subtype", "webm"),
                }
                _url_cache[video_id] = {"timestamp": time.time(), "data": res_data}
                return res_data
        except Exception as e:
            print(f"pytubefix client '{client}' failed for {video_id}:", e)

    return None