# User Flows

**Purpose:** Document the two primary user flows and their backend interactions.
**Audience:** Developers, QA, and product stakeholders.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Flow A: Get My Transcript
- Flow B: Download Your Video
- Related Documents

## Flow A: Get My Transcript
### Step-by-Step
1. User pastes a YouTube URL.
2. UI validates URL and enables `Read my URL`.
3. User clicks `Read my URL`.
4. Frontend calls `/api/metadata` and displays progress.
5. Metadata populates the preview card and `Language Detected`.
6. User selects `Get My Transcript`.
7. Frontend calls `/api/captions` with optional `lang` parameter.
8. Transcript segments are received and rendered as download options.
9. User downloads `DOCX`, `TXT`, or `SRT` (client-side export).

### UI State Transitions
- Empty -> Validated -> Processing -> Completed -> Transcript Panel -> Download Options.

### Backend Calls
- `GET /api/metadata?url=...`
- `GET /api/captions?url=...&lang=...`

### Happy Path
- Captions exist, and segments are returned.
- User downloads transcript file successfully.

### Failure Paths
- Invalid URL -> inline validation error.
- Private/deleted video -> backend returns 403/404.
- No captions -> UI shows `No captions available for this video.`
- Rate limit (429) -> user instructed to retry after 30 seconds.
- Network/timeout -> UI shows `Request timed out. Please try again.`

### Flowchart
```mermaid
flowchart TD
  A[Paste YouTube URL] --> B{Valid URL?}
  B -- No --> C[Show Validation Error]
  B -- Yes --> D[Click Read my URL]
  D --> E[/api/metadata]
  E --> F{Metadata OK?}
  F -- No --> G[Show Metadata Error]
  F -- Yes --> H[Click Get My Transcript]
  H --> I[/api/captions]
  I --> J{Captions OK?}
  J -- No --> K[Show Caption Error]
  J -- Yes --> L[Show Download Options]
```

## Flow B: Download Your Video
### Step-by-Step
1. User pastes a YouTube URL and clicks `Read my URL`.
2. Metadata populates the preview card.
3. User clicks `Download Your Video`.
4. Frontend calls `/api/formats` to fetch availability and size estimates.
5. User selects a quality (MP4/MP3).
6. Frontend calls `/api/download` and streams the file.

### UI State Transitions
- Completed -> Download Panel -> Formats Loaded -> Download In Progress -> Download Complete.

### Backend Calls
- `GET /api/formats?url=...`
- `GET /api/download?url=...&quality=...`

### Happy Path
- Video within duration limits.
- Download completes successfully.

### Failure Paths
- Video too long -> `Video too long for <quality>. Max: <minutes> minutes`.
- Formats unavailable -> UI shows `Unavailable`.
- Backend offline -> `Failed to connect to server`.
- Timeout -> `Download timed out`.

### Flowchart
```mermaid
flowchart TD
  A[Metadata Ready] --> B[Click Download Your Video]
  B --> C[/api/formats]
  C --> D{Formats OK?}
  D -- No --> E[Show Format Error]
  D -- Yes --> F[Select Quality]
  F --> G[/api/download]
  G --> H{Download OK?}
  H -- No --> I[Show Download Error]
  H -- Yes --> J[Save File]
```

## Related Documents
- [README](README.md)
- [API](API.md)
- [Error Handling](Error-Handling.md)
