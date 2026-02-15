# Integration Guide: Client-Side YouTube Fetching

## Quick Summary

**Replace backend API calls with client-side library:**

```diff
- // Old: Call backend (blocked on VPS)
- const response = await fetch('/api/captions?url=' + videoUrl);
- const data = await response.json();

+ // New: Fetch directly from browser (works everywhere!)
+ import YouTubeClient from '@/lib/youtube-client';
+ const data = await YouTubeClient.getTranscript(videoUrl);
```

---

## Step-by-Step Integration

### 1. Update Your Frontend Component

**Before (calling backend):**
```typescript
async function getTranscript(url: string) {
  const response = await fetch(`/api/captions?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
}
```

**After (client-side):**
```typescript
import YouTubeClient from '@/lib/youtube-client';

async function getTranscript(url: string) {
  return await YouTubeClient.getTranscript(url);
}
```

### 2. Update Metadata Fetching

**Before:**
```typescript
const response = await fetch(`/api/metadata?url=${url}`);
const metadata = await response.json();
```

**After:**
```typescript
import YouTubeClient from '@/lib/youtube-client';

const metadata = await YouTubeClient.getMetadata(url);
```

### 3. Add Error Handling

```typescript
try {
  const transcript = await YouTubeClient.getTranscript(videoUrl, 'en');
  setTranscript(transcript.segments);
  setLanguage(transcript.language);
} catch (error) {
  if (error.message.includes('No captions')) {
    showError('This video has no captions available');
  } else if (error.message.includes('Invalid')) {
    showError('Invalid YouTube URL');
  } else {
    showError('Failed to fetch transcript. Please try again.');
  }
}
```

### 4. Add Loading States

```typescript
const [loading, setLoading] = useState(false);

async function fetchTranscript() {
  setLoading(true);
  try {
    const result = await YouTubeClient.getTranscript(url);
    setTranscript(result);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
```

---

## Complete Example

```typescript
import { useState } from 'react';
import YouTubeClient from '@/lib/youtube-client';

export function TranscriptFetcher() {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Client-side fetch - works on any server!
      const result = await YouTubeClient.getTranscript(url);

      setTranscript(result);
      console.log(`Got ${result.segments.length} segments in ${result.language}`);
    } catch (err) {
      setError(err.message || 'Failed to fetch transcript');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube URL"
      />

      <button onClick={handleFetch} disabled={loading}>
        {loading ? 'Fetching...' : 'Get Transcript'}
      </button>

      {error && <div className="error">{error}</div>}

      {transcript && (
        <div>
          <h3>Transcript ({transcript.language})</h3>
          {transcript.segments.map((seg, i) => (
            <p key={i}>{seg.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Benefits After Integration

### Before (Server-Side)
```
User → Frontend → Backend (VPS) → YouTube
                           ❌ BLOCKED

Problems:
- Doesn't work on production VPS
- Requires backend server
- Gets rate-limited
- Costs server resources
```

### After (Client-Side)
```
User → Frontend → YouTube (direct)
              ✅ WORKS

Benefits:
- Works on any hosting
- No backend needed for transcripts
- No rate limits
- Free unlimited usage
- Scales infinitely
```

---

## What About Downloads?

For video downloads, you have two options:

### Option A: Client-Side Download Link
```typescript
// Just give user the YouTube URL
// They can use browser extensions or yt-dlp locally
function handleDownload() {
  window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}
```

### Option B: Provide Instructions
```typescript
function showDownloadInstructions() {
  return (
    <div>
      <h3>To download this video:</h3>
      <ol>
        <li>Install yt-dlp on your computer</li>
        <li>Run: <code>yt-dlp {videoUrl}</code></li>
      </ol>
      <a href="https://github.com/yt-dlp/yt-dlp">Download yt-dlp</a>
    </div>
  );
}
```

### Option C: Keep Server-Side Download (Best-Effort)
```typescript
// Server-side might work sometimes, fail other times
// Keep as optional feature with disclaimer
async function tryServerDownload() {
  try {
    const response = await fetch(`/api/download?url=${url}`);
    if (response.ok) {
      // Success!
      const blob = await response.blob();
      downloadBlob(blob);
    } else {
      // Fallback to instructions
      showDownloadInstructions();
    }
  } catch {
    showDownloadInstructions();
  }
}
```

---

## Testing

### Test Locally First
```bash
cd Frontend
npm install
npm run dev

# Open http://localhost:5173
# Test with various YouTube URLs
```

### Test These Scenarios
1. ✅ Regular video with captions
2. ✅ Video without captions (should show error)
3. ✅ Invalid URL (should show error)
4. ✅ Different languages
5. ✅ Long videos
6. ✅ Recent videos

---

## Deployment

### No Backend Changes Needed!

Your backend can stay as-is or be simplified to just serve static files.

### Deploy Frontend
```bash
# Build frontend
cd Frontend
npm run build

# Deploy dist/ folder to:
# - Vercel (free)
# - Netlify (free)
# - GitHub Pages (free)
# - Your VPS (works now!)
```

---

## Troubleshooting

### "Failed to fetch" Error

**Cause:** CORS or network issue

**Solution:**
```typescript
// Add retry logic
async function fetchWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

const transcript = await fetchWithRetry(() =>
  YouTubeClient.getTranscript(url)
);
```

### "No captions available" Error

**Cause:** Video genuinely has no captions

**Solution:**
```typescript
// Show helpful message
if (error.message.includes('No captions')) {
  showMessage('This video does not have captions. Try another video.');
}
```

---

## Performance

### Caching

```typescript
// Cache transcripts in browser
const cache = new Map();

async function getCachedTranscript(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const transcript = await YouTubeClient.getTranscript(url);
  cache.set(url, transcript);
  return transcript;
}
```

### Lazy Loading

```typescript
// Only load youtube-client when needed
const YouTubeClient = await import('@/lib/youtube-client');
```

---

## Summary

**What Changes:**
- ✅ Frontend uses client-side library
- ✅ No backend API calls for transcripts
- ✅ Works on any server

**What Stays Same:**
- ✅ User experience (faster actually!)
- ✅ UI/UX
- ✅ Features

**What You Gain:**
- ✅ Works on production VPS
- ✅ Unlimited free usage
- ✅ No more YouTube blocking

---

**Ready to integrate? It's just a few lines of code!** 🚀
