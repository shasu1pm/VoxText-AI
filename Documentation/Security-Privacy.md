# Security and Privacy

**Purpose:** Describe how VoxText AI handles data, secrets, and basic security practices.
**Audience:** Developers, maintainers, and reviewers.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Data Handling Policy
- Retention and Storage
- Secrets Handling
- Threat Model
- Safe Logging Practices
- File Cleanup Strategy
- Compliance Notes
- Related Documents

## Data Handling Policy
- Collected: YouTube URLs, metadata, caption segments (in memory during processing).
- Not stored: audio/video files or transcripts beyond the processing session.

## Retention and Storage
- Metadata is cached in memory for 5 minutes to reduce repeated extraction.
- Downloads are stored in temporary directories and deleted shortly after the response is sent.

## Secrets Handling
- `VITE_YOUTUBE_API_KEY` is optional and stored in the frontend `.env` file.
- Do not commit API keys to the repo.
- Note: frontend environment variables are exposed to the browser; restrict API keys accordingly.

## Threat Model
- Abuse prevention: no built-in rate limiting; add per-IP limits or queues in production.
- Input validation: frontend regex plus backend `yt-dlp` extraction.
- CORS: currently permissive in development; should be restricted in production.

## Safe Logging Practices
- Avoid logging full URLs or personal identifiers in production logs.
- Log only anonymized IDs or shortened URLs when possible.

## File Cleanup Strategy
- Backend downloads to a temp directory per request.
- Cleanup runs in a background thread and deletes files after completion.

## Compliance Notes
- Respect YouTube Terms of Service and copyright laws.
- Provide clear user-facing disclaimers about content rights.

## Related Documents
- [README](README.md)
- [Error Handling](Error-Handling.md)
- [Setup Guide](Setup-Guide.md)
