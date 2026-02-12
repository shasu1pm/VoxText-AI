# Language Detection Flow

**Purpose:** Explain how VoxText AI detects and displays language using open-source metadata and caption tracks.
**Audience:** Developers and contributors working on language handling or captions.
**Last Updated:** February 11, 2026
**Version:** v0.1

## Table of Contents
- Definitions
- Inputs and Outputs
- Backend Language Detection Algorithm
- Caption Language Selection
- Language Name Mapping
- Frontend Display Behavior
- Example JSON Outputs
- Edge Cases
- Related Documents

## Definitions
- **Language Detected:** The spoken language inferred by the backend from `yt-dlp` metadata. Displayed in the UI as `Language Detected: <language>`.
- **Auto Detect:** The default output-language option. In the UI it appears as `Subtitles-Detected` and uses the backend-selected caption language.
- **Subtitles-Detected:** The caption track selected for transcript generation. Displayed in the output language dropdown.
- **Output Language:** The caption language requested by the user. This selects an existing caption track; it does not perform machine translation.

## Inputs and Outputs
**Inputs (backend):**
- `title`, `tags`, `language` (uploader-set), `subtitles`, and `automatic_captions` from `yt-dlp`.

**Outputs (backend `/api/metadata`):**
- `language` (string): detected spoken language.
- `captionLanguage` (string): preferred caption track name.
- `captionLanguageCode` (string): preferred caption language code.
- `availableCaptionLanguages` (map): all available caption tracks and types.

## Backend Language Detection Algorithm
The Flask backend (`/api/metadata`) uses `yt-dlp` metadata and applies a priority chain:
1. Title hints (pattern matching for language mentions and through/via phrases).
2. Script detection (non-Latin Unicode ranges in title).
3. Tags containing language keywords.
4. YouTube uploader-set `language` field.
5. Auto-caption original language (ASR track without `tlang`).

This is a fully open-source approach and does not use Whisper or proprietary transcription.

## Caption Language Selection
Caption selection is separate from `Language Detected` and is used for transcripts.
1. Prefer manual subtitles when available.
2. Otherwise, use the original auto-caption (ASR) track.
3. When a `lang` parameter is provided, the backend resolves it using case-insensitive matching, alias mapping (for example `zh` -> `zh-Hans`), and base-language fallback (for example `en` for `en-US`).

Note: a YouTube Data API `defaultAudioLanguage` fallback is not implemented in the current backend. If added later, it should be used only when caption tracks are unavailable.

## Language Name Mapping
The backend maps language codes to human-readable names via a static map (for example `en` -> `English`, `zh-Hans` -> `Chinese (Simplified)`). If a code is unknown, it is returned as-is or uppercased in the UI fallback.

## Frontend Display Behavior
1. On `Read my URL`, the frontend calls `/api/metadata` and uses the returned `language` value as `Language Detected`.
2. If the backend does not return a language, the frontend tries lightweight heuristics (URL `hl` parameter, HTML `lang` or `inLanguage`) and defaults to `English`.
3. The output dropdown shows `Subtitles-Detected: <captionLanguage>` if captions exist, shows `Subtitles-Detected: Captions not available` when captions are missing, and falls back to `Language Detected` if caption language is unknown.
4. The `Auto Detect` option maps to the backend-selected caption language.

## Example JSON Outputs
### Metadata Example
```json
{
  "language": "Tamil",
  "captionLanguage": "Tamil",
  "captionLanguageCode": "ta",
  "hasCaptions": true,
  "availableCaptionLanguages": {
    "ta": { "name": "Tamil", "type": "manual" },
    "en": { "name": "English", "type": "auto" }
  }
}
```

### Captions Example
```json
{
  "segments": [
    { "startMs": 0, "endMs": 1200, "text": "Sample text" }
  ],
  "language": "ta",
  "languageName": "Tamil",
  "type": "manual"
}
```

## Edge Cases
- Captions disabled -> `No captions available for this video.`
- Multiple caption languages -> first manual subtitle is selected by default.
- Auto captions missing or incomplete -> backend returns `No captions available`.
- Non-Latin titles -> script detection may override title hints.
- Ambiguous titles -> language may be inferred from tags or uploader language field.
- Live streams -> transcript and download actions are disabled.

## Related Documents
- [README](README.md)
- [API](API.md)
- [User Flow](User-flow.md)
