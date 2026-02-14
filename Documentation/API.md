# API Specification

**VoxText AI — Backend REST API Reference**

> **Purpose:** Define the backend API contract, endpoint specifications, and client-side operations for VoxText AI.
> **Audience:** Frontend developers, backend maintainers, integrators, and API consumers.
> **Last Updated:** 2026-02-12
> **Version:** 0.1.0

---

## Table of Contents

- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Common Headers](#common-headers)
- [Endpoints](#endpoints)
  - [GET /api/metadata](#1-get-apimetadata)
  - [GET /api/captions](#2-get-apicaptions)
  - [GET /api/formats](#3-get-apiformats)
  - [GET /api/download](#4-get-apidownload)
- [Client-Side Operations](#client-side-operations)
- [Common Error Model](#common-error-model)
- [Timeouts and Retries](#timeouts-and-retries)
- [Rate Limit Guidance](#rate-limit-guidance)
- [Related Documents](#related-documents)

---

## Base URLs

| Environment | URL |
|---|---|
| Local development | `http://127.0.0.1:5000` |
| Production (example) | `https://api.your-domain.example` |

All endpoints are relative to the base URL. The backend runs on Flask with CORS enabled (`flask-cors` with `Content-Disposition` header exposed).

---

## Authentication

**None.** The current implementation does not require authentication. All endpoints are publicly accessible.

For production deployments, consider adding API key authentication or IP-based restrictions via a reverse proxy.

---

## Common Headers

### Request Headers

| Header | Value | Required |
|---|---|---|
| `Accept` | `application/json` | Recommended |

### Response Headers

| Header | Value | Endpoints |
|---|---|---|
| `Content-Type` | `application/json` | `/api/metadata`, `/api/captions`, `/api/formats` |
| `Content-Type` | `video/mp4` or `audio/mpeg` | `/api/download` |
| `Content-Disposition` | `attachment; filename="..."` | `/api/download` |
| `Access-Control-Expose-Headers` | `Content-Disposition` | All (via CORS config) |

---

## Endpoints

### 1. GET `/api/metadata`

Fetch video metadata, detected language, and caption availability from YouTube via `yt-dlp`.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Full YouTube URL (`watch?v=`, `youtu.be/`, or `shorts/`) |

**Example Request**

```bash
curl "http://127.0.0.1:5000/api/metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Success Response (200 OK)**

```json
{
  "duration": 212,
  "channelName": "Rick Astley",
  "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "videoId": "dQw4w9WgXcQ",
  "language": "English",
  "playableInEmbed": true,
  "captionLanguage": "English",
  "captionLanguageCode": "en",
  "hasCaptions": true,
  "availableCaptionLanguages": {
    "en": { "name": "English", "type": "manual" },
    "es": { "name": "Spanish", "type": "auto" },
    "fr": { "name": "French", "type": "auto" }
  },
  "isLive": false
}
```

**Response Fields**

| Field | Type | Description |
|---|---|---|
| `duration` | number or null | Video duration in seconds |
| `channelName` | string | Channel or uploader name |
| `title` | string | Video title |
| `thumbnail` | string | Thumbnail URL |
| `videoId` | string | 11-character YouTube video ID |
| `language` | string or null | Detected spoken language (human-readable) |
| `playableInEmbed` | boolean | Whether the video can be embedded |
| `captionLanguage` | string or null | Name of the preferred caption track |
| `captionLanguageCode` | string or null | Language code of the preferred caption track |
| `hasCaptions` | boolean | Whether any captions (manual or auto) are available |
| `availableCaptionLanguages` | object | Map of language codes to `{name, type}` objects |
| `isLive` | boolean | Whether the video is currently live |

**Error Responses**

| Status | Condition | Example Response |
|---|---|---|
| 400 | Missing `url` parameter | `{"error": "Missing 'url' query parameter"}` |
| 400 | Invalid URL or extraction failure | `{"error": "<yt-dlp error message>"}` |
| 403 | Private video | `{"error": "This video is private"}` |
| 404 | Video unavailable or deleted | `{"error": "This video is unavailable or deleted"}` |
| 500 | Server error | `{"error": "<exception message>"}` |

---

### 2. GET `/api/captions`

Fetch caption segments for transcript generation. Supports language selection and automatic language resolution.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Full YouTube URL |
| `lang` | string | No | Caption language code (e.g., `en`, `ta`, `zh-TW`). If omitted, auto-selects preferred track. |

**Language Resolution Order:**
1. Case-insensitive exact match in manual subtitles
2. Case-insensitive exact match in auto captions
3. Alias mapping (e.g., `zh` to `zh-Hans`, `zh-tw` to `zh-Hant`, `pt-br` to `pt`)
4. Base language fallback (e.g., `en` matches `en-US`)

**Auto-Selection (when `lang` is omitted):**
1. First manual subtitle track (excluding `live_chat`)
2. Original ASR auto-caption track (`kind=asr`, no `tlang`)
3. First available auto-caption track

**Example Request**

```bash
# Auto-select language
curl "http://127.0.0.1:5000/api/captions?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Specific language
curl "http://127.0.0.1:5000/api/captions?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&lang=es"
```

**Success Response (200 OK)**

```json
{
  "segments": [
    {
      "startMs": 0,
      "endMs": 1800,
      "text": "We're no strangers to love"
    },
    {
      "startMs": 1800,
      "endMs": 4200,
      "text": "You know the rules and so do I"
    },
    {
      "startMs": 4200,
      "endMs": 7500,
      "text": "A full commitment's what I'm thinking of"
    }
  ],
  "language": "en",
  "languageName": "English",
  "type": "manual"
}
```

**Response Fields**

| Field | Type | Description |
|---|---|---|
| `segments` | array | Array of `{startMs, endMs, text}` objects |
| `segments[].startMs` | number | Segment start time in milliseconds |
| `segments[].endMs` | number | Segment end time in milliseconds |
| `segments[].text` | string | Caption text (newlines replaced with spaces) |
| `language` | string | Language code of the returned captions |
| `languageName` | string | Human-readable language name |
| `type` | string | Caption type: `"manual"`, `"auto"`, or `"auto-translated"` |

**Error Responses**

| Status | Condition | Example Response |
|---|---|---|
| 400 | Missing `url` parameter | `{"error": "Missing 'url' query parameter"}` |
| 403 | Private video | `{"error": "This video is private"}` |
| 404 | No captions available | `{"error": "No captions available for this video"}` |
| 404 | Language not found | `{"error": "No captions available for language: fr"}` |
| 500 | Caption fetch or parse failure | `{"error": "Failed to fetch captions. Please try again."}` |

**Translation Fallback:**

When fetching translated caption tracks (URLs containing `tlang=`), YouTube frequently returns HTTP 429. In this case, the backend:
1. Fetches the original ASR caption track (not rate-limited)
2. Translates segments via Google Translate free API (`translate.googleapis.com`)
3. Returns the result with `"type": "auto-translated"`

---

### 3. GET `/api/formats`

Return available download formats with estimated file sizes and duration limit information.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Full YouTube URL |

**Example Request**

```bash
curl "http://127.0.0.1:5000/api/formats?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Success Response (200 OK)**

```json
{
  "duration": 212,
  "formats": {
    "720p HD": {
      "sizeMB": 45.2,
      "available": true,
      "overLimit": false,
      "maxMinutes": 45
    },
    "480p": {
      "sizeMB": 28.7,
      "available": true,
      "overLimit": false,
      "maxMinutes": 60
    },
    "360p": {
      "sizeMB": 18.3,
      "available": true,
      "overLimit": false,
      "maxMinutes": 120
    },
    "240p": {
      "sizeMB": 10.1,
      "available": true,
      "overLimit": false,
      "maxMinutes": 120
    },
    "Audio Only": {
      "sizeMB": 3.4,
      "available": true,
      "overLimit": false,
      "maxMinutes": 60
    }
  }
}
```

**Response Fields**

| Field | Type | Description |
|---|---|---|
| `duration` | number | Video duration in seconds |
| `formats` | object | Map of quality labels to format info |
| `formats[quality].sizeMB` | number | Estimated file size in megabytes |
| `formats[quality].available` | boolean | Whether this quality is available for the video |
| `formats[quality].overLimit` | boolean | Whether the video exceeds the duration limit for this quality |
| `formats[quality].maxMinutes` | number | Maximum allowed duration in minutes for this quality |

**Duration Limits (enforced by backend)**

| Quality | Max Duration (seconds) | Max Duration (minutes) |
|---|---|---|
| 720p HD | 2700 | 45 |
| 480p | 3600 | 60 |
| 360p | 7200 | 120 |
| 240p | 7200 | 120 |
| Audio Only | 3600 | 60 |

**Size Estimation Logic:**
1. Use `filesize` from yt-dlp format info (exact)
2. Fallback to `filesize_approx` (approximate)
3. Fallback to bitrate calculation: `tbr * 1000 / 8 * duration * 1.1` (estimated with 10% overhead)

**Error Responses**

| Status | Condition | Example Response |
|---|---|---|
| 400 | Missing `url` parameter | `{"error": "Missing 'url' query parameter"}` |
| 500 | Extraction failure | `{"error": "<exception message>"}` |

---

### 4. GET `/api/download`

Download video (MP4) or audio (MP3) in the specified quality. Returns a binary file stream.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | Yes | Full YouTube URL |
| `quality` | string | Yes | One of: `720p HD`, `480p`, `360p`, `240p`, `Audio Only` |

**Example Request**

```bash
# Download 360p MP4
curl -L -o video.mp4 \
  "http://127.0.0.1:5000/api/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&quality=360p"

# Download Audio Only MP3
curl -L -o audio.mp3 \
  "http://127.0.0.1:5000/api/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&quality=Audio%20Only"
```

**Success Response (200 OK)**

- **Content-Type:** `video/mp4` (video) or `audio/mpeg` (audio)
- **Content-Disposition:** `attachment; filename="VoxText-AI_<title>.<ext>"`
- **Body:** Binary file stream

**Download Format Selection:**

| Quality | yt-dlp Format String | Output |
|---|---|---|
| 720p HD | `bestvideo[height<=720]+bestaudio/best[height<=720]/best` | MP4 |
| 480p | `bestvideo[height<=480]+bestaudio/best[height<=480]/best` | MP4 |
| 360p | `bestvideo[height<=360]+bestaudio/best[height<=360]/best` | MP4 |
| 240p | `bestvideo[height<=240]+bestaudio/best[height<=240]/best` | MP4 |
| Audio Only | `bestaudio/best` + FFmpeg postprocessor (192kbps MP3) | MP3 |

**Error Responses**

| Status | Condition | Example Response |
|---|---|---|
| 400 | Missing parameters | `{"error": "Missing 'url' or 'quality' parameter"}` |
| 400 | Invalid quality value | `{"error": "Invalid quality: 1080p"}` |
| 400 | Duration exceeds limit | `{"error": "Video too long for 720p HD. Max: 45 minutes"}` |
| 500 | Download failure | `{"error": "Download failed: <reason>"}` |
| 500 | File not found after download | `{"error": "Download completed but file not found"}` |

**File Cleanup:** After streaming the file, the backend schedules a background thread to delete the temp directory after a 10-second delay.

---

## Client-Side Operations

These operations are performed entirely in the browser and do not involve backend API calls.

### YouTube URL Validation

The frontend validates URLs before making any API call using this regex:

```
^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)[a-zA-Z0-9_-]{11}([?&].*)?$
```

**Supported URL formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID&list=...`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

### Transcript Export

Transcript export is performed client-side using the `segments` array from `/api/captions`. No backend endpoint exists for export.

| Format | Method | MIME Type | Extension |
|---|---|---|---|
| **TXT** | Join segment texts with newlines | `text/plain;charset=utf-8` | `.txt` |
| **SRT** | Format with sequence numbers and `HH:MM:SS,mmm` timestamps | `text/plain;charset=utf-8` | `.srt` |
| **DOCX** | HTML table with Time and Text columns (Word-compatible HTML) | `application/msword` | `.doc` |

**Output Filename:** `VoxText-AI_{sanitized_title}.{ext}`

Characters `< > : " / \ | ? *` are removed from the title for filename safety.

---

## Common Error Model

### Current Backend Error Format

All error responses use a simple JSON object:

```json
{
  "error": "Human-readable error message"
}
```

### Recommended Normalized Format (Frontend)

The frontend can normalize errors into a richer structure for consistent handling:

```json
{
  "code": "CAPTIONS_NOT_FOUND",
  "message": "No captions available for this video.",
  "details": {
    "videoId": "abc123def45",
    "requestedLang": "fr"
  },
  "retryable": false
}
```

| Field | Type | Description |
|---|---|---|
| `code` | string | Machine-readable error code |
| `message` | string | Human-readable error message |
| `details` | object | Additional context (optional) |
| `retryable` | boolean | Whether the client should retry |

---

## Timeouts and Retries

### Frontend Timeouts

| Operation | Timeout | Implementation |
|---|---|---|
| Metadata fetch (`/api/metadata`) | 15 seconds | `AbortController` with `setTimeout` |
| Caption fetch (`/api/captions`) | 60 seconds | `AbortController` with `setTimeout` |
| Video download (`/api/download`) | 10 minutes | `AbortSignal.timeout(600000)` |
| YouTube Data API | 5 seconds | `AbortController` with `setTimeout` |
| Piped API | 5 seconds | `AbortController` with `setTimeout` |
| oEmbed / CORS proxy | 5-8 seconds | `AbortController` with `setTimeout` |
| HTML scraping | 8-10 seconds | `AbortController` with `setTimeout` |

### Backend Timeouts

| Operation | Timeout | Implementation |
|---|---|---|
| Caption URL fetch (urllib) | 15 seconds | `urlopen(req, timeout=15)` |
| Google Translate request | 15 seconds | `urlopen(req, timeout=15)` |
| yt-dlp extraction | No explicit timeout | Depends on YouTube response |

### Retry Strategy

| Layer | Operation | Retry Behavior |
|---|---|---|
| Backend | Caption fetch (original) | Try `_fetch_url_with_cookies`, fallback to `_fetch_url_via_ytdlp` |
| Backend | Caption fetch (translated) | Try YouTube once, fallback to Google Translate |
| Frontend | Metadata fetch | Cascading fallbacks through 7+ methods |
| Frontend | No automatic retries | User must click again on failure |

---

## Rate Limit Guidance

### Server-Side

No explicit rate limiting is enforced on the Flask API server. For production deployments:

- Add per-IP rate limiting via nginx `limit_req` or Flask middleware
- Recommended limits: 10 metadata requests/minute/IP, 5 download requests/minute/IP

### YouTube Rate Limits

YouTube may return HTTP 429 for excessive requests. The backend mitigates this with:

- In-memory metadata cache (5-minute TTL)
- Shared cookie jar for session continuity
- Google Translate fallback for rate-limited translated captions

**Client guidance:** If you receive a 429-related error, wait at least 30 seconds before retrying.

---

## Related Documents

- [README](README.md) — Project overview
- [Architecture](Architecture.md) — System architecture and data flow
- [Error Handling](Error-Handling.md) — Error playbook and troubleshooting
- [User Flow](User-flow.md) — User flow documentation
- [Setup Guide](Setup-Guide.md) — Installation and configuration
