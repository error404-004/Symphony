const API_BASE = "http://127.0.0.1:8000";

export async function getAudio(videoId) {
    const response = await fetch(
        `${API_BASE}/audio/${videoId}`
    );

    if (!response.ok) {
        throw new Error("Failed to load audio");
    }

    return await response.json();
}