# Roadmap

**Purpose:** Outline planned milestones and feature direction for VoxText AI.
**Audience:** Maintainers and contributors.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Now (v0.1)
- Next (v0.2)
- Later (v1.0)
- Related Documents

## Now (v0.1)
- Core transcript flow via captions.
- Video and audio download in common quality tiers.
- Language detection via `yt-dlp` metadata.
- Client-side transcript export.

## Next (v0.2)
- Multi-language expansion plan: improve language mapping and caption selection UX.
- Better progress UI with real download progress metrics.
- Configurable backend base URL (env-based).
- Improved caching and rate limiting.
- Tests and basic CI (lint/build checks).

## Later (v1.0)
- Queue system for long-running downloads.
- Horizontal scaling with shared cache.
- Account-less usage improvements (token-based throttling or anonymous quotas).
- Observability stack (metrics, traces, structured logs).
- CI/CD pipelines for automated deploys.

## Related Documents
- [README](README.md)
- [PRD](PRD.md)
