import time
import shutil
import requests
from pytubefix import YouTube
from yt_dlp import YoutubeDL

_url_cache = {}


def get_audio_url(video_id: str, quality: str = "high"):
    """
    Extract high-fidelity direct audio stream URLs using pytubefix, yt-dlp, and public audio resolvers.
    Uses multi-engine & client fallback strategy with Node.js JS solver to bypass YouTube bot detection on cloud servers.
    """
    if not video_id:
        return None

    quality_key = (quality or "high").lower()

    # If video_id is an iTunes fallback query (yt_Artist Title), resolve it to a real YouTube videoId first
    if isinstance(video_id, str) and video_id.startswith("yt_"):
        try:
            clean_query = urllib.parse.unquote(video_id.replace("yt_", "")).strip()
            if clean_query:
                from src.services.ytmusic_service import search_music
                results = search_music(clean_query, limit=1)
                if results and len(results) > 0 and results[0].get("videoId"):
                    video_id = results[0]["videoId"]
                else:
                    return None
            else:
                return None
        except Exception as e:
            print(f"Failed to resolve iTunes query '{video_id}' to YouTube videoId:", e)
            return None

    url = f"https://www.youtube.com/watch?v={video_id}"

    # Check cache first (TTL: 5 minutes / 300s to prevent YouTube stream token expiration cut-offs)
    cached = _url_cache.get(video_id)
    if cached and (time.time() - cached["timestamp"] < 300):
        return cached["data"]

    # Configure JS runtime if node is present
    has_node = bool(shutil.which("node"))
    js_runtimes = {"node": {}} if has_node else {}

    # Strategy 1: yt-dlp with node JS solver & player client fallback (android/ios first for speed)
    for client in ["android", "ios", "mweb", "web", "android_vr"]:
        ydl_opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
            "nocheckcertificate": True,
            "geo_bypass": True,
            "socket_timeout": 5,
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

    # Strategy 3: Public stream APIs fallback
    stream_apis = [
        f"https://api.piped.privacydev.net/streams/{video_id}",
        f"https://pipedapi.drgns.space/streams/{video_id}",
        f"https://piped-api.garudalinux.org/streams/{video_id}",
        f"https://invidious.drgns.space/api/v1/videos/{video_id}",
        f"https://vid.puffyan.us/api/v1/videos/{video_id}",
        f"https://invidious.lunar.icu/api/v1/videos/{video_id}",
        f"https://inv.riverside.rocks/api/v1/videos/{video_id}",
        f"https://pipedapi.kavin.rocks/streams/{video_id}",
    ]
    for api_url in stream_apis:
        try:
            res = requests.get(api_url, timeout=5)
            if res.status_code == 200:
                data = res.json()
                audio_url = None
                if "audioStreams" in data and data["audioStreams"]:
                    audio_url = data["audioStreams"][0].get("url")
                elif "adaptiveFormats" in data:
                    audio_formats = [f for f in data["adaptiveFormats"] if f.get("type", "").startswith("audio/")]
                    if audio_formats:
                        audio_url = audio_formats[0].get("url")

                if audio_url:
                    res_data = {
                        "title": data.get("title", "Track"),
                        "audio_url": audio_url,
                        "quality": quality_key,
                        "ext": "webm",
                    }
                    _url_cache[video_id] = {"timestamp": time.time(), "data": res_data}
                    return res_data
        except Exception as e:
            print(f"Public API '{api_url}' failed for {video_id}:", e)

    return None