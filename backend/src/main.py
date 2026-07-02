from fastapi import FastAPI

app = FastAPI(
    title="Symphony API",
    description="Backend API for Symphony Music Player",
    version="1.0.0"
)


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