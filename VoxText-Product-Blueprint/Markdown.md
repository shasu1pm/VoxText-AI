# VoxText — Product One-Pager

## Elevator Pitch

VoxText converts audio and video files into accurate text transcripts in minutes. It is open-source, privacy-first, and can run fully offline on low-cost infrastructure.

## Problem + Why Now

- Creators, educators, and teams need transcripts but face high SaaS costs and privacy concerns.
- Edge hosting and lightweight models make self-hosted transcription viable today.

## Solution

- Simple upload-to-transcript workflow.
- English-only gating today for reliability and speed.
- Download in TXT, DOCX, or SRT.
- Fully self-hostable backend.

## Key Differentiators

- Open-source and auditable
- Privacy-first (no third-party transcription APIs in VOSK mode)
- Low-cost infrastructure (CPU-only)
- Edge-hosted UI (Cloudflare Pages)

## Current Status

- **Live frontend:** https://voxtext-ai.pages.dev/
- **Backend:** FastAPI service (self-hosted)
- **Engine (repo):** VOSK (current)
- **Limitation:** No YouTube link ingestion in this repo

## Roadmap Milestones

- **Whisper → VOSK migration:** Completed in this repo (use VOSK today). If production still runs Whisper, migrate to VOSK for lower cost.
- **Quality upgrades:** Optional larger VOSK models and improved language ID.
- **Async processing:** Job IDs + status endpoints.
- **Monetization:** Freemium tiers and usage-based billing.

## Business Model Options

- Freemium (minutes/month)
- Pay-as-you-go transcription
- API access for developers
- Enterprise/on-prem deployments

## Competitive Landscape (Categories)

- Paid SaaS transcription tools
- Open-source CLI transcribers
- Cloud speech APIs

## Metrics to Track

- Activation rate (upload → transcript)
- Transcription success rate
- Median processing latency
- Cost per minute of audio
- Retention (weekly active users)