const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://symphony-backend-s7lt.onrender.com";

// In-memory search cache for 0ms instant cached lookups
const searchCache = new Map();

function formatTimeFromMs(ms) {
    if (!ms || isNaN(ms)) return "3:30";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Ultra-fast iTunes Public Search fallback (<100ms response time, 0 cold-starts, 0 CORS restrictions)
async function searchITunesFallback(query, limit = 10) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`,
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
            const data = await res.json();
            const results = data.results || [];
            if (results.length > 0) {
                return results.map((item) => ({
                    videoId: `yt_${encodeURIComponent(item.artistName + " " + item.trackName)}`,
                    title: item.trackName,
                    artist: item.artistName,
                    author: item.artistName,
                    album: item.collectionName || "Symphony Singles",
                    thumbnail: item.artworkUrl100 ? item.artworkUrl100.replace("100x100bb", "600x600bb") : "/logo.png",
                    cover: item.artworkUrl100 ? item.artworkUrl100.replace("100x100bb", "600x600bb") : "/logo.png",
                    duration: formatTimeFromMs(item.trackTimeMillis),
                }));
            }
        }
    } catch (e) {
        /* fallback to empty array */
    }
    return [];
}

export async function searchMusic(query, limit = 10) {
    if (!query || !query.trim()) return [];

    const cacheKey = `${query.trim().toLowerCase()}_${limit}`;
    if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey);
    }

    try {
        // Fast 2.2-second timeout on primary Render backend
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);

        const response = await fetch(
            `${API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`,
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            const songsList = Array.isArray(data) ? data : data.songs || [];
            if (songsList.length > 0) {
                searchCache.set(cacheKey, songsList);
                return songsList;
            }
        }
    } catch (err) {
        console.warn("Primary search backend pending cold-start, engaging instant high-speed iTunes API fallback...");
    }

    // High-speed <100ms search fallback
    const fallbackResults = await searchITunesFallback(query, limit);
    if (fallbackResults.length > 0) {
        searchCache.set(cacheKey, fallbackResults);
        return fallbackResults;
    }

    return [];
}