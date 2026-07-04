from fastapi import APIRouter
from src.services.audio_service import get_audio_url

router = APIRouter()


@router.get("/audio/{video_id}")
def get_audio(video_id: str):
    return get_audio_url(video_id)