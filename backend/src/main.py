from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.search import router as search_router
from src.routes import audio
app = FastAPI(
    title="Symphony API",
    description="Backend API for Symphony Music Player",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
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