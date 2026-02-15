/**
 * Client-Side YouTube Transcript & Metadata Fetcher
 *
 * This fetches data directly from YouTube using the USER'S browser,
 * bypassing VPS IP blocks since requests come from user's home IP.
 *
 * 100% Free, Open-Source, Unlimited Users ✅
 */

interface TranscriptSegment {
  startMs: number;
  endMs: number;
  text: string;
}

interface TranscriptResult {
  language: string;
  languageName: string;
  segments: TranscriptSegment[];
  type: string;
  availableLanguages?: Record<string, { name: string; type: string }>;
}

interface VideoMetadata {
  title: string;
  duration: number;
  channelName: string;
  thumbnail: string;
  videoId: string;
  language: string;
  hasCaptions: boolean;
  availableCaptionLanguages: Record<string, { name: string; type: string }>;
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Fetch video metadata using YouTube's oEmbed API (no auth needed!)
 */
async function fetchMetadata(videoId: string): Promise<Partial<VideoMetadata>> {
  try {
    // oEmbed is public and works without auth
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error('Video not found or unavailable');
    }

    const data = await response.json();

    return {
      title: data.title,
      channelName: data.author_name,
      thumbnail: data.thumbnail_url,
      videoId: videoId,
    };
  } catch (error) {
    console.error('oEmbed fetch failed:', error);
    throw error;
  }
}

/**
 * Fetch transcript using YouTube's internal timedtext API
 * This is what youtube-transcript-api uses under the hood
 */
async function fetchTranscript(
  videoId: string,
  lang?: string
): Promise<TranscriptResult> {
  try {
    // Step 1: Get video page to extract caption tracks
    const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const pageResponse = await fetch(videoPageUrl);
    const pageHtml = await pageResponse.text();

    // Step 2: Extract caption track information from page
    const captionTracksMatch = pageHtml.match(/"captionTracks":(\[.*?\])/);
    if (!captionTracksMatch) {
      throw new Error('No captions available for this video');
    }

    const captionTracks = JSON.parse(captionTracksMatch[1]);

    // Step 3: Find the desired language track
    let selectedTrack = captionTracks[0]; // Default to first available

    if (lang) {
      const langTrack = captionTracks.find(
        (track: any) => track.languageCode.startsWith(lang.toLowerCase())
      );
      if (langTrack) selectedTrack = langTrack;
    }

    // Step 4: Fetch the actual transcript
    const transcriptUrl = selectedTrack.baseUrl;
    const transcriptResponse = await fetch(transcriptUrl);
    const transcriptXml = await transcriptResponse.text();

    // Step 5: Parse XML to extract segments
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(transcriptXml, 'text/xml');
    const textElements = xmlDoc.querySelectorAll('text');

    const segments: TranscriptSegment[] = [];
    textElements.forEach((element) => {
      const start = parseFloat(element.getAttribute('start') || '0');
      const duration = parseFloat(element.getAttribute('dur') || '0');
      const text = element.textContent || '';

      segments.push({
        startMs: Math.floor(start * 1000),
        endMs: Math.floor((start + duration) * 1000),
        text: decodeHtmlEntities(text),
      });
    });

    // Step 6: Build available languages list
    const availableLanguages: Record<string, { name: string; type: string }> = {};
    captionTracks.forEach((track: any) => {
      availableLanguages[track.languageCode] = {
        name: track.name?.simpleText || track.languageCode,
        type: track.kind === 'asr' ? 'auto' : 'manual',
      };
    });

    return {
      language: selectedTrack.languageCode,
      languageName: selectedTrack.name?.simpleText || selectedTrack.languageCode,
      segments,
      type: selectedTrack.kind === 'asr' ? 'auto' : 'manual',
      availableLanguages,
    };
  } catch (error) {
    console.error('Transcript fetch failed:', error);
    throw error;
  }
}

/**
 * Decode HTML entities in transcript text
 */
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Main API - Get YouTube video transcript (client-side)
 */
export async function getYouTubeTranscript(
  url: string,
  language?: string
): Promise<TranscriptResult> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  return fetchTranscript(videoId, language);
}

/**
 * Main API - Get YouTube video metadata (client-side)
 */
export async function getYouTubeMetadata(url: string): Promise<VideoMetadata> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const metadata = await fetchMetadata(videoId);

  // Try to get transcript info to determine hasCaptions
  let hasCaptions = false;
  let availableCaptionLanguages = {};

  try {
    const transcript = await fetchTranscript(videoId);
    hasCaptions = true;
    availableCaptionLanguages = transcript.availableLanguages || {};
  } catch {
    // No captions available
  }

  return {
    title: metadata.title || '',
    duration: 0, // oEmbed doesn't provide duration
    channelName: metadata.channelName || '',
    thumbnail: metadata.thumbnail || '',
    videoId: videoId,
    language: 'Unknown',
    hasCaptions,
    availableCaptionLanguages,
  };
}

export default {
  getTranscript: getYouTubeTranscript,
  getMetadata: getYouTubeMetadata,
};
