# Roadmap

**VoxText AI — Product Roadmap and Feature Direction**

> **Purpose:** Outline planned milestones, feature direction, and technical backlog for VoxText AI across current and future releases.
> **Audience:** Maintainers, contributors, and stakeholders planning or evaluating project direction.
> **Last Updated:** 2026-02-12
> **Version:** 0.1.0

---

## Table of Contents

- [Now (v0.1) — Current Release](#now-v01--current-release)
- [Next (v0.2) — Planned Features](#next-v02--planned-features)
- [Later (v1.0) — Long-Term Vision](#later-v10--long-term-vision)
- [Technical Backlog](#technical-backlog)
- [Milestones Summary](#milestones-summary)
- [Related Documents](#related-documents)

---

## Now (v0.1) — Current Release

These features are shipped and available in the current version:

- [x] **YouTube URL to Transcript** — Paste a YouTube URL and generate a transcript from captions, exported as DOCX, TXT, or SRT
- [x] **YouTube URL to Download** — Download video as MP4 (720p HD, 480p, 360p, 240p) or audio as MP3
- [x] **Language Detection** — 5-level priority detection via `yt-dlp` metadata (title keywords, Unicode script analysis, video tags, YouTube Studio metadata, ASR caption language) — no Whisper, no proprietary APIs
- [x] **60+ Output Languages** — Auto-detected video language with manual override; supports translation to 60+ languages via YouTube translated tracks and Google Translate fallback
- [x] **Session Persistence** — Browser `sessionStorage` preserves user progress (URL, metadata, transcript state) across page refreshes
- [x] **Video Preview** — Embedded YouTube player with play/pause controls and thumbnail fallback for non-embeddable videos
- [x] **Client-Side Export** — Transcript files (DOCX, TXT, SRT) generated entirely in the browser; no server-side file storage for transcripts
- [x] **Estimated File Sizes** — Download panel shows estimated file sizes per quality tier before download
- [x] **Duration Limits** — Per-quality duration caps (720p: 45 min, 480p: 60 min, 360p/240p: 120 min, MP3: 60 min)
- [x] **In-Memory Caching** — Metadata cache (5-minute TTL) and caption result cache (10-minute TTL) reduce duplicate `yt-dlp` calls
- [x] **Shared Cookie Jar** — Process-wide `MozillaCookieJar` persists YouTube authentication cookies to reduce 429 rate limit errors
- [x] **Live Stream Detection** — Live streams are detected and both transcript and download actions are disabled
- [x] **Privacy-First Design** — No user accounts, no sign-ups, no personal data stored; temporary download files deleted immediately after delivery

---

## Next (v0.2) — Planned Features

### Multi-Language Expansion

- Improved language code mapping between frontend and backend for better accuracy
- Community language packs — allow contributors to add and maintain language-specific detection heuristics, translation overrides, and caption handling improvements
- Better support for underrepresented languages and non-Latin scripts

### Better Progress UI

- Real download progress tracking based on `Content-Length` headers and bytes-received updates
- Streaming progress for transcript generation — show caption fetch and parse stages in the UI
- Replace indeterminate spinners with percentage-based or staged progress indicators

### Queue System

- Redis + RQ (Redis Queue) for managing long-running download jobs asynchronously
- Job status polling from the frontend — submit a download request, receive a job ID, poll for completion
- Prevents HTTP request timeouts for large or slow downloads

### Caching Improvements

- Redis-backed shared cache to replace in-memory dictionaries
- Cache sharing across multiple backend instances for horizontal scaling
- Configurable TTL values via environment variables

### Account-Less Usage Improvements

- Token-based throttling — issue anonymous session tokens to track usage without requiring accounts
- Anonymous quotas — enforce per-session or per-IP download limits to prevent abuse while keeping the tool sign-up-free
- Graceful quota-exceeded messaging in the UI

### Configurable Backend URL

- Replace the hardcoded `http://127.0.0.1:5000` backend URL with an environment variable (`VITE_API_BASE_URL`)
- Allow frontend to point to any backend instance without modifying source code
- Document environment variable in Setup Guide and `.env.example`

---

## Later (v1.0) — Long-Term Vision

### Tests

- **Frontend:** Jest + React Testing Library for unit and component tests
- **Backend:** pytest for API endpoint tests, caption parsing, language detection, and edge cases
- **Integration tests:** End-to-end tests covering the full transcript and download flows against the real backend
- Target: meaningful coverage on critical paths (language detection, caption parsing, download flow)

### CI/CD

- **GitHub Actions** pipeline with stages for lint, type check, build, test, and deploy
- Automated frontend deployment to Cloudflare Pages on merge to `main`
- Automated backend Docker image build and push
- Branch protection rules requiring passing checks before merge

### Observability

- **Structured logging** — JSON-format logs with log levels (DEBUG, INFO, WARN, ERROR) replacing `print()` statements
- **Request IDs** — Unique IDs propagated from frontend to backend for end-to-end request tracing
- **Prometheus metrics** — Request count, latency histograms, error rates, cache hit ratios, download sizes
- **Health endpoints** — `/healthz` for liveness probes and `/readyz` for readiness checks
- **Alerting** on elevated error rates, 429 response frequency, and download failure spikes

### Rate Limiting

- **Per-IP rate limits** — Configurable request limits per IP address using Flask middleware
- **nginx `limit_req`** — Production-grade rate limiting at the reverse proxy layer
- **Abuse prevention** — Automatic temporary bans for clients exceeding sustained rate limits
- **Exponential backoff** for YouTube 429 responses with circuit breaker pattern

### Component Refactoring

- Split the monolithic `App.tsx` into smaller, focused components (URL input, metadata display, transcript panel, download panel, video preview, language selector)
- Extract shared logic into custom hooks (`useMetadata`, `useTranscript`, `useDownload`)
- Improve testability and maintainability through component isolation

### Playlist Support

- Accept YouTube playlist URLs and process all videos in the playlist
- Batch transcript generation and batch download with progress tracking per video
- Playlist metadata display (title, video count, total duration)

### PWA Support

- Progressive Web App manifest and service worker for offline-capable UI shell
- Install prompt for mobile and desktop browsers
- Cache static assets for faster repeat visits

---

## Technical Backlog

The following items are infrastructure and code quality improvements tracked separately from feature work:

### Tests (Priority: High)

| Area | Tool | Scope |
|---|---|---|
| Frontend unit tests | Jest + React Testing Library | Component rendering, state management, export logic |
| Backend API tests | pytest | Endpoint responses, error handling, input validation |
| Language detection tests | pytest | All 5 priority levels with diverse test videos |
| Integration tests | pytest + requests | Full transcript and download flows |

### CI/CD (Priority: High)

| Stage | Tool | Trigger |
|---|---|---|
| Lint + type check | ESLint + TypeScript compiler | Every push and PR |
| Frontend build | Vite | Every push and PR |
| Backend tests | pytest | Every push and PR |
| Frontend deploy | Cloudflare Pages | Merge to `main` |
| Docker build | GitHub Actions | Merge to `main` |

### Observability (Priority: Medium)

| Component | Current | Target |
|---|---|---|
| Backend logging | `print()` statements | Structured JSON logging with Python `logging` module |
| Frontend logging | `console.log` with emoji prefixes | Structured console output with log levels |
| Metrics | None | Prometheus counters and histograms |
| Health checks | None | `/healthz` and `/readyz` endpoints |
| Tracing | None | Request ID propagation via `X-Request-ID` header |

### Rate Limiting (Priority: Medium)

| Layer | Current | Target |
|---|---|---|
| Application | None | Flask middleware with per-IP limits |
| Reverse proxy | None | nginx `limit_req` with burst allowance |
| YouTube 429 handling | Shared cookie jar only | Exponential backoff + circuit breaker |

### Code Quality (Priority: Medium)

| Item | Current | Target |
|---|---|---|
| Frontend architecture | Single `App.tsx` (~2000+ lines) | Modular components with custom hooks |
| Backend URL | Hardcoded `http://127.0.0.1:5000` | Environment variable `VITE_API_BASE_URL` |
| Error boundaries | None | React error boundaries for graceful UI failure |
| TypeScript strictness | Standard | Strict mode with no `any` types |

---

## Milestones Summary

| Version | Milestone | Key Deliverables | Status |
|---|---|---|---|
| **v0.1** | Core MVP | Transcript generation (DOCX/TXT/SRT), video/audio download (MP4/MP3), 60+ languages, language detection, session persistence, video preview, client-side export | **Shipped** |
| **v0.2** | Reliability and Progress | Queue system (Redis + RQ), real download progress UI, configurable backend URL, Redis caching, community language packs, anonymous throttling | Planned |
| **v0.3** | Quality and Automation | Jest and pytest test suites, GitHub Actions CI/CD, structured logging, health endpoints, ESLint strict config | Planned |
| **v1.0** | Production Ready | Per-IP rate limiting, component refactoring, Prometheus metrics, request tracing, playlist support, PWA support, full observability stack | Planned |

---

## Related Documents

- [README](README.md) — Project overview and navigation hub
- [PRD](PRD.md) — Product Requirements Document with scope and acceptance criteria
- [Architecture](Architecture.md) — System architecture, components, and scaling notes
- [CONTRIBUTING](CONTRIBUTING.md) — Contribution guide for developers
- [Setup Guide](Setup-Guide.md) — Installation and deployment instructions
- [Security and Privacy](Security-Privacy.md) — Security practices and data handling
