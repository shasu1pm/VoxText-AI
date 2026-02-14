# Product Requirements Document (PRD)

**VoxText AI — Free & Open-Source YouTube Transcript Generator and Video Downloader**

> **Purpose:** Define the product scope, requirements, and success criteria for VoxText AI.
> **Audience:** Product managers, engineers, designers, and contributors building or validating the project.
> **Last Updated:** 2026-02-12
> **Version:** 0.1.0

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Goals](#goals)
- [Non-Goals](#non-goals)
- [Target Users](#target-users)
- [User Stories](#user-stories)
- [Scope](#scope)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [UX Requirements](#ux-requirements)
- [Constraints](#constraints)
- [Success Metrics](#success-metrics)
- [Edge Cases](#edge-cases)
- [Acceptance Criteria](#acceptance-criteria)
- [Related Documents](#related-documents)

---

## Problem Statement

Users need a fast, no-login way to convert a YouTube URL into a downloadable transcript or media file. Existing solutions suffer from:

- **Paywalls** — most transcript tools require paid subscriptions for basic features
- **Account requirements** — sign-up friction reduces casual and educational use
- **Poor language support** — many tools are English-only or have limited language detection
- **Privacy concerns** — users don't know what data is collected or retained
- **Complexity** — technical tools like `yt-dlp` CLI require command-line expertise

VoxText AI solves these problems with a simple, browser-based tool that is free, open-source, and privacy-first.

---

## Goals

1. **Simple transcript flow** — Paste a YouTube URL, get a transcript in DOCX, TXT, or SRT with minimal clicks.
2. **Simple download flow** — Paste a YouTube URL, choose a quality, download MP4 or MP3.
3. **Open-source language detection** — Detect video language using YouTube metadata and caption tracks via `yt-dlp`, without Whisper or proprietary speech-to-text APIs.
4. **Multi-language support** — Support 60+ output languages through YouTube captions and Google Translate fallback.
5. **Transparency** — Show clear UI feedback at every step: language detection, processing progress, errors, and limitations.
6. **Privacy by design** — No user accounts, no data retention, no third-party tracking.
7. **Self-hostable** — The entire stack can be deployed on low-cost infrastructure.

---

## Non-Goals

- **No Whisper-based transcription** — Language detection and transcript generation rely solely on YouTube captions and metadata.
- **No user accounts** — No login, registration, or user management system.
- **No persistent storage** — No database, no file storage beyond temporary processing.
- **No playlist processing** — Only single video URLs are supported.
- **No batch jobs** — Each request is processed synchronously inline.
- **No monetization** — The current version is entirely free with no premium tiers.
- **No mobile native apps** — Browser-only experience (responsive but not a native app).

---

## Target Users

| User Segment | Need | Example Use Case |
|---|---|---|
| **Students and Researchers** | Transcripts for study notes and citations | Download a lecture transcript as TXT for note-taking |
| **Content Creators** | Captions and text for repurposing | Extract SRT subtitles to add to another platform |
| **Educators** | Offline access to educational content | Download an educational video at 360p for classroom playback |
| **Journalists** | Quotes and references from interviews | Get a DOCX transcript of a press conference |
| **General Users** | Offline video/audio access | Download an MP3 of a podcast or music video |
| **Developers** | Self-hosted transcript/download tool | Deploy VoxText AI on a personal VPS |

---

## User Stories

### Transcript Flow
- **US-T1:** As a user, I can paste a YouTube URL and see its title, thumbnail, duration, channel name, and detected language within seconds.
- **US-T2:** As a user, I can select an output language from 60+ options or use the auto-detected language.
- **US-T3:** As a user, I can generate a transcript and download it as DOCX, TXT, or SRT.
- **US-T4:** As a user, I see clear feedback when a video has no captions available.
- **US-T5:** As a user, I can preview the video directly in the page before deciding to get a transcript.

### Download Flow
- **US-D1:** As a user, I can see available download qualities with estimated file sizes before downloading.
- **US-D2:** As a user, I can download a video in MP4 at 720p, 480p, 360p, or 240p.
- **US-D3:** As a user, I can download audio only as MP3.
- **US-D4:** As a user, I see a clear message when a video exceeds the duration limit for my selected quality.
- **US-D5:** As a user, I see download progress indication while the file is being prepared.

### General
- **US-G1:** As a user, I can reset the page and start over with a new URL.
- **US-G2:** As a user, my progress is preserved if I accidentally refresh the page (session storage).
- **US-G3:** As a user, I see clear error messages that tell me what went wrong and what to do.
- **US-G4:** As a user, I can use the tool on both desktop and mobile devices.

---

## Scope

### Transcript Flow

| Step | Component | Detail |
|---|---|---|
| URL input | Frontend | Client-side regex validation for YouTube URLs (`watch?v=`, `youtu.be`, `shorts`) |
| Metadata fetch | Backend | `GET /api/metadata` — returns title, duration, channel, thumbnail, language, caption info, live status |
| Language display | Frontend | Shows "Language Detected: {language}" from backend response |
| Output language selection | Frontend | Dropdown with 60+ languages + "Subtitles-Detected" auto option |
| Caption fetch | Backend | `GET /api/captions` — returns timed segments with optional language parameter |
| Translation fallback | Backend | If YouTube 429s translated caption URL, fetches original + translates via Google Translate |
| Export | Frontend | Client-side generation of DOCX (HTML-based), TXT (plain text), SRT (timed subtitles) |

### Video Download Flow

| Step | Component | Detail |
|---|---|---|
| Format fetch | Backend | `GET /api/formats` — returns availability, estimated sizes, and over-limit status per quality |
| Duration enforcement | Backend | Enforces per-quality duration limits (720p=45min, 480p=60min, 360p/240p=120min, Audio=60min) |
| Media download | Backend | `GET /api/download` — downloads via `yt-dlp`, streams file back, cleans up temp files |
| File naming | Backend | Output files named `VoxText-AI_{sanitized_title}.{ext}` |

### Language Detect Flow

| Step | Component | Detail |
|---|---|---|
| Title analysis | Backend | Keyword patterns, "through/via" phrases, hashtag parsing |
| Script detection | Backend | Unicode range analysis for non-Latin scripts (Tamil, Hindi, Arabic, etc.) |
| Tag analysis | Backend | Frequency-based language keyword detection in video tags |
| YouTube metadata | Backend | Uploader-set `language` field from YouTube Studio |
| ASR detection | Backend | Original auto-caption track (`kind=asr`, no `tlang` parameter) |

---

## Functional Requirements

### FR-1: URL Validation
- The frontend validates YouTube URLs using a regex pattern supporting `youtube.com/watch?v=`, `youtube.com/shorts/`, and `youtu.be/` formats.
- The 11-character video ID must be present.
- Invalid URLs display an inline error: `"Please enter a valid YouTube URL"`.
- The "Read my URL" button is disabled until a valid URL is entered.

### FR-2: Metadata Retrieval
- The backend `/api/metadata` endpoint returns: `duration`, `channelName`, `title`, `thumbnail`, `videoId`, `language`, `playableInEmbed`, `captionLanguage`, `captionLanguageCode`, `hasCaptions`, `availableCaptionLanguages`, and `isLive`.
- Metadata is cached in memory with a 5-minute TTL to avoid duplicate `yt-dlp` calls.
- The frontend has fallback metadata sources: YouTube Data API, Piped API, oEmbed, CORS proxies.

### FR-3: Transcript Generation
- The backend `/api/captions` endpoint returns an array of `{startMs, endMs, text}` segments.
- Caption format priority: `json3` > `vtt` > first available.
- Caption language resolution: case-insensitive match > alias mapping (e.g., `zh` to `zh-Hans`) > base-language fallback (e.g., `en` for `en-US`).
- For translated caption tracks that get 429'd by YouTube, the backend fetches the original caption and translates via Google Translate.
- Caption results are cached for 10 minutes per video+language combination.

### FR-4: Transcript Export
- Export is performed entirely in the browser (no backend endpoint for export).
- **TXT:** Plain text, one segment per line.
- **SRT:** Standard SRT format with sequence numbers, timestamps (`HH:MM:SS,mmm`), and text.
- **DOCX:** HTML table format with timestamps and text, compatible with Microsoft Word (saved as `.doc`).
- Output filename: `VoxText-AI_{sanitized_title}.{ext}`.

### FR-5: Download Formats and Limits
- The backend `/api/formats` endpoint returns availability, estimated file size (MB), `overLimit` flag, and `maxMinutes` per quality.
- Size estimation uses `filesize`, `filesize_approx`, or bitrate-based calculation (`tbr * duration * 1.1`).
- The backend `/api/download` endpoint enforces duration limits before starting the download.
- Downloads use `yt-dlp` with format selection: `bestvideo[height<=X]+bestaudio/best[height<=X]/best` for video, `bestaudio/best` for audio.
- MP4 output uses `merge_output_format: mp4`; MP3 uses FFmpeg post-processing with 192kbps quality.

### FR-6: Language Selection
- The default output language option is "Subtitles-Detected" which uses the backend-selected caption language.
- When "Subtitles-Detected" is selected and captions are unavailable, the dropdown shows "Subtitles-Detected: Captions not available".
- Users can choose from 60+ languages in a searchable dropdown.
- Changing the output language resets the generated transcript so the user must re-generate.

### FR-7: Live Stream Handling
- The backend detects live streams via `is_live` in `yt-dlp` metadata.
- The frontend disables both "Get My Transcript" and "Download Your Video" for live streams.
- The empty state shows: `"Oops!! Live streams aren't supported for 'Transcript' or 'Download.' Reset and try a non-live YouTube URL."`

### FR-8: State Persistence
- The frontend saves current state to `sessionStorage` on every state change.
- On page reload, state is restored from `sessionStorage`.
- The Reset button clears `sessionStorage` and resets all state.

---

## Non-Functional Requirements

### Performance

| Metric | Target | Current Implementation |
|---|---|---|
| Metadata request latency | < 15 seconds | Frontend AbortController timeout at 15s |
| Caption request latency | < 60 seconds | Frontend AbortController timeout at 60s |
| Download timeout | < 10 minutes | Frontend AbortSignal.timeout at 600s |
| Metadata cache TTL | 5 minutes | In-memory `_info_cache` with cleanup |
| Caption cache TTL | 10 minutes | In-memory `_caption_result_cache` with cleanup |
| Progress bar update frequency | ~50ms (metadata), ~200ms (captions) | `setInterval` based |

### Reliability
- Caption fetch uses multiple strategies: direct HTTP with cookies, yt-dlp HTTP handler fallback, and Google Translate fallback for translated tracks.
- Metadata fetch on the frontend uses 7+ fallback methods (yt-dlp backend, YouTube Data API, Piped API, direct oEmbed, CORS proxied oEmbed, HTML scraping, noembed.com).
- Shared cookie jar across yt-dlp sessions reduces 429 rate-limit issues.

### Security
- Input validation on both client (regex) and server (`yt-dlp` extraction).
- CORS enabled with `flask-cors` (currently open for development; should restrict origin in production).
- No SQL injection surface (no database).
- No user input rendered as HTML (XSS-safe for transcript display).

### Privacy
- No user accounts or personal data collection.
- No long-term storage of URLs, metadata, or media files.
- Temporary download files are deleted via background thread within seconds of delivery.
- Optional YouTube Data API key is a frontend-only environment variable.

### Observability and Logging
- Frontend: `console.log` with emoji prefixes for success/failure visibility during development.
- Backend: `print()` statements for translation failures and debug info.
- Recommended improvements: structured logging, request IDs, error rate metrics.

---

## UX Requirements

### Loading States
- **"Read my URL" processing:** Animated progress bar with percentage, video title placeholder text ("Fetching video title..."), and motivational message ("Almost ready... Basically magic in progress").
- **Transcript generation:** Progress bar that ramps to ~90% while waiting, then jumps to 100% on success. Shows "Fetching Transcript..." or "Translating Content To: {language}".
- **Format loading:** Spinner with "Fetching available formats..." text.
- **Video download:** Per-quality progress bar showing percentage, switches to "Complete!" when done.

### Empty States
- **Before URL entry:** Input panel with placeholder text "Paste your YouTube URL here......."
- **After metadata, no action selected:** Panel showing "Start the magic by selecting 'Get My Transcript' or 'Download Your Video' on the left."
- **Live stream detected:** "Oops!! Live streams aren't supported for 'Transcript' or 'Download.' Reset and try a non-live YouTube URL."

### Error States
- **Invalid URL:** Inline red text near input: `"*Please enter a valid YouTube URL"`
- **Backend errors:** Red banner inside relevant panel with error message
- **Transcript errors:** Red banner inside transcript panel
- **Download errors:** Red banner below action buttons

### Button Behaviors
- **"Read my URL":** Disabled when URL is invalid or processing is active. Shows "Processing..." during operation.
- **"Get My Transcript":** Disabled for live streams. Highlighted with ring when active panel.
- **"Download Your Video":** Disabled for live streams. Highlighted with ring when active panel.
- **Generate Transcript:** Disabled while processing or when captions unavailable. Shows context-aware text ("Get Transcript in: {language}" or "Translate to: {language}").
- **Quality Download:** Disabled when another quality is downloading. Shows "Downloading... {progress}%" during download.
- **Reset:** Always available. Clears all state and session storage.

---

## Constraints

### Language Policy
- UI copy is English-first (interface text, labels, error messages).
- Actual transcript language depends on available YouTube caption tracks.
- Translation is available to 60+ languages via the output language selector.
- Language detection uses metadata only — no audio analysis or Whisper.

### Server Resource Limits
- Downloads are processed inline (no queue), so concurrent downloads compete for CPU, network, and disk I/O.
- Temporary files are written to the system temp directory; ensure adequate disk space.
- The in-memory cache does not scale across multiple server instances.

### Frontend Limitations
- Backend URL is hardcoded to `http://127.0.0.1:5000` in the frontend source code.
- DOCX export is actually HTML-based (`.doc`) rather than true Office Open XML.
- No automated test suite for the frontend.

### External Dependencies
- Transcript availability depends entirely on YouTube caption tracks (manual or auto-generated).
- Video download availability depends on YouTube format availability.
- Google Translate free API may have its own rate limits for translation fallback.

---

## Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| **Transcript success rate** | >= 95% | For captioned, non-private, non-live videos |
| **Download success rate** | >= 90% | For videos within duration limits |
| **Unhandled error rate** | < 5% | Sessions ending with uncaught exceptions |
| **Metadata fetch time** | < 10 seconds | 90th percentile for `/api/metadata` |
| **User flow completion** | >= 80% | Users who start "Read my URL" and complete a transcript or download |

---

## Edge Cases

| Edge Case | Expected Behavior |
|---|---|
| Private video | Backend returns 403: `"This video is private"` |
| Deleted/removed video | Backend returns 404: `"This video is unavailable or deleted"` |
| Geo-blocked video | Backend returns error with `yt-dlp` message |
| Age-restricted video | Handled by `yt-dlp` if possible; may fail without authentication |
| No captions (manual or auto) | UI shows `"No captions available for this video."` |
| Captions disabled by uploader | Same as no captions |
| Multiple caption languages | Backend auto-selects first manual subtitle; user can choose from dropdown |
| Live stream | Both action buttons disabled; empty state explains limitation |
| Video exceeds duration limit | Download button shows "Exceeds {N} min limit" instead of Download button |
| Backend offline | Frontend shows `"Failed to connect to the backend. Make sure the server is running."` |
| YouTube rate limit (429) | Caption fetch falls back to Google Translate; metadata uses cache |
| Network timeout | Frontend shows `"Request timed out. Please try again."` |
| Very long video (2+ hours) | Only 360p/240p available for download |
| Non-embeddable video | Thumbnail shown with overlay: "Embedding disabled by the video owner" + "Watch on YouTube" link |
| URL with extra parameters | Regex allows `?v=ID&...` patterns |
| Shorts URL | Supported via `youtube.com/shorts/` pattern |
| youtu.be short URL | Supported via `youtu.be/` pattern |

---

## Acceptance Criteria

### AC-1: URL Validation
- **Given** a URL matching `youtube.com/watch?v=`, `youtube.com/shorts/`, or `youtu.be/` patterns with an 11-character video ID
- **When** the user pastes it into the input field
- **Then** the "Read my URL" button becomes enabled and no error is shown

### AC-2: Metadata Display
- **Given** a valid, public, non-live YouTube URL
- **When** the user clicks "Read my URL"
- **Then** the app displays title, thumbnail, duration (HH:MM:SS), channel name, and "Language Detected: {language}" within 15 seconds

### AC-3: Transcript Generation (Happy Path)
- **Given** a video with available captions
- **When** the user clicks "Get My Transcript" and then the Generate button
- **Then** transcript segments are returned and three download buttons (DOCX, TXT, SRT) appear

### AC-4: Transcript — No Captions
- **Given** a video with no manual or auto-generated captions
- **When** the user clicks "Get My Transcript"
- **Then** the generate button shows "Captions Not Available" and is disabled

### AC-5: Video Download (Happy Path)
- **Given** a video within the duration limit for a quality tier
- **When** the user clicks "Download Your Video" and selects a quality
- **Then** the file downloads as MP4 (or MP3 for Audio Only) with the correct filename

### AC-6: Download Duration Limit
- **Given** a video exceeding the duration limit for 720p HD (45 minutes)
- **When** the user views the download panel
- **Then** the 720p HD option shows "Exceeds 45 min limit" and the Download button is replaced

### AC-7: Live Stream Handling
- **Given** a live stream URL
- **When** metadata is fetched
- **Then** both "Get My Transcript" and "Download Your Video" buttons are disabled and a red "LIVE" indicator is shown

### AC-8: Error Display
- **Given** a private video URL
- **When** the user clicks "Read my URL"
- **Then** the backend returns a 403 and the frontend displays the error message

### AC-9: Session Persistence
- **Given** the user has completed metadata fetch and is viewing the results
- **When** the page is refreshed
- **Then** the results are restored from session storage without re-fetching

### AC-10: Reset
- **Given** the user is in any state (processing, completed, error)
- **When** the user clicks "Reset"
- **Then** all state is cleared, session storage is emptied, and the input panel is shown

---

## Related Documents

- [README](README.md) — Project overview and navigation hub
- [Architecture](Architecture.md) — System architecture and tech decisions
- [API](API.md) — API specification with request/response examples
- [UI-UX](UI-UX.md) — UI/UX specification and design system
- [User Flow](User-flow.md) — Detailed user flow documentation
- [Language Detect Flow](Language_Detect_Flow.md) — Language detection algorithm
- [Error Handling](Error-Handling.md) — Error playbook and troubleshooting
- [Security and Privacy](Security-Privacy.md) — Security and privacy policies
