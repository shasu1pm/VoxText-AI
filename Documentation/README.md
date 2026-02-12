# VoxText AI

**Purpose:** Provide the main entry point to the VoxText AI documentation set and explain how to run the project.
**Audience:** Developers, maintainers, and contributors evaluating or running the project.
**Last Updated:** February 11, 2026
**Version:** v0.1

VoxText AI turns a YouTube URL into a clean transcript and downloadable media (MP4 or MP3) using open-source tooling.

## Table of Contents
- Key Features
- Supported Limits
- Tech Stack
- Architecture Summary
- Quick Start
- Environment Variables
- API Summary
- User Flows
- Language Detection Summary
- Error Handling Summary
- Security and Privacy Note
- Documentation Index
- Open Source Note
- Disclaimer
- Roadmap
- Contributing
- License

## Key Features
- YouTube URL ingestion with client-side validation.
- Transcript extraction from YouTube captions (manual or auto), with client-side export to `DOCX`, `TXT`, and `SRT`.
- Video and audio downloads: `MP4` (720p/480p/360p/240p) and `MP3` (Audio Only).
- Language detection using open-source metadata via `yt-dlp` (no Whisper).
- Fully open-source and self-hostable.

## Supported Limits
- Video download duration limits (enforced by backend): 720p HD (45 min), 480p (60 min), 360p (120 min), 240p (120 min), Audio Only (60 min).
- Transcripts depend on YouTube caption availability; videos without captions cannot generate transcripts.
- Live streams are not supported for transcript or download actions.

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS.
- Backend: Python + Flask + `flask-cors`.
- Processing: `yt-dlp` for metadata, captions, and downloads; `ffmpeg` for audio extraction and merging.

## Architecture Summary
The frontend is a single-page React app that validates YouTube URLs, displays metadata, and initiates actions. The Flask backend uses `yt-dlp` to extract metadata, determine caption languages, provide caption segments, and download media. Transcript exports are generated client-side to avoid storing files on the server. See [Architecture](Architecture.md) for diagrams and details.

## Quick Start
1. Backend: `cd Backend`
2. Backend: `python -m pip install flask flask-cors yt-dlp`
3. Backend: `python server.py`
4. Frontend: `cd Frontend`
5. Frontend: `npm install`
6. Frontend: `npm run dev`
7. Open the app (Vite default): `http://localhost:5173`

For a step-by-step guide, see [Setup Guide](Setup-Guide.md).

## Environment Variables
- `VITE_YOUTUBE_API_KEY` (optional, frontend) for more reliable duration metadata.

Details and examples are in [Setup Guide](Setup-Guide.md).

## API Summary
Base backend URL (local): `http://127.0.0.1:5000`
- `GET /api/metadata` - video metadata, caption availability, and detected language.
- `GET /api/captions` - caption segments for transcripts.
- `GET /api/formats` - download options and size estimates.
- `GET /api/download` - video or audio download.

Full API spec: [API](API.md).

## User Flows
- Flow A: `Get My Transcript` (URL -> metadata -> captions -> export)
- Flow B: `Download Your Video` (URL -> metadata -> formats -> download)

See [User Flow](User-flow.md) for detailed flows and diagrams.

## Language Detection Summary
Language detection is driven by open-source metadata via `yt-dlp` and caption tracks. The backend applies a priority chain (title hints, script detection, tags, YouTube language field, and auto-caption language). No Whisper-based language detection is used. See [Language Detect Flow](Language_Detect_Flow.md).

## Error Handling Summary
Common errors include invalid URLs, private or removed videos, missing captions, rate limiting (HTTP 429), and backend connectivity issues. See [Error Handling](Error-Handling.md).

## Security and Privacy Note
There is no authentication in the current implementation. Metadata is cached in memory for five minutes; downloaded files are stored in temp folders and deleted shortly after completion. For details, see [Security and Privacy](Security-Privacy.md).

## Documentation Index
- [README](README.md)
- [Setup Guide](Setup-Guide.md)
- [API](API.md)
- [Architecture](Architecture.md)
- [PRD](PRD.md)
- [UI and UX](UI-UX.md)
- [User Flow](User-flow.md)
- [Language Detect Flow](Language_Detect_Flow.md)
- [Error Handling](Error-Handling.md)
- [Security and Privacy](Security-Privacy.md)
- [Roadmap](Roadmap.md)
- [Contributing](CONTRIBUTING.md)
- [License](LICENSE)

## Open Source Note
VoxText AI is open source. Community contributions are welcome, especially around language mapping, caption handling, and UI improvements. If you want to expand language support, review [Language Detect Flow](Language_Detect_Flow.md) and [Contributing](CONTRIBUTING.md).

## Disclaimer
This project interacts with YouTube content. You are responsible for complying with YouTube Terms of Service and applicable copyright laws. Some videos may be blocked, private, or rate-limited, and results are not guaranteed.

## Roadmap
See [Roadmap](Roadmap.md).

## Contributing
See [Contributing](CONTRIBUTING.md).

## License
See [License](LICENSE).
