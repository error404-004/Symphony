import urllib.parse
import requests
from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import StreamingResponse
from yt_dlp import YoutubeDL
from src.services.audio_service import get_audio_url

router = APIRouter()

url_cache = {}


@router.get("/audio_debug/{video_id}")
def debug_audio(video_id: str):
    url = f"https://www.youtube.com/watch?v={video_id}"
    logs = []
    
    test_configs = [
        {"name": "android_only", "args": {"youtube": {"player_client": ["android"]}}},
        {"name": "tv_only", "args": {"youtube": {"player_client": ["tv"]}}},
        {"name": "mweb_only", "args": {"youtube": {"player_client": ["mweb"]}}},
        {"name": "ios_only", "args": {"youtube": {"player_client": ["ios"]}}},
        {"name": "android_creator", "args": {"youtube": {"player_client": ["android_creator"]}}},
        {"name": "web_creator", "args": {"youtube": {"player_client": ["web_creator"]}}},
    ]
    
    for item in test_configs:
        opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
            "nocheckcertificate": True,
            "geo_bypass": True,
            "extractor_args": item["args"]
        }
        try:
            with YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if info and info.get("url"):
                    return {
                        "status": "success",
                        "config_name": item["name"],
                        "title": info.get("title"),
                        "audio_url": info.get("url")[:100] + "..."
                    }
        except Exception as e:
            logs.append(f"Config '{item['name']}' failed: {type(e).__name__}: {str(e)}")

    return {"status": "failed", "logs": logs}


@router.get("/audio/{video_id}")
def get_audio(video_id: str, request: Request, quality: str = "high"):
    clean_quality = urllib.parse.unquote(quality or "high").strip()
    try:
        data = get_audio_url(video_id, quality=clean_quality)
        if data and data.get("audio_url"):
            cache_key = f"{video_id}_{clean_quality.lower()}"
            url_cache[cache_key] = data["audio_url"]
            base_url = str(request.base_url).rstrip("/")
            encoded_q = urllib.parse.quote(clean_quality)
            data["audio_url"] = f"{base_url}/audio/stream/{video_id}?quality={encoded_q}"
            return data
    except Exception as e:
        print(f"Error fetching audio metadata for {video_id}:", e)

    raise HTTPException(status_code=404, detail="Audio stream not found for track")


@router.get("/audio/stream/{video_id}")
def stream_audio(video_id: str, request: Request, quality: str = "high"):
    clean_quality = urllib.parse.unquote(quality or "high").strip()
    cache_key = f"{video_id}_{clean_quality.lower()}"
    direct_url = url_cache.get(cache_key)

    if not direct_url:
        data = get_audio_url(video_id, quality=clean_quality)
        direct_url = data.get("audio_url") if data else None
        if direct_url:
            url_cache[cache_key] = direct_url

    if not direct_url:
        raise HTTPException(status_code=404, detail="Audio URL not found")

    req_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    }

    range_header = request.headers.get("range")
    if range_header:
        req_headers["Range"] = range_header

    try:
        upstream_res = requests.get(direct_url, headers=req_headers, stream=True, timeout=15)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to connect to media host: {str(e)}")

    if upstream_res.status_code == 403:
        data = get_audio_url(video_id, quality=clean_quality)
        direct_url = data.get("audio_url") if data else None
        if direct_url:
            url_cache[cache_key] = direct_url
            try:
                upstream_res = requests.get(direct_url, headers=req_headers, stream=True, timeout=15)
            except Exception as e:
                raise HTTPException(status_code=502, detail=f"Failed to reconnect to media host: {str(e)}")

    def stream_generator():
        for chunk in upstream_res.iter_content(chunk_size=64 * 1024):
            if chunk:
                yield chunk

    response_headers = {
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Expose-Headers": "Content-Length, Content-Range, Content-Type",
    }

    for header in ["Content-Type", "Content-Length", "Content-Range"]:
        if header in upstream_res.headers:
            response_headers[header] = upstream_res.headers[header]

    return StreamingResponse(
        stream_generator(),
        status_code=upstream_res.status_code,
        headers=response_headers,
        media_type=upstream_res.headers.get("Content-Type", "audio/webm")
    )