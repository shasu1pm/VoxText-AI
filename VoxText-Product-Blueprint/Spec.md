# Implementation Spec

This spec summarizes the current implementation in the repo and the near-term evolution path.

## 1. Tech Stack

| Layer | Stack | Notes |
|---|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind | Static build; hosted on Cloudflare Pages |
| Backend API | FastAPI (Python), uvicorn | Synchronous processing |
| Worker | None (in-process) | No queue or background jobs |
| Storage | Temp files on disk | Deleted after each request |
| Model | VOSK (small English model) | Offline after download |
| Audio | FFmpeg | Converts to 16 kHz mono WAV |
| Language ID | SpeechBrain (optional) | Skipped when `LOW_RAM_MODE=1` |

## 2. API Contract Summary

**Endpoints**
- `GET /` → API info
- `GET /healthz` → liveness
- `GET /readyz` → readiness
- `POST /api/transcribe` and `POST /transcribe`

**Request**
- `multipart/form-data`
- Accepts one file field: `file` or `audio` or `media` or `upload`

**Response (English)**
```json
{
  "text": "...",
  "language": "en",
  "segments": [
    {"start": 0.0, "end": 5.0, "text": "..."}
  ],
  "srt": "..."
}
```

**Response (Non-English)**
```json
{
  "text": "",
  "language": "<code>",
  "segments": [],
  "srt": ""
}
```

## 3. Non-Functional Requirements

Performance (current behavior):
- Max file size: 200 MB default
- Language detection uses first 15 seconds of audio
- End-to-end time depends on file length and CPU

Targets (Assumption):
- < 30 seconds for detection on typical files
- < 3 minutes for 10-minute English audio on a modern CPU

Reliability:
- No retries in current API
- Synchronous processing, one request per file
- Recommended to add retries at the client or proxy

Privacy:
- No file retention after processing
- No external transcription APIs in VOSK mode
- TLS required in production (reverse proxy)

## 4. Deployment Spec

MVP (single VM) using Docker Compose:
- `frontend` container (Nginx serving static build)
- `backend` container (FastAPI + VOSK)

Scale-out design (Planned):
- Separate API service and worker pool
- Queue for long jobs (Redis/RQ or similar)
- Shared storage for uploaded media

## 5. Cost Model (Ballpark)

Assumptions:
- CPU-only inference
- Single small VM for MVP

Estimated range:
- MVP: $10–$40/month (single VM + storage)
- Early scale: $100–$500/month (multiple API/worker instances)

Why VOSK lowers cost:
- Shifts from per-minute API fees to fixed compute costs
- Runs offline without paid API usage

## 6. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| VOSK accuracy lower than Whisper | Medium | Offer larger VOSK model option; tune audio preprocessing |
| CPU bottlenecks on long files | High | Queue + worker scaling; enforce size/time limits |
| Upload abuse | Medium | Add rate limiting and auth at proxy |
| Non-English detection edge cases | Medium | Improve language ID model; add user confirmation |