const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://symphony-backend-s7lt.onrender.com";

export async function getAudio(videoId, quality = "high") {
    // Strip non-ASCII / emoji characters from quality string to avoid URL encoding mismatch
    const cleanQuality = typeof quality === "string"
        ? quality.replace(/[^\x00-\x7F]/g, "").trim() || "high"
        : "high";

    try {
        const response = await fetch(
            `${API_BASE}/audio/${videoId}?quality=${encodeURIComponent(cleanQuality)}`
        );

        if (response.ok) {
            const data = await response.json();
            if (data && data.audio_url) {
                return data;
            }
        }
    } catch (e) {
        console.warn("Backend audio stream fetch error, falling back to stream proxy:", e);
    }

    // Direct proxy stream URL fallback
    return {
        title: "Track",
        audio_url: `${API_BASE}/audio/stream/${videoId}?quality=${encodeURIComponent(cleanQuality)}`,
        quality: cleanQuality
    };
}