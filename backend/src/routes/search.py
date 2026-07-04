from fastapi import APIRouter
from src.services.ytmusic_service import search_music

router = APIRouter()


@router.get("/search")
def search(query: str, limit: int = 10):
    return search_music(query, limit)