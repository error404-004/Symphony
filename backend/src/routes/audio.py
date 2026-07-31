import requests
from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import StreamingResponse
from src.services.audio_service import get_audio_url

router = APIRouter()

url_cache = {}


@router.get("/audio/{video_id}")
def get_audio(video_id: str, request: Request, quality: str = "high"):
    data = get_audio_url(video_id, quality=quality)
    if data and data.get("audio_url"):
        cache_key = f"{video_id}_{quality.lower()}"
        url_cache[cache_key] = data["audio_url"]
        base_url = str(request.base_url).rstrip("/")
        # Return proxied stream URL so browser audio tag loads via CORS proxy
        data["audio_url"] = f"{base_url}/audio/stream/{video_id}?quality={quality}"
    return data


@router.get("/audio/stream/{video_id}")
def stream_audio(video_id: str, request: Request, quality: str = "high"):
    cache_key = f"{video_id}_{quality.lower()}"
    direct_url = url_cache.get(cache_key)

    if not direct_url:
        data = get_audio_url(video_id, quality=quality)
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
        upstream_res = requests.get(direct_url, headers=req_headers, stream=True, timeout=10)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to connect to media host: {str(e)}")

    if upstream_res.status_code == 403:
        data = get_audio_url(video_id, quality=quality)
        direct_url = data.get("audio_url") if data else None
        if direct_url:
            url_cache[cache_key] = direct_url
            upstream_res = requests.get(direct_url, headers=req_headers, stream=True, timeout=10)

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