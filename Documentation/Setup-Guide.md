# Setup Guide

**Purpose:** Provide step-by-step instructions to run VoxText AI locally and deploy it.
**Audience:** Developers and operators setting up the project.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Prerequisites
- Clone and Install
- Backend Setup
- Frontend Setup
- Environment Configuration
- Local Verification Checklist
- Troubleshooting
- Deployment Guides
- Performance Tips
- Related Documents

## Prerequisites
- Node.js (recommended 18+ for Vite 6).
- Python (recommended 3.9+).
- `ffmpeg` installed and available on PATH.
- `yt-dlp` Python package (installed via pip).

## Clone and Install
```bash
git clone <your-repo-url>
cd VoxText-AI-Youtube-Link-To-Download-Project
```

## Backend Setup
```bash
cd Backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install flask flask-cors yt-dlp
python server.py
```

Backend starts at `http://127.0.0.1:5000`.

## Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

Frontend starts on the Vite dev server (default `http://localhost:5173`).

## Environment Configuration
Frontend `.env` file (optional):
```
VITE_YOUTUBE_API_KEY=
```

Use `.env.example` as a template.

## Local Verification Checklist
- `GET /api/metadata` returns a valid JSON response.
- `Get My Transcript` works for a captioned video.
- `Download Your Video` works for a short video.

Example request:
```bash
curl "http://127.0.0.1:5000/api/metadata?url=https://www.youtube.com/watch?v=VIDEO_ID"
```

## Troubleshooting
- Port conflicts: change ports or stop the process using the same port.
- CORS issues: ensure frontend and backend are on compatible origins.
- `yt-dlp` failures: update the package or verify network access.
- `ffmpeg` missing: install and confirm it is in PATH.
- HTTP 429: wait 30 seconds before retrying.

## Deployment Guides
### Render (Backend)
- Provision a Python service with `ffmpeg` installed.
- Set the start command to `python server.py`.
- Ensure enough disk and memory for temporary downloads.

### VPS (Hostinger/Ubuntu)
- Install Python, `ffmpeg`, and `yt-dlp`.
- Run backend behind a reverse proxy (nginx) and configure CORS.

### Cloudflare Pages (Frontend)
- Build with `npm run build`.
- Deploy the `dist/` folder.
- Update backend base URL in the frontend source if needed (currently hardcoded in `Frontend/src/app/App.tsx`).

## Performance Tips
- Prefer lower quality downloads for long videos.
- Keep the 5-minute metadata cache to reduce repeated `yt-dlp` calls.
- Consider adding server-side rate limiting in production.

## Related Documents
- [README](README.md)
- [API](API.md)
- [Security and Privacy](Security-Privacy.md)
