# UI/UX Specification

**VoxText AI -- User Interface and User Experience Design Specification**

> **Purpose:** Define the complete visual design system, UI component structure, interaction rules, UX states, responsive behavior, and accessibility considerations for VoxText AI.
> **Audience:** Frontend developers, UI/UX designers, QA engineers, and contributors working on the interface.
> **Last Updated:** 2026-02-12
> **Version:** 0.1.0

---

## Table of Contents

- [Theme and Visual Direction](#theme-and-visual-direction)
  - [Design Philosophy](#design-philosophy)
  - [Glassmorphism System](#glassmorphism-system)
  - [Custom Theme CSS](#custom-theme-css)
  - [Typography](#typography)
- [Color Palette](#color-palette)
- [Page Sections](#page-sections)
  - [Header and Navigation](#header-and-navigation)
  - [Hero Section](#hero-section)
  - [Input Panel](#input-panel)
  - [Progress Section](#progress-section)
  - [Results Section](#results-section)
  - [Action Buttons](#action-buttons)
  - [Capability Indicators](#capability-indicators)
  - [Bottom Category Navigation](#bottom-category-navigation)
- [Interaction Rules](#interaction-rules)
- [UX States](#ux-states)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility Notes](#accessibility-notes)
- [Related Documents](#related-documents)

---

## Theme and Visual Direction

### Design Philosophy

VoxText AI uses a **glassmorphism** visual style layered over a full-screen background image. The interface communicates a modern, premium aesthetic through translucent panels, neon green accent gradients, and high-contrast white typography against dark, blurred backdrops.

### Glassmorphism System

All container panels share a consistent glassmorphism treatment:

| Property | Value | Purpose |
|---|---|---|
| `backdrop-blur-md` | ~12px blur | Frosted glass effect over background image |
| `bg-white/10` | 10% white opacity | Translucent panel fill |
| `border border-white/20` | 20% white opacity | Subtle edge definition |
| `shadow-lg` / `shadow-2xl` | Tailwind shadow tokens | Depth and elevation |
| `rounded-3xl` | 1.5rem border radius | Primary containers (input panel) |
| `rounded-full` | 9999px border radius | Navigation bar (desktop), pill buttons |
| `rounded-2xl` | 1rem border radius | Navigation bar (mobile), secondary containers |
| `rounded-xl` | 0.75rem border radius | Buttons, cards, inner panels |
| `rounded-lg` | 0.5rem border radius | Dropdown items, progress bars, small elements |

**Background setup:**

```css
backgroundImage: url(bgImage)
backgroundSize: cover
backgroundPosition: center
backgroundRepeat: no-repeat
backgroundAttachment: fixed
```

The root container is `h-screen w-screen` with `overflow-x-hidden overflow-y-auto`. All scrollbars are hidden globally via CSS (`scrollbar-width: none` for Firefox, `::-webkit-scrollbar { display: none }` for Chrome/Safari).

### Custom Theme CSS

The project uses a custom `theme.css` that defines CSS custom properties for both light and dark modes:

**Light mode (`:root`):**

```css
--font-size: 16px;
--background: #ffffff;
--destructive: #d4183d;
--destructive-foreground: #ffffff;
--primary: #030213;
--border: rgba(0, 0, 0, 0.1);
--radius: 0.625rem;
```

**Dark mode (`.dark`):**

```css
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--destructive: oklch(0.396 0.141 25.723);
--destructive-foreground: oklch(0.637 0.237 25.331);
--border: oklch(0.269 0 0);
```

The `@theme inline` block maps these variables to Tailwind CSS 4 color tokens (e.g., `--color-background`, `--color-destructive`), enabling utility classes like `bg-background`, `text-destructive` throughout the application.

### Typography

| Element | Font Size | Font Weight | Line Height |
|---|---|---|---|
| `html` (base) | `var(--font-size)` = 16px | -- | -- |
| `h1` | `var(--text-2xl)` | 500 (medium) | 1.5 |
| `h2` | `var(--text-xl)` | 500 (medium) | 1.5 |
| `h3` | `var(--text-lg)` | 500 (medium) | 1.5 |
| `h4` | `var(--text-base)` | 500 (medium) | 1.5 |
| `label` | `var(--text-base)` | 500 (medium) | 1.5 |
| `button` | `var(--text-base)` | 500 (medium) | 1.5 |
| `input` | `var(--text-base)` | 400 (normal) | 1.5 |

The hero title uses `clamp()` for fluid sizing: `clamp(14.4px, 2.88vw, 38.4px)` for the main title line and `clamp(12px, 1.8vw, 22px)` for the subtitle.

---

## Color Palette

| Token | Hex / Value | Usage |
|---|---|---|
| **Primary Green (from)** | `#B4FF00` | Gradient start for CTA buttons, progress bars, active accents |
| **Primary Green (to)** | `#8FD500` | Gradient end for CTA buttons, progress text, icon tints |
| **Destructive Red** | `#d4183d` | `--destructive` CSS variable for error states |
| **Download Button Red (from)** | `#FF0000` | Gradient start for "Download Your Video" button |
| **Download Button Red (to)** | `#CC0000` | Gradient end for "Download Your Video" button |
| **Background White** | `#ffffff` | Light mode `--background`; input field background |
| **Dark Background** | `oklch(0.145 0 0)` | Dark mode `--background` |
| **Text White** | `text-white` (100%) | Primary headings and labels |
| **Text White/90** | `text-white/90` | Body text, nav links |
| **Text White/70** | `text-white/70` | Secondary metadata (channel name, duration) |
| **Text White/60** | `text-white/60` | Tertiary text, empty state messages |
| **Text White/40** | `text-white/40` | Placeholder text, disabled icons |
| **Panel White/10** | `bg-white/10` | Glassmorphism panel fill |
| **Panel White/5** | `bg-white/5` | Inner card backgrounds (thumbnail card, quality rows) |
| **Border White/20** | `border-white/20` | Panel borders |
| **Border White/10** | `border-white/10` | Inner card borders, dividers |
| **Transcript Dropdown BG** | `#38235c` | Purple background for language dropdown panel |
| **Download Progress Purple** | `from-purple-500 to-purple-400` | Download-in-progress bar gradient |
| **Download Panel Icon** | `text-purple-400` | Download workspace icon tint |
| **Download Panel Accent** | `bg-purple-500/20` | Download workspace icon background |
| **DOCX Button** | `bg-blue-600` | Transcript DOCX download button |
| **TXT Button** | `bg-green-600` | Transcript TXT download button |
| **SRT Button** | `bg-purple-600` | Transcript SRT download button |
| **Availability: Available** | `bg-[#8FD500]` | Green dot indicator |
| **Availability: Over Limit** | `bg-yellow-500` | Yellow dot indicator |
| **Availability: Unavailable** | `bg-gray-500` | Gray dot indicator |
| **Error Background** | `bg-red-500/20` | Error banner background |
| **Error Border** | `border-red-500/50` | Error banner border |
| **Error Text** | `text-red-200` | Error message text |
| **Info Banner BG** | `bg-blue-500/20` | Tip banner background |
| **LIVE Indicator** | `text-red-500` | Animated pulse text for live streams |

---

## Page Sections

### Header and Navigation

The header is a sticky navigation bar (`sticky top-0 z-20`) that adapts between two layouts based on the 1024px breakpoint.

**Desktop layout** (`>= 1024px`): Single row with glassmorphism pill shape (`rounded-full`).

- **Left:** Logo image (`h-10 xl:h-11`, max-width 180px)
- **Right:** Horizontal nav links in a flex row with `gap-4 xl:gap-6`:
  1. "Shasu Vathanan" (text link to shasuvathanan.com)
  2. "ABOUT" (anchor link to #about)
  3. "LINKEDIN" (with LinkedIn SVG icon, links to linkedin.com/in/shasuvathanan)
  4. "GITHUB" (with GitHub SVG icon, links to github.com/shasu1pm)
  5. "Buy Me a Coffee" (CTA pill button with Coffee icon, neon green gradient `from-[#B4FF00] to-[#8FD500]`, links to buymeacoffee.com/shasuvathanan)

**Mobile/Tablet layout** (`< 1024px`): Two stacked glassmorphism bars (`rounded-2xl`) with `gap-2`.

- **Top bar:** Logo (responsive heights: `h-7 sm:h-8 md:h-9`) + "Buy Me a Coffee" CTA button
- **Bottom bar:** Centered nav links (Shasu Vathanan, ABOUT, LINKEDIN, GITHUB) with responsive font sizes (`text-[12.1px] sm:text-[14.5px] md:text-[16.9px]`)

All nav link text uses `font-bold` weight with `text-white/90` default and `hover:text-white` transition.

### Hero Section

Centered content area with `max-w-5xl` width constraint:

- **Title:** Two-line heading in white bold text:
  - Line 1: `"YouTube URL to Transcript & Video Downloader"` with fluid font size `clamp(14.4px, 2.88vw, 38.4px)` and `whitespace-nowrap`
  - Line 2: `"-- Free & Open Source --"` with fluid font size `clamp(12px, 1.8vw, 22px)` and `font-normal text-white/90`
- **Description:** Three-line paragraph in `text-white/90` with responsive font sizes (`text-[11.2px] sm:text-[12.8px] lg:text-[14.4px] xl:text-[16px]`), max-width `max-w-3xl`

### Input Panel

The main interaction container: `backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl` with responsive padding (`p-4 sm:p-6 lg:p-8`) and `max-w-4xl`.

**Top bar** (always visible):

- Left: Language detection indicator with Languages icon + `"Language Detected: {language}"`
- Right: Reset button with Reset icon

**Input container** (visible when `!isCompleted`):

- Dashed border wrapper: `border-2 border-dashed border-white/30 rounded-2xl p-4 sm:p-6`
- Error message: Absolutely positioned red text at top-left: `"*Please enter a valid YouTube URL"`
- Input field: White background (`bg-white text-gray-900`), rounded-xl, with placeholder `"Paste your YouTube URL here......."`
- "Read my URL" button: Neon green gradient, white text, `font-bold`, `rounded-xl`. Disabled state applies `opacity-50 cursor-not-allowed`. Active state shows `"Processing..."`

### Progress Section

Appears during metadata fetching (`isProcessing === true`):

- **URL preview card:** YouTube icon in green-tinted container + video title (or `"Fetching video title..."` italic placeholder)
- **Progress bar:** `bg-white/10` track with `bg-gradient-to-r from-[#B4FF00] to-[#8FD500]` fill, `h-2 rounded-full`, width controlled by percentage
- **Progress text:** `"Almost ready... {progress}% Basically magic in progress"` in green text (`text-[#8FD500]`)

### Results Section

Appears after metadata is fetched (`isCompleted === true`). Uses a two-column grid layout: `grid grid-cols-1 lg:grid-cols-2 gap-4`.

**Left column** -- Thumbnail + action buttons:

- **Thumbnail card** (`bg-white/5 rounded-xl border border-white/10`):
  - Aspect-ratio video container with three states:
    1. **Default:** Static thumbnail image with fallback to `hqdefault.jpg`
    2. **Non-embeddable:** Thumbnail with dark overlay (`bg-black/60`), message `"Embedding disabled by the video owner"`, and red `"Watch on YouTube"` link button
    3. **Playing:** YouTube iframe embed via `youtube-nocookie.com` with autoplay
  - Video info: Title (2-line clamp), channel name, duration (or red pulsing "LIVE" indicator)
  - Action icons: "Play Preview" / "Pause Preview" toggle button + "Copy Link" button

- **Primary action buttons:**
  - "Get My Transcript" -- Neon green gradient, full width, disabled for live streams, `ring-4 ring-white/30` when active
  - "Download Your Video" -- Red gradient (`from-[#FF0000] to-[#CC0000]`), full width, disabled for live streams, `ring-4 ring-white/30` when active
  - Error banner (conditional): Red background with error message

**Right column** -- Conditional panel (`min-h-[400px]`):

Three possible states:

1. **Transcript panel** (`activePanel === 'transcript'`): See "Transcript Panel" below
2. **Download panel** (`activePanel === 'download'`): See "Download Panel" below
3. **Empty state** (`activePanel === null`): Centered plus icon with message `"Start the magic by selecting 'Get My Transcript' or 'Download Your Video' on the left."` (or live stream message)

**Transcript panel:**

- Header: Green-tinted icon + `"AI Powered Intelligence"` heading (`text-lg sm:text-xl font-bold`)
- Output language selector: Custom dropdown with searchable input
  - Selected value button shows `"Subtitles-Detected: {language}"` for auto mode or the chosen language name
  - Dropdown panel: Purple background (`bg-[#38235c]`), search input at top, scrollable options list (`max-h-48`), selected option highlighted with `bg-[#8FD500]/20 text-[#B4FF00]`
  - 60+ language options plus the "Subtitles-Detected" auto option
- Error banner (conditional): Red background with transcript error message
- Progress bar (during processing): Shows `"Fetching Transcript..."` or `"Translating Content To: {language}"` with percentage, green gradient bar
- Generate button: Neon green gradient, context-aware label:
  - Default: `"Get Transcript in: {language}"` with FileText icon
  - Translation: `"Translate to: {language}"` with Languages icon
  - Processing: `"Fetching Transcript..."` or `"Translating to {language}..."`
  - No captions: `"Captions Not Available"` (disabled)
- Download options (after generation): `"Transcript Generated Successfully!"` message + 3-column grid of download buttons:
  - `.DOCX` (blue-600)
  - `.TXT` (green-600)
  - `.SRT` (purple-600)

**Download panel:**

- Header: Purple-tinted icon + `"Video Download Workspace"` heading
- Loading state: Spinning purple border circle + `"Fetching available formats..."`
- Quality list: Five rows for `720p HD`, `480p`, `360p`, `240p`, `Audio Only`, each containing:
  - Availability dot (green/yellow/gray)
  - Quality label with format (MP4/MP3) and estimated size in MB
  - Duration limit label (`"Max: {N} min"`)
  - Right side action: Download button (green gradient) OR status text:
    - `"Unavailable"` (gray text)
    - `"Exceeds {N} min limit"` (yellow text)
    - `"Downloading... {progress}%"` (purple text, with progress bar below)
    - `"Complete!"` (purple text, with green completed progress bar)
  - Per-quality progress bar: Purple gradient during download, switches to green gradient on completion
- Tip banner: Blue-tinted info box: `"Tip: Higher quality downloads take longer. Audio Only is fastest!"`

### Action Buttons

Summary of all button styles:

| Button | Background | Text Color | Border Radius | Disabled Behavior |
|---|---|---|---|---|
| Read my URL | `from-[#B4FF00] to-[#8FD500]` | White | `rounded-xl` | `opacity-50 cursor-not-allowed` |
| Get My Transcript | `from-[#B4FF00] to-[#8FD500]` | White | `rounded-xl` | `opacity-50 cursor-not-allowed` (live) |
| Download Your Video | `from-[#FF0000] to-[#CC0000]` | White | `rounded-xl` | `opacity-50 cursor-not-allowed` (live) |
| Generate Transcript | `from-[#B4FF00] to-[#8FD500]` | White | `rounded-lg` | `opacity-50 cursor-not-allowed` |
| Quality Download | `from-[#B4FF00] to-[#8FD500]` | White | `rounded-lg` | `opacity-40 cursor-not-allowed` |
| Buy Me a Coffee | `from-[#B4FF00] to-[#8FD500]` | Gray-900 | `rounded-full` | N/A |
| Play/Pause Preview | `bg-white/10` | White | `rounded-lg` | N/A |
| Copy Link | `bg-white/10` | White | `rounded-lg` | N/A |
| Reset | Transparent | White | N/A | N/A |
| DOCX Download | `bg-blue-600` | White | `rounded-lg` | N/A |
| TXT Download | `bg-green-600` | White | `rounded-lg` | N/A |
| SRT Download | `bg-purple-600` | White | `rounded-lg` | N/A |

### Capability Indicators

Shown below the input panel when in the empty/input state (`!isCompleted`):

- Two horizontally centered items with icons:
  - Download icon + `"One-click Download"`
  - Languages icon + `"Supports Translation : English"`

### Bottom Category Navigation

Fixed at the bottom of the page (`pb-6 sm:pb-8 lg:pb-10`), max-width `max-w-5xl`:

- Eight glassmorphism pill buttons in a flex-wrap layout with `gap-2 sm:gap-3 lg:gap-4`:
  - Lobby, Top, New, Popular, Exclusive, Jackpot, Buy Bonus, Instant Win
- Each button: `backdrop-blur-md bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 shadow-lg hover:shadow-xl`

---

## Interaction Rules

| Element | Event | Behavior |
|---|---|---|
| **URL input** | `onChange` | Validates URL against regex; shows `"Please enter a valid YouTube URL"` for invalid, non-empty input; enables/disables "Read my URL" |
| **URL input** | `onKeyDown` (Enter) | Submits if URL is valid and not processing (`handleReadUrl`) |
| **URL input** | While processing | Input is disabled (`disabled={isProcessing}`, `opacity-50 cursor-not-allowed`) |
| **Read my URL** | `onClick` | Disabled until URL is valid; starts metadata fetch with progress bar animation; button text changes to `"Processing..."` |
| **Read my URL** | Progress bar | Fills from 0-100% over ~4 seconds using `setInterval` at 50ms; completes before showing results |
| **Get My Transcript** | `onClick` | Sets `activePanel = 'transcript'`; disabled when `videoMetadata?.isLive === true`; shows `ring-4 ring-white/30` highlight when active |
| **Download Your Video** | `onClick` | Sets `activePanel = 'download'`; calls `GET /api/formats`; disabled when `videoMetadata?.isLive === true`; shows `ring-4 ring-white/30` highlight when active |
| **Output Language Dropdown** | `onClick` (trigger) | Toggles dropdown visibility; resets search text |
| **Output Language Dropdown** | `onClick` (option) | Selects language; closes dropdown; resets transcript state (clears segments, errors, progress) so user must re-generate |
| **Output Language Dropdown** | Click outside | Closes dropdown via `mousedown` event listener on document |
| **Output Language Dropdown** | Search input | Filters languages by label in real-time (case-insensitive) |
| **Generate Transcript** | `onClick` | Calls `GET /api/captions` with selected language; progress bar ramps toward ~90% using asymptotic formula `progress += (90 - progress) * 0.08` at 200ms intervals; jumps to 100% on success; disabled when `transcriptProcessing` or `hasCaptions === false` |
| **Transcript Download** (DOCX/TXT/SRT) | `onClick` | Generates file client-side from `transcriptSegments` array; triggers browser download via `URL.createObjectURL` + `<a>` click |
| **Quality Download** | `onClick` | Calls `GET /api/download`; shows per-quality progress bar using asymptotic formula `prog += (85 - prog) * 0.05` at 300ms intervals; disabled when another quality is downloading; 10-minute timeout via `AbortSignal.timeout(600000)` |
| **Play Preview** | `onClick` | First click: loads YouTube iframe with autoplay. Subsequent clicks: toggles play/pause via `postMessage` to iframe |
| **Copy Link** | `onClick` | Copies `youtubeUrl` to clipboard (modern API with legacy `execCommand` fallback); shows centered `"Link Copied!"` notification for 3 seconds |
| **Reset** | `onClick` | Clears all state variables; removes `appState` from `sessionStorage`; returns to empty input state |
| **Watch on YouTube** | `onClick` | Opens video URL in new tab (for non-embeddable videos) |

---

## UX States

| State | Trigger | UI Response |
|---|---|---|
| **Empty** | Initial load or after Reset | Input panel shown with dashed border, placeholder text `"Paste your YouTube URL here......."`, capability indicators below, "Read my URL" disabled |
| **Validating** | User types in URL input | Real-time regex validation; invalid URLs show red error text `"*Please enter a valid YouTube URL"` with red input border and `focus:ring-red-500`; valid URLs enable "Read my URL" with `focus:ring-white/50` |
| **Fetching Metadata** | User clicks "Read my URL" | Input disabled; button shows `"Processing..."`; progress bar fills 0-100% over ~4 seconds; title placeholder shows `"Fetching video title..."` then updates to actual title; language shows `"Detecting..."` then updates |
| **Metadata Complete** | Progress reaches 100%, data resolved | Input panel replaced by results view (two-column grid); thumbnail, video info, and action buttons displayed; language pill shows detected language; panel defaults to empty state (`activePanel = null`) with prompt message |
| **Language Detected** | Metadata response includes `language` | `"Language Detected: {language}"` pill in top bar updates from `"Detecting..."` to the resolved language name |
| **Live Stream Detected** | `isLive === true` in metadata | Red pulsing "LIVE" text replaces duration; both "Get My Transcript" and "Download Your Video" buttons disabled with `opacity-50`; empty panel shows `"Oops!! Live streams aren't supported..."` |
| **Non-Embeddable Video** | `playableInEmbed === false` | Thumbnail shown with dark overlay, message `"Embedding disabled by the video owner"`, and red `"Watch on YouTube"` button |
| **Transcript Panel Active** | User clicks "Get My Transcript" | Right panel shows "AI Powered Intelligence" workspace with language dropdown and Generate button; "Get My Transcript" button gets `ring-4` highlight |
| **Transcript Processing** | User clicks Generate button | Generate button shows `"Fetching Transcript..."` or `"Translating to {lang}..."`; progress bar ramps toward 90%; button disabled |
| **Transcript Ready** | Caption segments received | Progress jumps to 100%; `"Transcript Generated Successfully!"` message appears with checkmark; three download buttons (DOCX, TXT, SRT) shown in 3-column grid; Generate button hidden |
| **No Captions** | `hasCaptions === false` in metadata | Generate button shows `"Captions Not Available"` and is disabled; auto-detect dropdown shows `"Subtitles-Detected: Captions not available"` |
| **Transcript Error** | Caption fetch fails | Red error banner inside transcript panel with error message; progress bar reset to 0 |
| **Download Panel Active** | User clicks "Download Your Video" | Right panel shows "Video Download Workspace"; spinner with `"Fetching available formats..."` while loading; "Download Your Video" button gets `ring-4` highlight |
| **Download Ready** | Format data received | Quality list appears with five rows showing availability, sizes, and download buttons; tip banner at bottom |
| **Download In Progress** | User clicks a quality's Download button | Selected row highlighted with purple border; progress bar shows purple gradient; percentage text updates; other Download buttons disabled with `opacity-40` |
| **Download Complete** | File blob received and saved | Progress bar switches to green gradient; text shows `"Complete!"`; after 2 seconds, UI resets to ready state |
| **Download Over Limit** | Video exceeds quality's duration limit | Yellow dot indicator; download button replaced with `"Exceeds {N} min limit"` text in yellow; row at 60% opacity |
| **Format Unavailable** | Quality not available for video | Gray dot indicator; `"Unavailable"` text in gray; row at 60% opacity |
| **Error (Backend)** | Network failure or server error | Red error banner below action buttons: `"Failed to connect to server"` or specific error message |
| **Error (Timeout)** | Request exceeds timeout threshold | Metadata: 15s, Captions: 60s, Download: 10min. Error message: `"Request timed out. Please try again."` or `"Download timed out"` |
| **Session Restored** | Page refresh with existing `sessionStorage` | All state restored from `sessionStorage.appState` JSON; UI renders in the last-known state without re-fetching |

---

## Mobile Responsiveness

### Breakpoint System

The primary breakpoint is **1024px** (`lg`), which determines the desktop vs. mobile/tablet layout. Layout detection uses `window.innerWidth` with `visualViewport.scale` adjustment:

```typescript
const effectiveWidth = scale ? window.innerWidth * scale : window.innerWidth;
setIsDesktopLayout(effectiveWidth >= 1024);
```

The layout updates on both `window.resize` and `visualViewport.resize` events.

### Layout Changes by Breakpoint

| Component | Desktop (>= 1024px) | Mobile/Tablet (< 1024px) |
|---|---|---|
| **Navigation** | Single row pill (`rounded-full`) with logo left, all links right | Two stacked bars: top (logo + CTA), bottom (nav links centered) |
| **Nav link sizes** | `text-sm xl:text-base` | `text-[12.1px] sm:text-[14.5px] md:text-[16.9px]` |
| **Logo height** | `h-10 xl:h-11` | `h-7 sm:h-8 md:h-9` |
| **Results grid** | Two columns (`grid-cols-2`) | Single column (`grid-cols-1`) |
| **Input + button** | Horizontal row (`flex-row`) | Stacked (`flex-col`) |
| **Hero title** | Fluid via `clamp()` up to 38.4px | Fluid via `clamp()` down to 14.4px |
| **Body text** | `text-[14.4px] xl:text-[16px]` | `text-[11.2px] sm:text-[12.8px]` |
| **Container padding** | `p-8 lg:p-8` | `p-4 sm:p-6` |
| **Button padding** | `px-8 py-4` | `px-6 py-3` |
| **Bottom nav gap** | `gap-4` | `gap-2 sm:gap-3` |

### Responsive Text Scale

Standard responsive text classes used throughout:

- Labels and metadata: `text-xs sm:text-sm`
- Body text: `text-sm sm:text-base`
- Headings: `text-lg sm:text-xl`
- Button text: `text-sm sm:text-base`
- Small metadata: `text-xs`

### Horizontal Overflow Prevention

```css
html, body {
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}
```

---

## Accessibility Notes

### Current Implementation

| Feature | Status | Detail |
|---|---|---|
| **Keyboard submission** | Implemented | `Enter` key triggers `handleReadUrl` when URL is valid and not processing |
| **Button focus states** | Implemented | Tailwind's default `focus:outline` and custom `focus:ring-2` on inputs and dropdowns |
| **Focus ring on active panel** | Implemented | `ring-4 ring-white/30` on the active action button (Get My Transcript / Download Your Video) |
| **Semantic HTML** | Partial | Uses `<nav>`, `<h1>`, `<h3>`, `<label>`, `<button>`, `<input>` elements |
| **Link targets** | Implemented | All external links use `target="_blank" rel="noopener noreferrer"` |
| **Image alt text** | Implemented | Thumbnail images have `alt={videoTitle}` |
| **Disabled state communication** | Visual only | Disabled buttons use `opacity-50 cursor-not-allowed` but lack `aria-disabled` attributes |
| **Progress announcements** | Not implemented | Progress bar changes are not announced to screen readers via `aria-live` |

### Recommended Improvements

- Add `aria-label` attributes to icon-only buttons (Play, Pause, Copy, Reset)
- Add `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` to progress bars
- Add `aria-live="polite"` regions for dynamic content updates (error messages, progress text, status changes)
- Add `role="listbox"` and `role="option"` to the language dropdown for screen reader navigation
- Add `aria-expanded` to the language dropdown trigger button
- Improve color contrast for small text on translucent backgrounds (white/60 and white/70 on blurred dark images)
- Add skip-to-content link for keyboard navigation
- Add `aria-describedby` linking error messages to the URL input field

---

## Related Documents

- [README](README.md) -- Project overview and navigation hub
- [User Flow](User-flow.md) -- Step-by-step user journey documentation
- [API](API.md) -- Backend API specification
- [Architecture](Architecture.md) -- System architecture and data flow
- [Error Handling](Error-Handling.md) -- Error catalog and troubleshooting
- [PRD](PRD.md) -- Product requirements and acceptance criteria
