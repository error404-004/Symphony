const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://symphony-backend-s7lt.onrender.com";

const PIPED_INSTANCES = [
    "https://pipedapi.kavin.rocks",
    "https://api.piped.private.coffee",
    "https://pipedapi.in.projectsegfau.lt",
];

// Direct client-side stream extractor from Piped CDN instances
async function fetchPipedStream(videoId) {
    for (const instance of PIPED_INSTANCES) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${instance}/streams/${videoId}`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                const streams = data.audioStreams || [];
                if (streams.length > 0) {
                    // Pick best quality audio stream
                    streams.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                    return { audio_url: streams[0].url };
                }
            }
        } catch (e) {
            /* try next instance */
        }
    }
    return null;
}

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
        // Fast 2-second timeout on primary Render backend
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

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
        console.warn("Primary backend stream pending, trying high-speed Piped audio fallback...");
    }

    // Try high-speed Piped direct audio stream fallback (200ms response time)
    const pipedData = await fetchPipedStream(videoId);
    if (pipedData && pipedData.audio_url) {
        return pipedData;
    }

    // Return null → PlayerContext will engage embedded YouTube player as final fallback
    return null;
}