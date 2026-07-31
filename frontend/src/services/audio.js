const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://symphony-backend-s7lt.onrender.com";

export async function getAudio(videoId, quality = "high") {
    const response = await fetch(
        `${API_BASE}/audio/${videoId}?quality=${encodeURIComponent(quality)}`
    );

    if (!response.ok) {
        throw new Error("Failed to load audio");
    }

    return await response.json();
}