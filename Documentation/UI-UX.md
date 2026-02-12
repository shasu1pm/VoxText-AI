# UI and UX Specification

**Purpose:** Describe the user experience, UI structure, and interaction rules for VoxText AI.
**Audience:** Frontend developers, designers, and QA.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Theme and Visual Direction
- Page Sections
- Interaction Rules
- UX States
- Mobile Responsiveness
- Accessibility Notes
- Related Documents

## Theme and Visual Direction
- Visual style: glassmorphism panels over a full-screen background image.
- Primary accent: neon green gradients (`#B4FF00` to `#8FD500`).
- Secondary accents: red gradient for downloads, purple panels for transcript workspace.
- Typography: bold, high-contrast headings and small, dense labels for metadata.

## Page Sections
### Header and Navigation
- Sticky header with logo and external links.
- Two layouts: single-row on desktop, stacked on mobile/tablet.

### Input Panel
- URL input with dashed border container and inline error message.
- Primary action: `Read my URL` button.
- Progress panel shows title preview and progress bar while processing.

### Action Buttons
- `Get My Transcript` and `Download Your Video` are displayed after metadata load.
- Buttons are disabled for live streams.

### Status Cards
- `AI Powered Intelligence` panel shows transcript workflow and output language selection.
- Output language dropdown includes a search field and an Auto Detect option (shown as `Subtitles-Detected`).

### Results Sections
- Transcript downloads appear after successful caption fetch.
- Download quality list shows size estimates, availability, and limits.

## Interaction Rules
- URL input validates on change; invalid input shows `Please enter a valid YouTube URL`.
- `Read my URL` is disabled until the URL is valid.
- Metadata progress bar fills during `Read my URL` and completes before showing results.
- Transcript progress bar increases toward ~90% while awaiting `/api/captions`, then completes on success.
- Download panel shows a spinner while formats are loading and a progress bar while downloading.
- `Get My Transcript` is disabled when captions are unavailable or the video is live.
- `Download Your Video` triggers format fetch and displays availability.
- `Reset` clears state and session storage.

## UX States
| State | Trigger | UI Response |
| --- | --- | --- |
| Empty | No URL entered | Shows input panel and prompt text |
| Validating | User types URL | Error text shown for invalid URLs |
| Fetching Metadata | `Read my URL` clicked | Progress bar + title placeholder |
| Language Detected | Metadata resolved | `Language Detected: <language>` pill updates |
| Transcript Ready | Captions fetched | Transcript download buttons appear |
| Download Ready | Formats fetched | Quality list appears |
| Error | Backend or network failure | Inline error card with message |

## Mobile Responsiveness
- Header breaks into two sections (logo + CTA, then nav links).
- Main content stacks from two columns to one.
- Buttons and labels scale down for smaller screens.

## Accessibility Notes
- The URL input supports `Enter` to submit.
- Buttons use clear labels and visible focus states via Tailwind.
- Improvements recommended: explicit ARIA labels for icons and improved color contrast for small text.

## Related Documents
- [README](README.md)
- [User Flow](User-flow.md)
- [Error Handling](Error-Handling.md)
