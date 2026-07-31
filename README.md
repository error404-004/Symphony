<div align="center">

# 🎵 Symphony Music Player

**A State-of-the-Art, High-Performance Streaming & Control Center built with React 19, FastAPI, and YouTube Music.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

[Features](#-key-features) • [Master Audio Engine](#-master-audio--dsp-engine) • [Architecture](#-architecture-overview) • [Installation](#-getting-started) • [API Documentation](#-api-endpoints) • [Keyboard Shortcuts](#-keyboard-shortcuts)

---

</div>

## ✨ Overview

**Symphony** is an ultra-modern, glassmorphic music application designed to provide a premium soundscape listening experience. It features real-time search powered by YouTube Music (`ytmusicapi`), high-fidelity audio extraction (`yt-dlp`), a custom WebAudio Master DSP processing engine, synchronized lyrics via LRCLIB, an interactive control center, continuous genre radio autoplay, and session authentication.

---

## 🚀 Key Features

- **🎨 Symphony Design Language (SDL)**: Ultra-sleek glassmorphic UI (`backdrop-blur-3xl`), glowing radial ambient backgrounds, specular hair lines, and fluid Framer Motion animations.
- **👑 Master Audio & WebAudio DSP Engine**: Real-time 3D spatial expansion, sub-bass warmth boost, studio treble lift, and dynamic range mastering compressor.
- **📻 Continuous Genre Autoplay & Dynamic Radio**: Automatically detects music genre and continuously plays top tracks from **different artists, authors, and albums** when the queue ends.
- **🔐 Glassmorphic Auth Suite**: Full-screen authentication system (`LoginPage.jsx`) featuring Sign In, Create Account, preferred music vibe selection, and 1-Click Guest Demo Entry.
- **🔎 Spotify-Style Recent Searches Bar**: Instant search history drop-down with solid high-contrast panel, item removal, and real-time suggestion filtering.
- **🚫 "Don't Recommend" Context Menu**: Hide tracks directly from home recommendations with instant real-time list updating and persistent storage.
- **🎤 Synchronized Live Lyrics Canvas**: Fullscreen lyrics view powered by LRCLIB with automatic LRC parsing, multi-tiered search fallback, and script normalization (Gurmukhi-to-Devanagari converter).
- **👤 Dedicated Explorer-Style Profile**: Personalized profile view displaying user stats, public playlists, top liked tracks, and customizable avatar gradient themes.
- **⚙️ Interactive Settings Control Center**: Persistent preferences for audio quality profiles, volume normalization, visual themes (Dark, Midnight, AMOLED, Cyberpunk), accent colors, and data management.
- **📁 Playlists & Favorites**: Create, edit, and manage custom playlists and liked songs with local storage persistence.
- **⌨️ Keyboard Navigation**: Keyboard shortcuts for fast playback control (`Space`, `N`, `P`, `/`).

---

## 🎛️ Master Audio & DSP Engine

Symphony incorporates an in-memory **WebAudio API Processing Graph** with custom studio mastering profiles:

| Profile Label | Tech Specs | Sound Characteristics |
| :--- | :--- | :--- |
| 👑 **Symphony Spatial 3D Master** | `48kHz / 32-bit DSP` | 3D binaural soundstage, sub-bass warmth & master compression |
| 💎 **Studio Lossless Master** | `192kHz / 24-bit FLAC` | Bit-perfect uncompressed studio monitor reference sound |
| 🔥 **Ultra HD Dynamic Pulse** | `320kbps Opus / AAC` | Punchy 6dB sub-bass boost & crisp high-end treble lift |
| 🎵 **High Fidelity Clarity** | `256kbps AAC / Opus` | Full fidelity balanced studio response |
| 📉 **Data Saver** | `96kbps Opus` | Low-bandwidth mode for slow network connections |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **DSP Processing**: WebAudio API (`AudioContext`, `BiquadFilterNode`, `StereoPannerNode`, `DynamicCompressorNode`)
- **Lyrics Service**: LRCLIB API Integration + Custom LRC Parser

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **Music Search Engine**: `ytmusicapi`
- **Stream Extractor**: `yt-dlp`
- **Middleware**: CORSMiddleware

---

## 📐 Architecture Overview

```
                        ┌────────────────────────────────────────┐
                        │            Symphony Web UI             │
                        │     (React 19 + WebAudio DSP Engine)   │
                        └──────────────────┬─────────────────────┘
                                           │
                                  REST API / HTTP
                                           │
                        ┌──────────────────▼─────────────────────┐
                        │          FastAPI Backend               │
                        │            (Port 8000)                 │
                        └────────┬──────────────────────┬────────┘
                                 │                      │
                   ┌─────────────▼──────────┐ ┌─────────▼───────────┐
                   │    ytmusicapi Service  │ │    yt-dlp Extractor │
                   │  (Search & Metadata)   │ │ (Direct Stream URL) │
                   └────────────────────────┘ └─────────────────────┘
```

> 📖 For an in-depth breakdown of system components, state management, and sequence diagrams, refer to [docs/architecture.md](docs/architecture.md).

---

## 📁 Repository Structure

```
Symphony/
├── backend/                  # FastAPI Python Service
│   ├── src/
│   │   ├── main.py           # FastAPI entry point & CORS configuration
│   │   ├── routes/           # API route handlers (/search, /audio)
│   │   └── services/         # Music search & yt-dlp audio services
│   └── requirements.txt      # Python backend dependencies
├── frontend/                 # Vite + React Web Application
│   ├── src/
│   │   ├── components/       # UI Components (MusicPlayer, TopNav, Sidebar, LyricsPanel)
│   │   ├── context/          # Global PlayerContext & WebAudio DSP Provider
│   │   ├── hooks/            # Custom hooks (usePlayer)
│   │   ├── layouts/          # Main Shell Layout
│   │   ├── pages/            # App Views (HomePage, SearchPage, LibraryPage, ProfilePage, SettingsPage, LoginPage)
│   │   ├── services/         # API clients & LRCLIB lyrics service
│   │   └── utils/            # LRC Parser & helper utilities
│   └── package.json          # Node dependencies & Vite scripts
└── docs/                     # Project documentation & architecture guides
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **Git**

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI dev server
uvicorn src.main:app --reload --port 8000
```

The backend server will run at `http://127.0.0.1:8000`.

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status check |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/search?query={q}&limit={n}` | Search songs via YouTube Music |
| `GET` | `/audio/{video_id}?quality={q}` | Extract direct stream audio URL via `yt-dlp` based on quality profile |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Toggle Play / Pause |
| <kbd>/</kbd> | Focus Top Navigation Search bar |
| <kbd>N</kbd> | Play Next Track |
| <kbd>P</kbd> | Play Previous Track |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.

---

<div align="center">
  <sub>Crafted with passion for futuristic audio experiences. Powered by Symphony.</sub>
</div>
