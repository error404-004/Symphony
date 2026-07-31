from yt_dlp import YoutubeDL


def get_audio_url(video_id: str, quality: str = "high"):
    """
    Extract high-fidelity direct audio stream URLs using yt-dlp.
    Supports quality formats for Apple Music ALAC / Amazon Ultra HD & Spatial Audio.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"

    quality_key = (quality or "high").lower()

    # Select optimal audio format based on quality spec
    if any(k in quality_key for k in ["spatial", "lossless", "flac", "192khz"]):
        format_spec = "bestaudio[ext=webm]/bestaudio[format_id=251]/bestaudio/best"
    elif any(k in quality_key for k in ["ultra hd", "320kbps", "amazon"]):
        format_spec = "bestaudio[format_id=251]/bestaudio[format_id=140]/bestaudio/best"
    elif any(k in quality_key for k in ["high", "256kbps"]):
        format_spec = "bestaudio[format_id=140]/bestaudio[format_id=250]/bestaudio/best"
    elif any(k in quality_key for k in ["normal", "160kbps"]):
        format_spec = "bestaudio[format_id=250]/bestaudio/best"
    else:
        format_spec = "bestaudio[format_id=249]/bestaudio/best"

    ydl_opts = {
        "format": format_spec,
        "quiet": True,
        "noplaylist": True,
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        return {
            "title": info.get("title"),
            "audio_url": info.get("url"),
            "quality": quality_key,
            "format": info.get("format"),
            "abr": info.get("abr"),
            "asr": info.get("asr"),
            "ext": info.get("ext"),
        }
    except Exception as e:
        print(f"yt-dlp extraction error for video {video_id}:", e)
        # Fallback to standard best audio
        fallback_opts = {"format": "bestaudio/best", "quiet": True, "noplaylist": True}
        with YoutubeDL(fallback_opts) as ydl:
            info = ydl.extract_info(url, download=False)
        return {
            "title": info.get("title"),
            "audio_url": info.get("url"),
            "quality": "fallback",
        }