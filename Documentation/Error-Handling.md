# Error Handling Playbook

**Purpose:** Provide a clear catalog of errors, user messages, and recommended responses.
**Audience:** Frontend and backend developers, QA, and support.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Error Model
- UI Error Display Rules
- Error Catalog
- Troubleshooting
- Related Documents

## Error Model
Current backend error response:
```json
{ "error": "Human-readable message" }
```

UI can normalize errors into:
```json
{ "code": "string", "message": "string", "details": {}, "retryable": true }
```

## UI Error Display Rules
- Inline validation errors appear near the URL input.
- Transcript and download errors appear inside the relevant panel.
- Blocking errors (backend unreachable or timeout) should disable action buttons until resolved.

## Error Catalog
| Category | Trigger | User Message | Dev Log Message | Retry Guidance |
| --- | --- | --- | --- | --- |
| Validation | URL fails regex | `Please enter a valid YouTube URL` | `WARN invalid_url` | User must fix URL |
| Private Video | Backend detects private video | `This video is private` | `INFO private_video` | No retry unless access changes |
| Unavailable Video | Removed or unavailable | `This video is unavailable or deleted` | `INFO video_unavailable` | Try another URL |
| No Captions | No captions in metadata | `No captions available for this video.` | `INFO no_captions` | No retry unless captions added |
| Caption Language Missing | Requested language not found | `No captions available for language: <lang>` | `INFO caption_lang_missing` | Choose another language |
| Rate Limited | YouTube 429 during captions | `YouTube is temporarily limiting requests. Please wait 30 seconds and try again.` | `WARN youtube_429` | Retry after 30 seconds |
| Caption Fetch Failed | HTTP error while fetching captions | `Failed to fetch captions: HTTP <code>` | `ERROR caption_fetch_http` | Retry once |
| Caption Parse Failed | Caption format invalid | `Failed to parse caption content` | `ERROR caption_parse` | Retry or try another video |
| Download Limit | Duration exceeds quality limit | `Video too long for <quality>. Max: <minutes> minutes` | `INFO download_limit` | Choose lower quality or shorter video |
| Download Failed | Download/merge failure | `Download failed: <reason>` | `ERROR download_failed` | Retry after verifying dependencies |
| Backend Offline | Fetch fails | `Failed to connect to the backend. Make sure the server is running.` | `ERROR backend_unreachable` | Start backend and retry |
| Timeout (Transcript) | Request > 30s | `Request timed out. Please try again.` | `WARN transcript_timeout` | Retry after a short wait |
| Timeout (Download) | Download > 10 min | `Download timed out` | `WARN download_timeout` | Retry with lower quality |

## Troubleshooting
- If you see `Failed to connect to server`, verify the backend is running on `127.0.0.1:5000`.
- If downloads fail, ensure `ffmpeg` is installed and on PATH.
- If captions fail repeatedly, the video might not have captions or YouTube may be rate limiting.
- If CORS issues appear in the browser console, confirm frontend and backend origins are compatible.

## Related Documents
- [README](README.md)
- [API](API.md)
- [Setup Guide](Setup-Guide.md)
