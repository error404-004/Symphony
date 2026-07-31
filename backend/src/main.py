import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.search import router as search_router
from src.routes import audio

app = FastAPI(
    title="Symphony API",
    description="Backend API for Symphony Music Player",
    version="1.0.0"
)

frontend_url = os.getenv("FRONTEND_URL", "").strip()
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

if frontend_url:
    for url in frontend_url.split(","):
        cleaned = url.strip()
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if frontend_url == "*" else origins,
    allow_credentials=True if frontend_url != "*" else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search_router)
app.include_router(audio.router)


@app.get("/")
def home():
    return {
        "status": "running",
        "message": "Welcome to Symphony API 🎵"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }