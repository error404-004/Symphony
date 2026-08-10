const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://symphony-backend-s7lt.onrender.com";

// Background ping to wake up Render backend cold-start
export function pingBackend() {
    try {
        fetch(`${API_BASE}/health`, { mode: "no-cors" }).catch(() => {});
    } catch (e) {
        /* ignore ping errors */
    }
}

export async function getAudio(videoId, quality = "high") {
    // Strip non-ASCII / emoji characters from quality string to avoid URL encoding mismatch
    const cleanQuality = typeof quality === "string"
        ? quality.replace(/[^\x00-\x7F]/g, "").trim() || "high"
        : "high";

    try {
        // Fast 2.5-second timeout — if Render backend is cold-starting, switch immediately to 0-latency iframe fallback
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

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
        } else {
            console.warn("Backend audio stream fetch timed out after 2.5s, engaging instant iframe playback");
        }
    }

    // Return null → PlayerContext will call playIframeFallback immediately
    return null;
}