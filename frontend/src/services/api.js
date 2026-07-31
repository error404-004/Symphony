const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://symphony-backend-s7lt.onrender.com";

export async function searchMusic(query, limit = 10) {
    const response = await fetch(
        `${API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch songs");
    }

    return await response.json();
}