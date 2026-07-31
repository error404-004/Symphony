const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function getAudio(videoId, quality = "high") {
    const response = await fetch(
        `${API_BASE}/audio/${videoId}?quality=${encodeURIComponent(quality)}`
    );

    if (!response.ok) {
        throw new Error("Failed to load audio");
    }

    return await response.json();
}