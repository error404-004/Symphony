const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://symphony-backend-s7lt.onrender.com";

export async function getAudio(videoId, quality = "high") {
    // Strip non-ASCII / emoji characters from quality string to avoid URL encoding mismatch
    const cleanQuality = typeof quality === "string"
        ? quality.replace(/[^\x00-\x7F]/g, "").trim() || "high"
        : "high";

    try {
        // 3-second timeout — Render free tier sleeps and can take 30-60s to wake up.
        // We don't wait that long; just fall back to iframe immediately.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(
            `${API_BASE}/audio/${videoId}?quality=${encodeURIComponent(cleanQuality)}`,
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data && data.audio_url) {
                return data;
            }
        }
    } catch (e) {
        if (e.name !== "AbortError") {
            console.warn("Backend audio fetch error, using iframe fallback:", e);
        }
        // AbortError = timeout — silently fall through to iframe
    }

    // Return null → PlayerContext will call playIframeFallback immediately
    return null;
}