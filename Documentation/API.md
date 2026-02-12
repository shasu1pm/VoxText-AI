# API Specification

**Purpose:** Define the backend API contract and client-side operations for VoxText AI.
**Audience:** Frontend developers, backend maintainers, and integrators.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Base URLs
- Authentication
- Common Headers
- Endpoints
- Client-Side Operations (No Backend Endpoint)
- Common Error Model
- Timeouts and Retries
- Rate Limit Guidance
- Related Documents

## Base URLs
- Local backend: `http://127.0.0.1:5000`
- Example production backend: `https://your-backend-domain.example`

## Authentication
None. The current implementation does not require authentication.

## Common Headers
- Requests: `Accept: application/json`
- Downloads: `Content-Disposition` is returned for filename handling.

## Endpoints
### 1) GET `/api/metadata`
Fetch metadata and caption availability.

**Query Parameters**
- `url` (required): YouTube URL.

**Example Request**
```bash
curl "http://127.0.0.1:5000/api/metadata?url=https://www.youtube.com/watch?v=VIDEO_ID"
```

**Response (200)**
```json
{
  "duration": 1234,
  "channelName": "Example Channel",
  "title": "Example Title",
  "thumbnail": "https://...",
  "videoId": "abc123def45",
  "language": "English",
  "playableInEmbed": true,
  "captionLanguage": "English",
  "captionLanguageCode": "en",
  "hasCaptions": true,
  "availableCaptionLanguages": {
    "en": { "name": "English", "type": "manual" },
    "es": { "name": "Spanish", "type": "auto" }
  },
  "isLive": false
}
```

**Errors**
- `400` missing `url` or invalid URL
- `403` private video
- `404` unavailable or deleted video
- `500` server error

### 2) GET `/api/captions`
Fetch caption segments.

**Query Parameters**
- `url` (required): YouTube URL.
- `lang` (optional): caption language code. If omitted, backend auto-selects.

**Example Request**
```bash
curl "http://127.0.0.1:5000/api/captions?url=https://www.youtube.com/watch?v=VIDEO_ID&lang=en"
```

**Response (200)**
```json
{
  "segments": [
    { "startMs": 0, "endMs": 1800, "text": "Hello world" },
    { "startMs": 1800, "endMs": 3200, "text": "Welcome" }
  ],
  "language": "en",
  "languageName": "English",
  "type": "manual"
}
```

**Errors**
- `404` no captions or language not available
- `429` YouTube rate limited (retry later)
- `500` caption fetch or parse failure

### 3) GET `/api/formats`
Return available download formats and size estimates.

**Query Parameters**
- `url` (required): YouTube URL.

**Example Request**
```bash
curl "http://127.0.0.1:5000/api/formats?url=https://www.youtube.com/watch?v=VIDEO_ID"
```

**Response (200)**
```json
{
  "duration": 1234,
  "formats": {
    "720p HD": { "sizeMB": 120.5, "available": true, "overLimit": false, "maxMinutes": 45 },
    "480p": { "sizeMB": 85.3, "available": true, "overLimit": false, "maxMinutes": 60 },
    "360p": { "sizeMB": 60.1, "available": true, "overLimit": false, "maxMinutes": 120 },
    "240p": { "sizeMB": 35.7, "available": true, "overLimit": false, "maxMinutes": 120 },
    "Audio Only": { "sizeMB": 12.0, "available": true, "overLimit": false, "maxMinutes": 60 }
  }
}
```

### 4) GET `/api/download`
Download video or audio.

**Query Parameters**
- `url` (required): YouTube URL.
- `quality` (required): `720p HD`, `480p`, `360p`, `240p`, or `Audio Only`.

**Example Request**
```bash
curl -L "http://127.0.0.1:5000/api/download?url=https://www.youtube.com/watch?v=VIDEO_ID&quality=360p" -o video.mp4
```

**Response (200)**
- Binary stream with `Content-Disposition` header for filename.

**Errors**
- `400` invalid quality or duration exceeds limits
- `500` download failure

## Client-Side Operations (No Backend Endpoint)
### Validate YouTube URL
The frontend validates URLs using a regex before any API call.

```text
^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)[a-zA-Z0-9_-]{11}([?&].*)?$
```

### Transcript Export (`DOCX`, `TXT`, `SRT`)
Export is performed in the browser using the `segments` response. No backend endpoint exists for export.

## Common Error Model
Current backend error response:
```json
{ "error": "Human-readable message" }
```

For UI normalization, the frontend can map the above into:
```json
{ "code": "string", "message": "string", "details": {}, "retryable": true }
```

## Timeouts and Retries
- Frontend metadata timeout: 15 seconds.
- Frontend captions timeout: 30 seconds.
- Frontend download timeout: 10 minutes.
- Backend caption fetch retries: up to 3 attempts with backoff for transient errors.

## Rate Limit Guidance
No explicit rate limiting is enforced server-side. If YouTube returns HTTP 429, clients should wait at least 30 seconds before retrying.

## Related Documents
- [README](README.md)
- [Architecture](Architecture.md)
- [Error Handling](Error-Handling.md)
