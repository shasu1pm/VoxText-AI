# Product Requirements Document (PRD)

**Purpose:** Define the product scope, requirements, and success criteria for VoxText AI.
**Audience:** Product, engineering, and contributors building or validating the project.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Problem Statement
- Goals
- Non-Goals
- Target Users
- User Stories
- Scope
- Functional Requirements
- Non-Functional Requirements
- UX Requirements
- Constraints
- Success Metrics
- Edge Cases
- Acceptance Criteria
- Related Documents

## Problem Statement
Users want a fast, no-login way to convert a YouTube URL into a transcript and downloadable media. Existing solutions are often paywalled, require accounts, or lack clear language detection and caption handling.

## Goals
- Provide a simple URL-to-transcript flow with downloadable `DOCX`, `TXT`, and `SRT` outputs.
- Provide a URL-to-download flow for MP4 (720p/480p/360p/240p) and MP3.
- Detect language using open-source metadata from YouTube and caption tracks (no Whisper).
- Keep the experience fast, reliable, and transparent about limitations.

## Non-Goals
- No automated translation or Whisper-based language detection.
- No user accounts, login, or storage of user media.
- No playlist processing or batch jobs.

## Target Users
- Students and researchers who need transcripts for study notes.
- Content creators who need captions or text for repurposing.
- Users who want offline access to video or audio.

## User Stories
- As a user, I can paste a YouTube URL and quickly see its title, duration, and detected language.
- As a user, I can download a transcript in a format I choose.
- As a user, I can download an MP4 or MP3 in common quality tiers.
- As a user, I can see why a transcript or download failed (private video, no captions, too long).

## Scope
### Transcript Flow
- Validate a YouTube URL client-side.
- Fetch metadata from backend (`/api/metadata`).
- Fetch caption segments (`/api/captions`).
- Export transcript on the client as `DOCX`, `TXT`, or `SRT`.

### Video Download Flow
- Fetch format availability (`/api/formats`).
- Enforce duration limits per quality tier.
- Download MP4 or MP3 (`/api/download`).

### Language Detect Flow
- Backend language detection from `yt-dlp` metadata.
- Prefer caption track language for transcript selection.
- Frontend display of `Language Detected` and `Subtitles-Detected` states.

## Functional Requirements
1. URL Validation: validate YouTube URLs against the supported formats (`watch?v=`, `youtu.be`, `shorts`).
2. Metadata Retrieval: backend returns duration, channel, title, thumbnail, videoId, detected language, caption availability, and live status.
3. Transcript Generation: backend returns caption segments in a consistent JSON format and a clear error if captions are unavailable.
4. Transcript Export: client generates `DOCX`, `TXT`, and `SRT` files locally.
5. Download Formats: backend reports quality availability, size estimates, and enforces duration limits per tier.
6. Language Selection: default to `Subtitles-Detected` when available and return a clear error for unavailable languages.
7. Live Stream Handling: live streams are flagged and transcript/download actions are disabled.
8. State Persistence: UI preserves the current state across refreshes (session storage).

## Non-Functional Requirements
### Performance
- Metadata requests should complete within ~15 seconds (frontend timeout).
- Caption requests should complete within ~30 seconds (frontend timeout).
- Downloads should tolerate long transfers (frontend timeout 10 minutes).

### Reliability
- Caption fetch retries (backend) for transient HTTP failures.
- In-memory metadata cache with a 5-minute TTL to reduce repeated `yt-dlp` calls.

### Security
- Input validation on both client and server.
- CORS enabled for frontend usage (currently open in dev; restrict in production).

### Privacy
- No long-term storage of URLs or content.
- Temp downloads cleaned up shortly after completion.

### Observability and Logging
- Client console logs for visibility during development.
- Backend error messages should be explicit and user-friendly.

## UX Requirements
- Loading states for URL processing, transcript generation, and download preparation.
- Empty state encouraging users to select `Get My Transcript` or `Download Your Video`.
- Error states must show actionable messages (e.g., private video, no captions, timeout).
- Buttons should disable while processing or when action is invalid.

## Constraints
- No Whisper or server-side translation.
- Language policy: UI copy is English-first; actual transcript language depends on available caption tracks.
- Frontend currently targets a local backend URL (`http://127.0.0.1:5000`).
- Caption availability is determined by YouTube.
- Download duration limits per quality are enforced server-side.

## Success Metrics
- >= 95% success rate for captioned, non-private videos.
- >= 90% download success rate for videos within duration limits.
- < 5% of sessions end with an unhandled error.

## Edge Cases
- Private or removed videos.
- Geo-blocked or age-restricted videos.
- No captions or missing auto captions.
- Multiple caption languages with ambiguous selection.
- Live streams.
- Long videos exceeding duration limits.
- Backend offline or CORS failures.
- Rate limiting (HTTP 429 from YouTube).

## Acceptance Criteria (Given/When/Then)
1. Given a valid YouTube URL, when the user clicks `Read my URL`, then the app displays title, duration, thumbnail, and `Language Detected`.
2. Given a video with captions, when the user clicks `Get My Transcript`, then caption segments are returned and download options appear.
3. Given a video with no captions, when the user clicks `Get My Transcript`, then the UI shows `No captions available for this video.`
4. Given a video within duration limits, when the user clicks a download quality, then an MP4/MP3 file is delivered.
5. Given a video exceeding duration limits, when the user clicks a download quality, then the backend returns a clear `Video too long` error.

## Related Documents
- [README](README.md)
- [Architecture](Architecture.md)
- [API](API.md)
- [User Flow](User-flow.md)
- [Language Detect Flow](Language_Detect_Flow.md)
- [Error Handling](Error-Handling.md)
