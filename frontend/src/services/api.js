const API_BASE = "http://127.0.0.1:8000";

export async function searchMusic(query, limit = 10) {
    const response = await fetch(
        `${API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch songs");
    }

    return await response.json();
}