# VoxText AI

**Free & Open-Source YouTube Transcript Generator and Video Downloader**

> **Purpose:** Main project entry point and navigation hub for all VoxText AI documentation.
> **Audience:** Developers, contributors, end-users, and stakeholders.
> **Last Updated:** 2026-02-12
> **Version:** 0.1.0

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Supported Limits](#supported-limits)
- [Tech Stack](#tech-stack)
- [Architecture Summary](#architecture-summary)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Summary](#api-summary)
- [User Flows](#user-flows)
- [Language Detection](#language-detection)
- [Error Handling](#error-handling)
- [Security and Privacy](#security-and-privacy)
- [Documentation Index](#documentation-index)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Open Source and Community](#open-source-and-community)
- [Disclaimer](#disclaimer)

---

## Overview

VoxText AI converts YouTube videos into downloadable transcripts and lets you download videos and audio — all for free, with no sign-ups or paywalls. Paste a YouTube URL and get instant transcripts in DOCX, TXT, or SRT format, or download the video in MP4 (720p / 480p / 360p / 240p) and MP3.

VoxText AI is fully open-source, privacy-focused, and designed to run on low-resource infrastructure. Language detection is powered entirely by open-source metadata from YouTube and `yt-dlp` — no Whisper, no proprietary speech-to-text APIs.

**Live Frontend:** [https://voxtext-ai.pages.dev/](https://voxtext-ai.pages.dev/)

---

## Key Features

| Feature | Description |
|---|---|
| **YouTube Transcript Generation** | Extract captions from any YouTube video and export as DOCX, TXT, or SRT. Supports manual and auto-generated captions. |
| **Video and Audio Download** | Download YouTube videos in MP4 (720p HD, 480p, 360p, 240p) or audio in MP3 with estimated file sizes shown before download. |
| **60+ Output Languages** | Auto-detects video language; supports translation to 60+ languages via Google Translate fallback when YouTube rate-limits translated caption tracks. |
| **Intelligent Language Detection** | 5-level priority detection using title keyword parsing, Unicode script analysis, video tags, YouTube Studio metadata, and ASR caption language — no Whisper or audio analysis. |
| **Privacy-First** | No user accounts, no sign-ups, no personal data stored. Temporary files are deleted after each request. |
| **Session Persistence** | Browser session storage preserves your progress across page refreshes. |
| **Video Preview** | Embedded YouTube player with play/pause controls and thumbnail fallback for non-embeddable videos. |
| **Open Source** | MIT License — fully auditable, self-hostable, community-driven. |

---

## Supported Limits

The backend enforces duration limits per quality tier to manage server resources:

| Quality | Format | Max Duration | Use Case |
|---|---|---|---|
| 720p HD | MP4 | 45 minutes | Short to medium videos, high quality |
| 480p | MP4 | 60 minutes | Standard quality, longer content |
| 360p | MP4 | 120 minutes | Lectures, long-form content |
| 240p | MP4 | 120 minutes | Low bandwidth, maximum duration |
| Audio Only | MP3 | 60 minutes | Podcasts, music, audio extraction |

Additional constraints:

- Transcripts depend on YouTube caption availability; videos without captions cannot generate transcripts.
- Live streams are detected and both transcript and download actions are disabled.
- Playlist URLs are not supported (single video only via `noplaylist: True`).

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React | 18.3.1 | UI framework |
| **Language** | TypeScript | - | Type-safe frontend code |
| **Bundler** | Vite | 6.3.5 | Fast dev server and build tool |
| **Styling** | Tailwind CSS | 4.1.12 | Utility-first CSS framework |
| **UI Components** | Radix UI | Various | Accessible component primitives |
| **Icons** | Lucide React | 0.487.0 | Icon library |
| **Animation** | Motion (Framer) | 12.23.24 | UI animations |
| **Backend** | Flask | 3.1+ | Python REST API server |
| **CORS** | flask-cors | 6.0+ | Cross-origin resource sharing |
| **YouTube Processing** | yt-dlp | 2025.1+ | Metadata, captions, downloads |
| **Audio Processing** | FFmpeg | System | Audio extraction, format merging |
| **Translation** | Google Translate API | Free tier | Caption translation fallback |
| **Containerization** | Docker | Python 3.11-slim | Backend deployment |
| **Frontend Hosting** | Cloudflare Pages | - | Static site hosting |

---

## Architecture Summary

VoxText AI follows a client-server architecture with a React single-page application (SPA) communicating with a Flask REST API backend. The backend uses `yt-dlp` for all YouTube interactions — metadata extraction, caption fetching, and video/audio downloads. Transcript exports (DOCX, TXT, SRT) are generated client-side in the browser, avoiding server-side file storage for transcripts.

The backend includes two layers of in-memory caching:
- **Metadata cache** (5-minute TTL) — avoids duplicate `yt-dlp` extraction calls
- **Caption result cache** (10-minute TTL) — avoids repeated caption fetches for the same video and language

A shared cookie jar persists YouTube authentication cookies across all `yt-dlp` sessions within the server process.

For the complete architecture documentation with Mermaid diagrams, component breakdown, deployment modes, and scaling considerations, see **[Architecture.md](./Architecture.md)**.

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (for Vite 6 compatibility)
- **Python** 3.11+ (recommended; 3.9+ minimum)
- **FFmpeg** installed and available on system PATH
- **yt-dlp** (installed via pip with backend dependencies)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/shasu1pm/VoxText-AI.git
cd VoxText-AI

# 2. Start the Backend
cd Backend
pip install -r requirements.txt
python server.py
# Backend runs at http://127.0.0.1:5000

# 3. Start the Frontend (new terminal)
cd Frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173

# 4. Open browser
# Navigate to http://localhost:5173
```

For detailed setup instructions including virtual environments, Docker, and deployment guides, see **[Setup-Guide.md](./Setup-Guide.md)**.

---

## Environment Variables

| Variable | Location | Required | Description |
|---|---|---|---|
| `VITE_YOUTUBE_API_KEY` | Frontend `.env` | Optional | YouTube Data API v3 key for more reliable video duration fetching. Get yours at [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |

The backend requires **no environment variables** for basic operation. It only needs `FFmpeg` and `yt-dlp` available on the system PATH.

For complete environment configuration with `.env` templates and examples, see **[Setup-Guide.md](./Setup-Guide.md)**.

---

## API Summary

The backend exposes four REST API endpoints, all returning JSON (except the download endpoint which streams binary):

| Endpoint | Method | Description |
|---|---|---|
| `/api/metadata` | `GET` | Fetch video metadata: title, duration, channel, thumbnail, detected language, caption availability, live status |
| `/api/captions` | `GET` | Fetch caption segments with optional language selection; supports auto-translation fallback |
| `/api/formats` | `GET` | Get available download formats with estimated file sizes and duration limit info |
| `/api/download` | `GET` | Download video (MP4) or audio (MP3) in the specified quality |

**Base URL (local):** `http://127.0.0.1:5000`

For the full API specification with request/response examples, error codes, and curl commands, see **[API.md](./API.md)**.

---

## User Flows

VoxText AI supports two primary user flows after pasting a YouTube URL and clicking **"Read my URL"**:

### Flow A: "Get My Transcript"
1. Paste URL and validate
2. Fetch metadata (title, thumbnail, duration, language)
3. Click **"Get My Transcript"**
4. Select output language (auto-detected or choose from 60+)
5. Generate transcript from YouTube captions
6. Download as DOCX, TXT, or SRT

### Flow B: "Download Your Video"
1. Paste URL and validate
2. Fetch metadata
3. Click **"Download Your Video"**
4. View available qualities with estimated file sizes
5. Click Download on preferred quality
6. File downloads as MP4 or MP3

For detailed step-by-step flows with Mermaid diagrams, state transitions, backend calls, and failure paths, see **[User-flow.md](./User-flow.md)**.

---

## Language Detection

Language detection uses a fully open-source, metadata-driven approach with a **5-level priority system** — no Whisper, no audio analysis, no proprietary APIs:

| Priority | Method | Example |
|---|---|---|
| 1 | Title keyword/pattern matching | `"Learn Japanese through Tamil"` detects Tamil |
| 2 | Unicode script detection in title | Tamil script characters (U+0B80-0BFF) detect Tamil |
| 3 | Video tag analysis | Tags containing `"tamil funny video"` detect Tamil |
| 4 | YouTube Studio language field | Uploader-set `language: "ta"` maps to Tamil |
| 5 | YouTube ASR original language | Auto-caption track `kind=asr` without `tlang` |

For the complete algorithm specification, caption language selection logic, UI display behavior, example JSON outputs, and edge cases, see **[Language_Detect_Flow.md](./Language_Detect_Flow.md)**.

---

## Error Handling

VoxText AI handles errors across six categories:

| Category | Example |
|---|---|
| **Validation** | Invalid YouTube URL format |
| **YouTube Access** | Private, deleted, or geo-blocked videos |
| **Caption Availability** | No captions available for video |
| **Download Limits** | Video exceeds duration limit for selected quality |
| **Server Errors** | Backend timeout, processing failure |
| **Connectivity** | Backend offline, network failure |

Errors are displayed inline in the UI with user-friendly messages. The backend returns a standard `{"error": "message"}` JSON response.

For the full error playbook with trigger conditions, exact user messages, dev log messages, retry guidance, and troubleshooting tips, see **[Error-Handling.md](./Error-Handling.md)**.

---

## Security and Privacy

| Aspect | Policy |
|---|---|
| **User Accounts** | None — no sign-ups, no login, no personal data collected |
| **Data Storage** | No long-term storage; metadata cached in memory (5 min), downloads deleted after response |
| **File Retention** | Temporary files cleaned up via background thread within seconds of delivery |
| **Input Validation** | YouTube URL regex on client + `yt-dlp` extraction validation on server |
| **CORS** | Enabled for development; should be restricted to frontend origin in production |
| **API Keys** | Optional `VITE_YOUTUBE_API_KEY` in frontend `.env`; never commit keys to repo |

For the complete security and privacy documentation including threat model, safe logging practices, and compliance notes, see **[Security-Privacy.md](./Security-Privacy.md)**.

---

## Documentation Index

All documentation lives in the `/Documentation` directory:

| Document | Description |
|---|---|
| **[README.md](./README.md)** | Project overview and navigation hub (this file) |
| **[PRD.md](./PRD.md)** | Product Requirements Document — problem, goals, scope, acceptance criteria |
| **[Architecture.md](./Architecture.md)** | System architecture — diagrams, components, data flow, deployment, scaling |
| **[API.md](./API.md)** | API reference — endpoints, request/response examples, error codes |
| **[UI-UX.md](./UI-UX.md)** | UI/UX specification — theme, layout, interaction rules, states, accessibility |
| **[User-flow.md](./User-flow.md)** | User flow documentation — step-by-step flows, Mermaid diagrams, failure paths |
| **[Language_Detect_Flow.md](./Language_Detect_Flow.md)** | Language detection — algorithm, priority chain, edge cases, examples |
| **[Error-Handling.md](./Error-Handling.md)** | Error playbook — categories, user messages, dev logs, troubleshooting |
| **[Security-Privacy.md](./Security-Privacy.md)** | Security and privacy — data handling, secrets, threat model, compliance |
| **[Setup-Guide.md](./Setup-Guide.md)** | Setup guide — prerequisites, install, configuration, deployment, troubleshooting |
| **[Roadmap.md](./Roadmap.md)** | Roadmap — Now / Next / Later milestones with version numbers |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Contribution guide — branching, commits, PRs, issues, security reporting |
| **[LICENSE](./LICENSE)** | MIT License |

---

## Roadmap

See **[Roadmap.md](./Roadmap.md)** for the full roadmap organized in three milestone phases:

- **Now (v0.1)** — Core transcript and download features, 60+ language support, client-side export
- **Next (v0.2)** — Queue system, real download progress, configurable backend URL, caching improvements, CI/CD
- **Later (v1.0)** — Horizontal scaling, observability stack, community language packs, rate limiting

---

## Contributing

We welcome contributions! See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the full guide covering:

- Development environment setup (linked to [Setup-Guide.md](./Setup-Guide.md))
- Branch naming conventions (`feat/`, `fix/`, `docs/`)
- Commit message style (`type(scope): summary`)
- Pull request checklist and template
- Issue templates for bugs and feature requests
- Security reporting process

---

## License

This project is licensed under the **MIT License**. See **[LICENSE](./LICENSE)** for the full text.

---

## Open Source and Community

VoxText AI is proudly open source under the MIT License. We believe in building tools that are transparent, auditable, and community-driven.

**Community Language Expansion:** VoxText AI currently supports 60+ languages through YouTube captions and Google Translate. We welcome contributions to:
- Expand the language code mapping in both frontend and backend
- Improve language detection heuristics for additional scripts and patterns
- Add community-maintained language packs and translation improvements
- Test caption handling for underrepresented languages

If you speak a language that could benefit from better support, check the [Language_Detect_Flow.md](./Language_Detect_Flow.md) for the current algorithm and open an issue or PR to improve it.

---

## Disclaimer

- **YouTube Terms of Service:** This tool interacts with YouTube content via `yt-dlp`. Users are responsible for ensuring their use complies with [YouTube's Terms of Service](https://www.youtube.com/t/terms). VoxText AI is designed for personal and educational use.
- **Rate Limits:** YouTube may rate-limit requests. The backend includes in-memory caching and cookie persistence to minimize duplicate requests, but heavy usage may trigger temporary blocks (HTTP 429). If you experience issues, wait a few minutes and try again.
- **Content Ownership:** Downloaded transcripts and videos remain the intellectual property of their original creators. Do not redistribute copyrighted content without permission.
- **No Warranty:** This software is provided "as is" without warranty of any kind, express or implied. See the [LICENSE](./LICENSE) for full terms.
- **Not Affiliated with YouTube:** VoxText AI is an independent open-source project and is not affiliated with, endorsed by, or sponsored by YouTube or Google.

---

*Built with passion by [Shasu Vathanan](https://shasuvathanan.com/) | [GitHub](https://github.com/shasu1pm) | [LinkedIn](https://www.linkedin.com/in/shasuvathanan)*
