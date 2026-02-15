import { Coffee } from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import bgImage from '../assets/images/2e9df151a54b12fe338eb91b19c78ee41025ea80.png';
import logoImage from '../assets/images/19470e93731c079afd8132566ea49f7d11cf333b.png';
import YouTubeClient from '../lib/youtube-client';

// Custom LinkedIn Icon Component
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Custom GitHub Icon Component
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// Languages Icon
const LanguagesIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

// Download Icon
const DownloadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// Reset Icon
const ResetIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

// Play Icon
const PlayIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z"/>
  </svg>
);

// Pause Icon
const PauseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);

// Copy Icon
const CopyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

// File Text Icon
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// Check Icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function App() {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
  const apiUrl = (path: string) => `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const [isDesktopLayout, setIsDesktopLayout] = useState(() => {
    if (typeof window === 'undefined') return true;
    const scale = window.visualViewport?.scale;
    const effectiveWidth = scale ? window.innerWidth * scale : window.innerWidth;
    return effectiveWidth >= 1024;
  });
  // Restore state from sessionStorage on page refresh
  const _ss = typeof window !== 'undefined' ? sessionStorage.getItem('appState') : null;
  const _saved = _ss ? JSON.parse(_ss) : null;

  const [youtubeUrl, setYoutubeUrl] = useState(_saved?.youtubeUrl || '');
  const [isValidUrl, setIsValidUrl] = useState(_saved?.isValidUrl || false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(_saved?.detectedLanguage || '—');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(_saved?.isCompleted ? 100 : 0);
  const [videoTitle, setVideoTitle] = useState(_saved?.videoTitle || '');
  const [isCompleted, setIsCompleted] = useState(_saved?.isCompleted || false);
  const [videoMetadata, setVideoMetadata] = useState<{
    thumbnail: string;
    duration: number | null; // in seconds
    channelName: string;
    videoId: string;
    language: string | null;
    title?: string | null;
    playableInEmbed?: boolean;
    captionLanguage?: string | null;
    hasCaptions?: boolean;
    availableCaptionLanguages?: Record<string, { name: string; type: string }>;
    isLive?: boolean;
  } | null>(_saved?.videoMetadata || null);
  const [activePanel, setActivePanel] = useState<'transcript' | 'download' | null>(_saved?.activePanel || null);
  const [selectedOutputLanguage, setSelectedOutputLanguage] = useState(_saved?.selectedOutputLanguage || 'auto');
  const [selectedTranscriptFormat, setSelectedTranscriptFormat] = useState<'docx' | 'txt' | 'srt' | null>(_saved?.selectedTranscriptFormat || null);
  const [selectedVideoQuality, setSelectedVideoQuality] = useState<string | null>(_saved?.selectedVideoQuality || null);
  const [transcriptProcessing, setTranscriptProcessing] = useState(false);
  const [transcriptGenerated, setTranscriptGenerated] = useState(_saved?.transcriptGenerated || false);
  const [downloadError, setDownloadError] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const [captionLanguage, setCaptionLanguage] = useState<string | null>(_saved?.captionLanguage || null);
  const [captionLanguageCode, setCaptionLanguageCode] = useState<string | null>(_saved?.captionLanguageCode || null);
  const [hasCaptions, setHasCaptions] = useState<boolean | null>(_saved?.hasCaptions ?? null);
  const [availableCaptionLanguages, setAvailableCaptionLanguages] = useState<Record<string, { name: string; type: string }> | null>(_saved?.availableCaptionLanguages || null);
  const [transcriptSegments, setTranscriptSegments] = useState<Array<{startMs: number; endMs: number; text: string}> | null>(_saved?.transcriptSegments || null);
  const [transcriptError, setTranscriptError] = useState('');
  const [translateProgress, setTranslateProgress] = useState(0);
  const [formatSizes, setFormatSizes] = useState<Record<string, {sizeMB: number; available: boolean; overLimit: boolean; maxMinutes: number}> | null>(null);
  const [formatsLoading, setFormatsLoading] = useState(false);
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const QUALITY_DURATION_LIMITS: Record<string, number> = {
    '720p HD': 45,
    '480p': 60,
    '360p': 120,
    '240p': 120,
    'Audio Only': 60,
  };

  // Persist state to sessionStorage so browser refresh preserves progress
  const saveState = useCallback(() => {
    const state = {
      youtubeUrl, isValidUrl, detectedLanguage, videoTitle, isCompleted,
      videoMetadata, activePanel, selectedOutputLanguage, selectedTranscriptFormat,
      selectedVideoQuality, transcriptGenerated, captionLanguage, captionLanguageCode,
      hasCaptions, availableCaptionLanguages, transcriptSegments,
    };
    sessionStorage.setItem('appState', JSON.stringify(state));
  }, [youtubeUrl, isValidUrl, detectedLanguage, videoTitle, isCompleted,
      videoMetadata, activePanel, selectedOutputLanguage, selectedTranscriptFormat,
      selectedVideoQuality, transcriptGenerated, captionLanguage, captionLanguageCode,
      hasCaptions, availableCaptionLanguages, transcriptSegments]);

  useEffect(() => { saveState(); }, [saveState]);

  const outputLanguages = [
    { value: 'af', label: 'Afrikaans' }, { value: 'am', label: 'Amharic' },
    { value: 'ar', label: 'Arabic' }, { value: 'az', label: 'Azerbaijani' },
    { value: 'bn', label: 'Bengali' }, { value: 'bg', label: 'Bulgarian' },
    { value: 'my', label: 'Burmese' }, { value: 'ca', label: 'Catalan' },
    { value: 'zh', label: 'Chinese' }, { value: 'zh-TW', label: 'Chinese (Traditional)' },
    { value: 'hr', label: 'Croatian' }, { value: 'cs', label: 'Czech' },
    { value: 'da', label: 'Danish' }, { value: 'nl', label: 'Dutch' },
    { value: 'en', label: 'English' }, { value: 'et', label: 'Estonian' },
    { value: 'fil', label: 'Filipino' }, { value: 'fi', label: 'Finnish' },
    { value: 'fr', label: 'French' }, { value: 'ka', label: 'Georgian' },
    { value: 'de', label: 'German' }, { value: 'el', label: 'Greek' },
    { value: 'gu', label: 'Gujarati' }, { value: 'ha', label: 'Hausa' },
    { value: 'he', label: 'Hebrew' }, { value: 'hi', label: 'Hindi' },
    { value: 'hu', label: 'Hungarian' }, { value: 'is', label: 'Icelandic' },
    { value: 'ig', label: 'Igbo' }, { value: 'id', label: 'Indonesian' },
    { value: 'it', label: 'Italian' }, { value: 'ja', label: 'Japanese' },
    { value: 'kn', label: 'Kannada' }, { value: 'kk', label: 'Kazakh' },
    { value: 'km', label: 'Khmer' }, { value: 'ko', label: 'Korean' },
    { value: 'lo', label: 'Lao' }, { value: 'lv', label: 'Latvian' },
    { value: 'lt', label: 'Lithuanian' }, { value: 'ms', label: 'Malay' },
    { value: 'ml', label: 'Malayalam' }, { value: 'mr', label: 'Marathi' },
    { value: 'mn', label: 'Mongolian' }, { value: 'ne', label: 'Nepali' },
    { value: 'no', label: 'Norwegian' }, { value: 'pa', label: 'Punjabi' },
    { value: 'fa', label: 'Persian' }, { value: 'pl', label: 'Polish' },
    { value: 'pt', label: 'Portuguese' }, { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ro', label: 'Romanian' }, { value: 'ru', label: 'Russian' },
    { value: 'sr', label: 'Serbian' }, { value: 'si', label: 'Sinhala' },
    { value: 'sk', label: 'Slovak' }, { value: 'sl', label: 'Slovenian' },
    { value: 'es', label: 'Spanish' }, { value: 'sw', label: 'Swahili' },
    { value: 'sv', label: 'Swedish' }, { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' }, { value: 'th', label: 'Thai' },
    { value: 'tr', label: 'Turkish' }, { value: 'uk', label: 'Ukrainian' },
    { value: 'ur', label: 'Urdu' }, { value: 'uz', label: 'Uzbek' },
    { value: 'vi', label: 'Vietnamese' }, { value: 'yo', label: 'Yoruba' },
    { value: 'zu', label: 'Zulu' },
  ];

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target as Node)) {
        setShowLanguageDropdown(false);
        setLanguageSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateLayout = () => {
      const scale = window.visualViewport?.scale;
      const effectiveWidth = scale ? window.innerWidth * scale : window.innerWidth;
      setIsDesktopLayout(effectiveWidth >= 1024);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('resize', updateLayout);
    return () => {
      window.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('resize', updateLayout);
    };
  }, []);

  // YouTube URL validation
  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)[a-zA-Z0-9_-]{11}([?&].*)?$/;
    return youtubeRegex.test(url);
  };
  
  // Extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };
  
  const parseIsoDurationToSeconds = (isoDuration: string): number | null => {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return null;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    const total = hours * 3600 + minutes * 60 + seconds;
    return total > 0 ? total : null;
  };

  // Fetch video metadata (thumbnail, duration, channel)
  const fetchVideoMetadata = async (url: string) => {
    const videoId = extractVideoId(url);
    if (!videoId) return null;

    let channelName = null;
    let thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    let duration: number | null = null;
    let language: string | null = null;
    let title: string | null = null;
    let playableInEmbed: boolean = true;
    let backendCaptionLanguage: string | null = null;
    let backendHasCaptions: boolean | undefined = undefined;
    let backendAvailableCaptionLanguages: Record<string, { name: string; type: string }> | undefined = undefined;
    let isLive = false;

    // Method -1: yt-dlp backend (most reliable)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        apiUrl(`/metadata?url=${encodeURIComponent(url)}`),
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (typeof data.duration === 'number' && data.duration > 0) {
          duration = data.duration;
          console.log('✅ Duration from yt-dlp backend:', duration, 'seconds');
        }
        if (data.channelName) {
          channelName = data.channelName;
          console.log('✅ Channel from yt-dlp backend:', channelName);
        }
        if (data.title) {
          title = data.title;
          console.log('✅ Title from yt-dlp backend:', title);
        }
        if (data.playableInEmbed === false) {
          playableInEmbed = false;
          console.log('⚠️ Video is not embeddable');
        }
        if (data.thumbnail) {
          thumbnail = data.thumbnail;
        }
        if (data.language) {
          language = data.language;
          console.log('✅ Language from yt-dlp backend:', language);
        }
        if (data.captionLanguage) {
          backendCaptionLanguage = data.captionLanguage;
          console.log('✅ Caption language from backend:', backendCaptionLanguage);
        }
        if (typeof data.hasCaptions === 'boolean') {
          backendHasCaptions = data.hasCaptions;
          console.log('✅ Has captions:', backendHasCaptions);
        }
        if (data.availableCaptionLanguages) {
          backendAvailableCaptionLanguages = data.availableCaptionLanguages;
          console.log('✅ Available caption languages:', Object.keys(backendAvailableCaptionLanguages || {}));
        }
        if (data.isLive) {
          isLive = true;
          console.log('🔴 Live stream detected');
        }
      }
    } catch (error) {
      console.log('❌ yt-dlp backend failed:', error);
    }

    // Method 0: YouTube Data API (if API key is available)
    const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (youtubeApiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${youtubeApiKey}`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const apiDuration = data?.items?.[0]?.contentDetails?.duration;
          const parsed = apiDuration ? parseIsoDurationToSeconds(apiDuration) : null;
          if (parsed) {
            duration = parsed;
            console.log('✅ Duration from YouTube Data API:', duration, 'seconds');
          }
        }
      } catch (error) {
        console.log('❌ YouTube Data API duration failed:', error);
      }
    }

    // Method 0.5: Piped API (no API key needed, CORS-friendly)
    if (!duration) {
      const pipedInstances = [
        `https://pipedapi.kavin.rocks/streams/${videoId}`,
        `https://pipedapi.adminforge.de/streams/${videoId}`,
      ];

      for (const pipedUrl of pipedInstances) {
        if (duration) break;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(pipedUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data && typeof data.duration === 'number' && data.duration > 0) {
              duration = Math.round(data.duration);
              console.log('✅ Duration from Piped API:', duration, 'seconds');
            }
          }
        } catch (error) {
          console.log(`❌ Piped API failed (${pipedUrl}):`, error);
        }
      }
    }

    // Method 1: Try YouTube oEmbed API with multiple proxies
    const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
    
    // Try direct first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(oembedUrl, { 
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct oEmbed SUCCESS:', data);
        if (data.author_name) {
          channelName = data.author_name.trim();
          console.log('✅ Channel name from direct oEmbed:', channelName);
        }
        if (data.thumbnail_url) {
          thumbnail = data.thumbnail_url;
        }
      }
    } catch (error) {
      console.log('❌ Direct oEmbed failed:', error);
    }

    // Try corsproxy.io
    if (!channelName) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(
          `https://corsproxy.io/?${encodeURIComponent(oembedUrl)}`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Corsproxy oEmbed SUCCESS:', data);
          if (data.author_name) {
            channelName = data.author_name.trim();
            console.log('✅ Channel name from corsproxy oEmbed:', channelName);
          }
          if (data.thumbnail_url) {
            thumbnail = data.thumbnail_url;
          }
        }
      } catch (error) {
        console.log('❌ Corsproxy oEmbed failed:', error);
      }
    }

    // Try allorigins
    if (!channelName) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(oembedUrl)}`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Allorigins oEmbed SUCCESS:', data);
          if (data.author_name) {
            channelName = data.author_name.trim();
            console.log('✅ Channel name from allorigins oEmbed:', channelName);
          }
          if (data.thumbnail_url) {
            thumbnail = data.thumbnail_url;
          }
        }
      } catch (error) {
        console.log('❌ Allorigins oEmbed failed:', error);
      }
    }

    // Method 2: Try to extract channel name and duration from YouTube page HTML
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const html = await response.text();
        console.log('✅ HTML fetched, extracting metadata...');
        
        // Extract channel name if not found yet
        if (!channelName) {
          // Method 2a: Look for "ownerChannelName" in JSON data
          const ownerChannelMatch = html.match(/"ownerChannelName":"([^"]+)"/);
          if (ownerChannelMatch && ownerChannelMatch[1]) {
            channelName = ownerChannelMatch[1].trim();
            console.log('✅ Channel name from ownerChannelName:', channelName);
          }
          
          // Method 2b: Look for "channelName" in JSON data (first occurrence)
          if (!channelName) {
            const channelNameMatch = html.match(/"channelName":"([^"]+)"/);
            if (channelNameMatch && channelNameMatch[1]) {
              channelName = channelNameMatch[1].trim();
              console.log('✅ Channel name from channelName:', channelName);
            }
          }
          
          // Method 2c: Look for author meta tag
          if (!channelName) {
            const metaAuthorMatch = html.match(/<meta name="author" content="([^"]+)">/i);
            if (metaAuthorMatch && metaAuthorMatch[1]) {
              channelName = metaAuthorMatch[1].trim();
              console.log('✅ Channel name from meta author:', channelName);
            }
          }
          
          // Method 2d: Look for "author" property
          if (!channelName) {
            const authorPropertyMatch = html.match(/"author":"([^"]+)"/);
            if (authorPropertyMatch && authorPropertyMatch[1]) {
              channelName = authorPropertyMatch[1].trim();
              console.log('✅ Channel name from author property:', channelName);
            }
          }

          // Method 2e: Look for ownerProfileUrl and extract channel name
          if (!channelName) {
            const ownerProfileMatch = html.match(/"ownerProfileUrl":"http[^"]*\/(@?[^"\/]+)"/);
            if (ownerProfileMatch && ownerProfileMatch[1]) {
              channelName = ownerProfileMatch[1].replace('@', '').trim();
              console.log('✅ Channel name from ownerProfileUrl:', channelName);
            }
          }
        }
        
        // Extract duration from HTML (only if not already fetched)
        if (!duration) {
          // Method A: Look for "lengthSeconds" in JSON data
          const lengthSecondsMatch = html.match(/"lengthSeconds":"(\d+)"/);
          if (lengthSecondsMatch && lengthSecondsMatch[1]) {
            duration = parseInt(lengthSecondsMatch[1], 10);
            console.log('✅ Duration from lengthSeconds:', duration, 'seconds');
          }

          // Method B: Look for ISO 8601 duration format (PT1H2M3S)
          if (!duration) {
            const isoDurationMatch = html.match(/"duration":"(PT[^"]+)"/);
            const parsed = isoDurationMatch?.[1] ? parseIsoDurationToSeconds(isoDurationMatch[1]) : null;
            if (parsed) {
              duration = parsed;
              console.log('✅ Duration from ISO format:', duration, 'seconds');
            }
          }

          // Method C: Look for approxDurationMs (milliseconds)
          if (!duration) {
            const approxDurationMatch = html.match(/"approxDurationMs":"(\d+)"/);
            if (approxDurationMatch && approxDurationMatch[1]) {
              duration = Math.floor(parseInt(approxDurationMatch[1], 10) / 1000);
              console.log('✅ Duration from approxDurationMs:', duration, 'seconds');
            }
          }

          // Method D: Look for duration in videoDetails object
          if (!duration) {
            const videoDetailsMatch = html.match(/"videoDetails":\{[^}]*"lengthSeconds":"(\d+)"/);
            if (videoDetailsMatch && videoDetailsMatch[1]) {
              duration = parseInt(videoDetailsMatch[1], 10);
              console.log('✅ Duration from videoDetails.lengthSeconds:', duration, 'seconds');
            }
          }

          // Method E: Look for lengthSeconds without quotes
          if (!duration) {
            const lengthNoQuotesMatch = html.match(/"lengthSeconds":(\d+)/);
            if (lengthNoQuotesMatch && lengthNoQuotesMatch[1]) {
              duration = parseInt(lengthNoQuotesMatch[1], 10);
              console.log('✅ Duration from lengthSeconds (no quotes):', duration, 'seconds');
            }
          }
        }
      }
    } catch (error) {
      console.log('❌ HTML scraping from corsproxy failed:', error);
    }
    
    // Method 3: Try alternative proxy if duration still not found
    if (!duration) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const html = await response.text();
          console.log('✅ Alternative HTML fetched, extracting duration...');
          
          // Try all duration patterns
          const lengthSecondsMatch = html.match(/"lengthSeconds":"(\d+)"/);
          if (lengthSecondsMatch && lengthSecondsMatch[1]) {
            duration = parseInt(lengthSecondsMatch[1], 10);
            console.log('✅ Duration from lengthSeconds (allorigins):', duration, 'seconds');
          }
          
          if (!duration) {
            const approxDurationMatch = html.match(/"approxDurationMs":"(\d+)"/);
            if (approxDurationMatch && approxDurationMatch[1]) {
              duration = Math.floor(parseInt(approxDurationMatch[1], 10) / 1000);
              console.log('✅ Duration from approxDurationMs (allorigins):', duration, 'seconds');
            }
          }
          
          if (!duration) {
            const videoDetailsMatch = html.match(/"videoDetails":\{[^}]*"lengthSeconds":"(\d+)"/);
            if (videoDetailsMatch && videoDetailsMatch[1]) {
              duration = parseInt(videoDetailsMatch[1], 10);
              console.log('✅ Duration from videoDetails (allorigins):', duration, 'seconds');
            }
          }
          
          if (!duration) {
            const lengthNoQuotesMatch = html.match(/"lengthSeconds":(\d+)/);
            if (lengthNoQuotesMatch && lengthNoQuotesMatch[1]) {
              duration = parseInt(lengthNoQuotesMatch[1], 10);
              console.log('✅ Duration from lengthSeconds no quotes (allorigins):', duration, 'seconds');
            }
          }
        }
      } catch (error) {
        console.log('❌ Alternative HTML scraping failed:', error);
      }
    }

    // No fallback duration: show placeholder if extraction failed
    if (!duration) {
      console.log('⚠️ Duration not found');
    }

    return {
      thumbnail: thumbnail,
      duration: duration,
      channelName: channelName || 'YouTube Channel',
      videoId,
      language: language,
      title: title,
      playableInEmbed: playableInEmbed,
      captionLanguage: backendCaptionLanguage,
      hasCaptions: backendHasCaptions,
      availableCaptionLanguages: backendAvailableCaptionLanguages,
      isLive,
    };
  };
  
  // Fetch YouTube video title and language
  const fetchVideoTitle = async (url: string) => {
    const videoId = extractVideoId(url);

    // Method 0: yt-dlp backend (fastest and most reliable)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        apiUrl(`/metadata?url=${encodeURIComponent(url)}`),
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 0 (yt-dlp backend) title SUCCESS:', data.title);
        if (data.title && data.title.trim()) {
          return { title: data.title.trim(), language: data.language || null };
        }
      }
    } catch (error) {
      console.log('❌ Method 0 (yt-dlp backend) title failed:', error);
    }

    // Method 1: Try YouTube oEmbed API directly
    try {
      const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(oembedUrl, { 
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 1 (Direct oEmbed) SUCCESS:', data);
        if (data.title && data.title.trim()) {
          return { title: data.title.trim(), language: null };
        }
      }
    } catch (error) {
      console.log('❌ Method 1 (Direct oEmbed) failed:', error);
    }

    // Method 2: Use corsproxy.io
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
      const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(oembedUrl)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 2 (corsproxy.io) SUCCESS:', data);
        if (data.title && data.title.trim()) {
          return { title: data.title.trim(), language: null };
        }
      }
    } catch (error) {
      console.log('❌ Method 2 (corsproxy.io) failed:', error);
    }

    // Method 3: Use allorigins
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(oembedUrl)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 3 (AllOrigins) SUCCESS:', data);
        if (data.title && data.title.trim()) {
          return { title: data.title.trim(), language: null };
        }
      }
    } catch (error) {
      console.log('❌ Method 3 (AllOrigins) failed:', error);
    }

    // Method 4: Scrape YouTube page HTML
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const html = await response.text();
        
        let detectedTitle = null;
        let detectedLanguage = null;
        
        // Extract language
        const htmlLangMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
        if (htmlLangMatch && htmlLangMatch[1]) {
          const langCode = htmlLangMatch[1].toLowerCase();
          detectedLanguage = mapLanguageCode(langCode);
          console.log('✅ Method 4 (HTML lang attribute) detected language:', detectedLanguage);
        }
        
        const inLanguageMatch = html.match(/<meta\s+itemprop=["']inLanguage["']\s+content=["']([^"']+)["']/i);
        if (inLanguageMatch && inLanguageMatch[1]) {
          const langCode = inLanguageMatch[1].toLowerCase();
          detectedLanguage = mapLanguageCode(langCode);
          console.log('✅ Method 4 (inLanguage meta) detected language:', detectedLanguage);
        }
        
        // Extract title
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          detectedTitle = ogTitleMatch[1].trim();
          console.log('✅ Method 4 (HTML og:title) SUCCESS:', detectedTitle);
        }
        
        if (!detectedTitle) {
          const metaTitleMatch = html.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i);
          if (metaTitleMatch && metaTitleMatch[1]) {
            detectedTitle = metaTitleMatch[1].trim();
            console.log('✅ Method 4 (HTML meta title) SUCCESS:', detectedTitle);
          }
        }
        
        if (!detectedTitle) {
          const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            let title = titleMatch[1].trim();
            title = title.replace(/\s*-\s*YouTube\s*$/i, '').trim();
            if (title && title !== 'YouTube') {
              detectedTitle = title;
              console.log('✅ Method 4 (HTML title tag) SUCCESS:', detectedTitle);
            }
          }
        }
        
        if (detectedTitle) {
          return { title: detectedTitle, language: detectedLanguage };
        }
      }
    } catch (error) {
      console.log('❌ Method 4 (HTML scraping) failed:', error);
    }

    // Method 5: Try noembed.com
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(url)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 5 (noembed) SUCCESS:', data);
        if (data.title && data.title.trim()) {
          return { title: data.title.trim(), language: null };
        }
      }
    } catch (error) {
      console.log('❌ Method 5 (noembed) failed:', error);
    }

    // Method 6: Use thingproxy
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
      const response = await fetch(
        `https://thingproxy.freeboard.io/fetch/${oembedUrl}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Method 6 (thingproxy) SUCCESS:', data);
        if (data.title && data.title.trim()) {
          return { title: data.title.trim(), language: null };
        }
      }
    } catch (error) {
      console.log('❌ Method 6 (thingproxy) failed:', error);
    }
    
    // Fallback
    console.error('❌ ALL METHODS FAILED to fetch video title for:', url);
    return { 
      title: videoId ? `YouTube Video • ${videoId}` : 'YouTube Video',
      language: null
    };
  };

  // Dedicated language detection
  const detectLanguage = async (url: string): Promise<string> => {
    try {
      const urlObj = new URL(url);
      const hl = urlObj.searchParams.get('hl');
      if (hl) {
        const lang = mapLanguageCode(hl);
        console.log('✅ Language from URL param:', lang);
        return lang;
      }
    } catch (error) {
      // Invalid URL, continue
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const html = await response.text();
        
        const htmlLangMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
        if (htmlLangMatch && htmlLangMatch[1]) {
          const langCode = htmlLangMatch[1].toLowerCase();
          const detectedLang = mapLanguageCode(langCode);
          console.log('✅ Language from HTML lang:', detectedLang);
          return detectedLang;
        }
        
        const inLanguageMatch = html.match(/<meta\s+itemprop=["']inLanguage["']\s+content=["']([^"']+)["']/i);
        if (inLanguageMatch && inLanguageMatch[1]) {
          const langCode = inLanguageMatch[1].toLowerCase();
          const detectedLang = mapLanguageCode(langCode);
          console.log('✅ Language from inLanguage meta:', detectedLang);
          return detectedLang;
        }
      }
    } catch (error) {
      console.log('❌ Fast language detection failed:', error);
    }

    console.log('⚠️ Language detection failed, using default: English');
    return 'English';
  };

  // Map language codes to readable names
  const mapLanguageCode = (code: string): string => {
    const languageMap: { [key: string]: string } = {
      'en': 'English', 'en-us': 'English', 'en-gb': 'English (UK)',
      'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
      'pt': 'Portuguese', 'pt-br': 'Portuguese (Brazil)',
      'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
      'zh': 'Chinese', 'zh-cn': 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)',
      'zh-hans': 'Chinese (Simplified)', 'zh-hant': 'Chinese (Traditional)',
      'ar': 'Arabic', 'hi': 'Hindi', 'tr': 'Turkish', 'nl': 'Dutch',
      'pl': 'Polish', 'sv': 'Swedish', 'da': 'Danish', 'fi': 'Finnish',
      'no': 'Norwegian', 'nb': 'Norwegian', 'nn': 'Norwegian',
      'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian',
      'ms': 'Malay', 'tl': 'Filipino', 'fil': 'Filipino',
      'uk': 'Ukrainian', 'cs': 'Czech',
      'el': 'Greek', 'he': 'Hebrew', 'hu': 'Hungarian', 'ro': 'Romanian',
      'bg': 'Bulgarian', 'hr': 'Croatian', 'sk': 'Slovak', 'sl': 'Slovenian',
      'sr': 'Serbian', 'lt': 'Lithuanian', 'lv': 'Latvian', 'et': 'Estonian',
      'bn': 'Bengali', 'ta': 'Tamil', 'te': 'Telugu', 'ml': 'Malayalam',
      'kn': 'Kannada', 'mr': 'Marathi', 'gu': 'Gujarati', 'pa': 'Punjabi',
      'ur': 'Urdu', 'fa': 'Persian', 'sw': 'Swahili', 'af': 'Afrikaans',
      'ca': 'Catalan', 'eu': 'Basque', 'gl': 'Galician', 'is': 'Icelandic',
      'am': 'Amharic', 'az': 'Azerbaijani', 'my': 'Burmese',
      'ka': 'Georgian', 'ha': 'Hausa', 'ig': 'Igbo',
      'kk': 'Kazakh', 'km': 'Khmer', 'lo': 'Lao',
      'mn': 'Mongolian', 'ne': 'Nepali', 'si': 'Sinhala',
      'uz': 'Uzbek', 'yo': 'Yoruba', 'zu': 'Zulu',
    };

    const normalizedCode = code.toLowerCase().trim();
    return languageMap[normalizedCode] || code.toUpperCase();
  };

  // Format duration to MM:SS
  const formatDuration = (seconds: number | null): string => {
    if (!seconds || seconds <= 0) return '--:--:--';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    setError('');
    
    if (url.trim() === '') {
      setIsValidUrl(false);
      return;
    }
    
    const isValid = validateYouTubeUrl(url);
    setIsValidUrl(isValid);
    
    if (!isValid && url.trim() !== '') {
      setError('Please enter a valid YouTube URL');
    }
  };

  const handleReadUrl = async () => {
    if (!isValidUrl) return;
    
    setIsProcessing(true);
    setProgress(0);
    setVideoTitle('Fetching video title...');
    setDetectedLanguage('Detecting...');
    setVideoMetadata(null);
    
    const videoId = extractVideoId(youtubeUrl);
    
    const titlePromise = videoId ? fetchVideoTitle(youtubeUrl) : Promise.resolve({ title: 'YouTube Video', language: null });
    const languagePromise = detectLanguage(youtubeUrl);
    const metadataPromise = fetchVideoMetadata(youtubeUrl);
    metadataPromise
      .then((metadata) => setVideoMetadata(metadata))
      .catch(() => setVideoMetadata(null));
    
    const startTime = Date.now();
    const totalDuration = 4000;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(progressPercent);
      
      if (progressPercent >= 100) {
        clearInterval(interval);
      }
    }, 50);
    
    try {
      const [titleResult, languageResult, metadataResult] = await Promise.allSettled([
        titlePromise,
        languagePromise,
        metadataPromise
      ]);
      
      let finalTitle = 'YouTube Video';
      // Prefer title from yt-dlp backend metadata (most reliable), fall back to title fetch methods
      const backendTitle = metadataResult.status === 'fulfilled' ? metadataResult.value?.title : null;
      if (backendTitle) {
        finalTitle = backendTitle;
      } else if (titleResult.status === 'fulfilled') {
        finalTitle = titleResult.value.title;
      } else {
        finalTitle = videoId ? `YouTube Video • ${videoId}` : 'YouTube Video';
      }
      setVideoTitle(finalTitle);
      
      let finalLanguage = 'English';
      // Prefer language from yt-dlp backend (via metadata), fall back to standalone detection
      const metaLang = metadataResult.status === 'fulfilled' ? metadataResult.value?.language : null;
      if (metaLang) {
        finalLanguage = metaLang;
      } else if (languageResult.status === 'fulfilled') {
        finalLanguage = languageResult.value;
      }
      setDetectedLanguage(finalLanguage);

      // Capture caption info from metadata
      if (metadataResult.status === 'fulfilled' && metadataResult.value) {
        setCaptionLanguage(metadataResult.value.captionLanguage || null);
        setCaptionLanguageCode(metadataResult.value.captionLanguageCode || null);
        setHasCaptions(metadataResult.value.hasCaptions ?? null);
        setAvailableCaptionLanguages(metadataResult.value.availableCaptionLanguages || null);
      }

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(totalDuration - elapsed, 0);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      clearInterval(interval);
      setProgress(100);

      
      // Complete and show results
      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);
      }, 500);
      
    } catch (error) {
      console.error('❌ Unexpected error in handleReadUrl:', error);
      const fallbackTitle = videoId ? `YouTube Video • ${videoId}` : 'YouTube Video';
      setVideoTitle(fallbackTitle);
      setDetectedLanguage('English');
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(totalDuration - elapsed, 0);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      clearInterval(interval);
      setProgress(100);
      setVideoMetadata(null);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);
      }, 500);
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem('appState');
    setYoutubeUrl('');
    setIsValidUrl(false);
    setIsProcessing(false);
    setDetectedLanguage('—');
    setError('');
    setProgress(0);
    setVideoTitle('');
    setIsCompleted(false);
    setVideoMetadata(null);
    setActivePanel(null);
    setSelectedOutputLanguage('auto');
    setSelectedTranscriptFormat(null);
    setSelectedVideoQuality(null);
    setTranscriptProcessing(false);
    setTranscriptGenerated(false);
    setDownloadError('');
    setIsPlayingPreview(false);
    setIsPreviewLoaded(false);
    setShowCopiedNotification(false);
    setCaptionLanguage(null);
    setCaptionLanguageCode(null);
    setHasCaptions(null);
    setAvailableCaptionLanguages(null);
    setTranscriptSegments(null);
    setTranscriptError('');
    setFormatSizes(null);
    setFormatsLoading(false);
    setDownloadingQuality(null);
    setDownloadProgress(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValidUrl && !isProcessing) {
      handleReadUrl();
    }
  };

  const handleCopyLink = () => {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(youtubeUrl)
        .then(() => {
          setShowCopiedNotification(true);
          setTimeout(() => setShowCopiedNotification(false), 3000);
        })
        .catch(() => {
          // Fallback to legacy method
          copyToClipboardFallback(youtubeUrl);
        });
    } else {
      // Use fallback method directly
      copyToClipboardFallback(youtubeUrl);
    }
  };

  // Fallback clipboard method for browsers with restricted permissions
  const copyToClipboardFallback = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setShowCopiedNotification(true);
        setTimeout(() => setShowCopiedNotification(false), 3000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link. Please copy manually: ' + text);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handlePlayPreview = () => {
    if (!isPreviewLoaded) {
      // First click: show iframe with autoplay
      setIsPreviewLoaded(true);
      setIsPlayingPreview(true);
    } else if (isPlayingPreview) {
      // Pause the video
      iframeRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}', '*'
      );
      setIsPlayingPreview(false);
    } else {
      // Resume the video
      iframeRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}', '*'
      );
      setIsPlayingPreview(true);
    }
  };

  const handleGetTranscript = () => {
    setActivePanel('transcript');
    setDownloadError('');
  };

  const handleDownloadVideo = async () => {
    setActivePanel('download');
    setDownloadError('');
    setFormatsLoading(true);
    setFormatSizes(null);

    try {
      const resp = await fetch(apiUrl(`/formats?url=${encodeURIComponent(youtubeUrl)}`));
      const data = await resp.json();
      if (!resp.ok) {
        setDownloadError(data.error || 'Failed to fetch format info');
        return;
      }
      setFormatSizes(data.formats);
    } catch {
      setDownloadError('Failed to connect to server');
    } finally {
      setFormatsLoading(false);
    }
  };

  const handleGenerateTranscript = async () => {
    if (hasCaptions === false) {
      setTranscriptError('No captions available for this video.');
      return;
    }

    setTranscriptProcessing(true);
    setTranscriptError('');
    setTranscriptSegments(null);
    setTranslateProgress(0);

    // Determine language code
    let langParam = '';
    if (selectedOutputLanguage !== 'auto') {
      langParam = selectedOutputLanguage;
    } else if (captionLanguageCode) {
      langParam = captionLanguageCode;
    }
    // If neither, langParam stays empty → backend auto-picks correctly

    // Simulated progress bar: ramps up to ~90% while waiting, then jumps to 100% on completion
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += (90 - progress) * 0.08;
      setTranslateProgress(Math.min(parseFloat(progress.toFixed(2)), 90));
    }, 200);

    try {
      // 🚀 CLIENT-SIDE FETCHING - Bypasses VPS IP blocks!
      // Fetches directly from YouTube using user's browser (user's home IP)
      const data = await YouTubeClient.getTranscript(youtubeUrl, langParam || undefined);
      clearInterval(progressInterval);
      if (data.segments && data.segments.length > 0) {
        setTranslateProgress(100);
        setTranscriptSegments(data.segments);
        setTranscriptGenerated(true);
        console.log(`✅ Fetched ${data.segments.length} transcript segments (${data.languageName}, ${data.type})`);
      } else {
        setTranslateProgress(0);
        setTranscriptError('No transcript segments found.');
      }
    } catch (error: unknown) {
      clearInterval(progressInterval);
      setTranslateProgress(0);
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('No captions')) {
        setTranscriptError('This video does not have captions available.');
      } else if (errorMessage.includes('Invalid')) {
        setTranscriptError('Invalid YouTube URL. Please check the URL and try again.');
      } else {
        setTranscriptError('Failed to fetch captions. Please try again.');
      }
      console.error('❌ Transcript fetch error:', error);
    }

    setTranscriptProcessing(false);
  };

  const formatSrtTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const millis = ms % 1000;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTranscript = (format: 'docx' | 'txt' | 'srt') => {
    if (!transcriptGenerated || !transcriptSegments || transcriptSegments.length === 0) {
      alert('Please generate transcript first');
      return;
    }

    const safeTitle = 'VoxText-AI_' + ((videoTitle || 'transcript').replace(/[<>:"/\\|?*]/g, '').trim() || 'transcript');

    if (format === 'txt') {
      const content = transcriptSegments.map(seg => seg.text).join('\n');
      downloadFile(content, `${safeTitle}.txt`, 'text/plain;charset=utf-8');
    } else if (format === 'srt') {
      const content = transcriptSegments.map((seg, i) => {
        return `${i + 1}\n${formatSrtTime(seg.startMs)} --> ${formatSrtTime(seg.endMs)}\n${seg.text}\n`;
      }).join('\n');
      downloadFile(content, `${safeTitle}.srt`, 'text/plain;charset=utf-8');
    } else if (format === 'docx') {
      // Generate Word-compatible HTML
      const rows = transcriptSegments.map(seg => {
        const startTime = formatSrtTime(seg.startMs).replace(',', '.');
        return `<tr><td style="padding:4px 8px;border:1px solid #ddd;color:#666;white-space:nowrap">${startTime}</td><td style="padding:4px 8px;border:1px solid #ddd">${seg.text}</td></tr>`;
      }).join('');
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${safeTitle}</title></head><body><h2>${videoTitle || 'Transcript'}</h2><table style="border-collapse:collapse;width:100%"><thead><tr><th style="padding:4px 8px;border:1px solid #ddd;background:#f5f5f5">Time</th><th style="padding:4px 8px;border:1px solid #ddd;background:#f5f5f5">Text</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
      downloadFile(html, `${safeTitle}.doc`, 'application/msword');
    }
  };

  const handleDownloadVideoQuality = async (quality: string) => {
    setDownloadingQuality(quality);
    setDownloadError('');
    setDownloadProgress(0);

    let prog = 0;
    const progressInterval = setInterval(() => {
      prog += (85 - prog) * 0.05;
      setDownloadProgress(Math.min(parseFloat(prog.toFixed(2)), 85));
    }, 300);

    try {
      const resp = await fetch(
        apiUrl(`/download?url=${encodeURIComponent(youtubeUrl)}&quality=${encodeURIComponent(quality)}`),
        { signal: AbortSignal.timeout(600000) }
      );

      clearInterval(progressInterval);

      if (!resp.ok) {
        const errData = await resp.json();
        setDownloadError(errData.error || 'Download failed');
        setDownloadingQuality(null);
        setDownloadProgress(0);
        return;
      }

      setDownloadProgress(90);

      const blob = await resp.blob();
      const contentDisposition = resp.headers.get('Content-Disposition');
      let filename = `video.${quality === 'Audio Only' ? 'mp3' : 'mp4'}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
        if (match) filename = decodeURIComponent(match[1].replace(/"/g, ''));
      }

      setDownloadProgress(100);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        setDownloadingQuality(null);
        setDownloadProgress(0);
      }, 2000);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const message = err instanceof Error ? err.message : 'Download failed';
      setDownloadError(message.includes('abort') ? 'Download timed out' : message);
      setDownloadingQuality(null);
      setDownloadProgress(0);
    }
  };

  return (
    <div 
      className="h-screen w-screen relative overflow-x-hidden overflow-y-auto"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen w-full flex flex-col">
        {/* Link Copied Notification */}
        {showCopiedNotification && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#8FD500] text-[#FFF] px-8 py-4 rounded-xl shadow-2xl font-bold text-base sm:text-lg flex items-center gap-3 animate-[fadeIn_0.3s_ease-out]">
            <CheckIcon className="w-6 h-6" />
            Link Copied!
          </div>
        )}
        
        {/* Navigation */}
        <nav className="sticky top-0 z-20 w-full px-2 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 flex-shrink-0">
          <div className="max-w-[1400px] mx-auto">
            {/* Desktop: Single Row Header */}
            {isDesktopLayout ? (
              <div>
              <div className="backdrop-blur-md bg-white/10 rounded-full px-6 py-4 flex items-center justify-between border border-white/20 shadow-lg">
                {/* Left Side: Logo */}
                <div className="flex items-center flex-shrink-0">
                  <img 
                    src={logoImage} 
                    alt="Casino Logo" 
                    className="h-10 xl:h-11 w-auto object-contain max-w-[180px]"
                  />
                </div>

                {/* Right Side: Nav Links */}
                <div className="flex items-center gap-4 xl:gap-6">
                  <a href="https://shasuvathanan.com/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-sm xl:text-base whitespace-nowrap font-bold">Shasu Vathanan</a>
                  <a href="#about" className="text-white/90 hover:text-white transition-colors text-sm xl:text-base whitespace-nowrap font-bold">ABOUT</a>
                  <a href="https://www.linkedin.com/in/shasuvathanan" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-sm xl:text-base whitespace-nowrap flex items-center gap-1.5 font-bold">
                    <LinkedInIcon className="w-4 h-4" />
                    LINKEDIN
                  </a>
                  <a href="https://github.com/shasu1pm" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-sm xl:text-base whitespace-nowrap flex items-center gap-1.5 font-bold">
                    <GitHubIcon className="w-4 h-4" />
                    GITHUB
                  </a>
                  <a href="https://buymeacoffee.com/shasuvathanan" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-[#B4FF00] to-[#8FD500] text-gray-900 px-4 xl:px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-sm xl:text-base whitespace-nowrap flex items-center gap-1.5">
                    <Coffee className="w-4 h-4" />
                    Buy Me a Coffee
                  </a>
                </div>
              </div>
            </div>
            ) : (
              <div className="flex flex-col gap-2">
              {/* Mobile/Tablet: Two Separate Sections */}
              {/* Top Section: Logo + Buy Me a Coffee */}
              <div className="backdrop-blur-md bg-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-2 sm:gap-3 border border-white/20 shadow-lg">
                <img 
                  src={logoImage} 
                  alt="Casino Logo" 
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain max-w-[120px] sm:max-w-[140px] md:max-w-[160px]"
                />
                <a href="https://buymeacoffee.com/shasuvathanan" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-[#B4FF00] to-[#8FD500] text-gray-900 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-[1%] font-semibold shadow-lg hover:shadow-xl transition-all text-[10px] sm:text-xs md:text-sm whitespace-nowrap flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  <Coffee className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span>Buy Me a Coffee</span>
                </a>
              </div>

              {/* Bottom Section: Navigation Links */}
              <div className="backdrop-blur-md bg-white/10 rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-center border border-white/20 shadow-lg">
                {/* Left Group: Text Links */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap flex-shrink-0">
                  <a href="https://shasuvathanan.com/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-[12.1px] sm:text-[14.5px] md:text-[16.9px] whitespace-nowrap font-bold">Shasu Vathanan</a>
                  <a href="#about" className="text-white/90 hover:text-white transition-colors text-[12.1px] sm:text-[14.5px] md:text-[16.9px] whitespace-nowrap font-bold">ABOUT</a>
                  <a href="https://www.linkedin.com/in/shasuvathanan" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-[12.1px] sm:text-[14.5px] md:text-[16.9px] whitespace-nowrap flex items-center gap-0.5 sm:gap-1 font-bold">
                    <LinkedInIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span>LINKEDIN</span>
                  </a>
                  <a href="https://github.com/shasu1pm" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors text-[12.1px] sm:text-[14.5px] md:text-[16.9px] whitespace-nowrap flex items-center gap-0.5 sm:gap-1 font-bold">
                    <GitHubIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span>GITHUB</span>
                  </a>
                </div>
              </div>
            </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-white font-bold leading-tight mb-3 sm:mb-4 lg:mb-6">
            <span className="block text-[clamp(14.4px,2.88vw,38.4px)] whitespace-nowrap">
              YouTube URL to Transcript & Video Downloader
            </span>
            <span className="block text-[clamp(12px,1.8vw,22px)] font-normal text-white/90">
              — Free & Open Source —
            </span>
          </h1>
          <p className="text-white/90 text-[11.2px] sm:text-[12.8px] lg:text-[14.4px] xl:text-[16px] max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 lg:mb-8 px-2">
            Instant transcripts and video downloads from YouTube. It's free and open source.<br />
            Vox Text AI is an Open source with English support today; more languages coming soon.<br />
            No sign-ups. No paywalls. Paste the URL and let the magic happen.
          </p>
          
          {/* URL Input Container */}
          <div className="w-full max-w-4xl mx-auto backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6 lg:p-8">
            {/* Top Bar: Language Detection and Reset */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                <LanguagesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Language Detected: {detectedLanguage}</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors text-xs sm:text-sm font-medium"
              >
                <ResetIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Reset
              </button>
            </div>

            {!isCompleted ? (
              <>
                {/* Input Container with Dashed Border */}
                <div className="border-2 border-dashed border-white/30 rounded-2xl p-4 sm:p-6 mb-4 relative py-6 sm:py-9">
                  {/* Error Message */}
                  {error && (
                    <p className="absolute left-4 sm:left-6 top-1 sm:top-2 text-red-500 text-xs sm:text-sm font-medium">
                      *{error}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    {/* Input Field */}
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={handleUrlChange}
                      onKeyDown={handleKeyPress}
                      disabled={isProcessing}
                      placeholder="Paste your YouTube URL here......."
                      className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 transition-all ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      } ${error ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-white/50'}`}
                    />
                    
                    {/* Read My URL Button */}
                    <button
                      onClick={handleReadUrl}
                      disabled={!isValidUrl || isProcessing}
                      className={`bg-gradient-to-br from-[#B4FF00] to-[#8FD500] text-[#FFF] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base whitespace-nowrap ${
                        !isValidUrl || isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                    >
                      {isProcessing ? 'Processing...' : 'Read my URL'}
                    </button>
                  </div>
                </div>
                
                {/* Progress Section */}
                {isProcessing && (
                  <div className="mb-4 space-y-3">
                    {/* YouTube URL Display */}
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#8FD500]/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#8FD500]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        {videoTitle ? (
                          <p className="text-white text-xs sm:text-sm font-medium text-left">{videoTitle}</p>
                        ) : (
                          <p className="text-white/60 text-xs sm:text-sm font-medium text-left italic">Fetching video title...</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#B4FF00] to-[#8FD500] transition-all duration-300 ease-out rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-[#8FD500] text-xs sm:text-sm font-medium">
                        Almost ready… {progress.toFixed(2)}% Basically magic in progress ✨
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Completed State - Results View */}
                <div className="space-y-4">
                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Side: Thumbnail + Action Buttons */}
                    <div className="space-y-4">
                      {/* Thumbnail Display */}
                      {videoMetadata && (
                        <div className="bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 space-y-3">
                          {/* Thumbnail Image or Embedded Video */}
                          <div className="relative rounded-lg overflow-hidden bg-black/20 aspect-video">
                            {!isPreviewLoaded ? (
                              <img
                                src={videoMetadata.thumbnail}
                                alt={videoTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback for failed thumbnails
                                  e.currentTarget.src = `https://img.youtube.com/vi/${videoMetadata.videoId}/hqdefault.jpg`;
                                }}
                              />
                            ) : videoMetadata.playableInEmbed === false ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={videoMetadata.thumbnail}
                                  alt={videoTitle}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = `https://img.youtube.com/vi/${videoMetadata.videoId}/hqdefault.jpg`;
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-4">
                                  <p className="text-white/90 text-xs sm:text-sm text-center font-medium">Embedding disabled by the video owner</p>
                                  <a
                                    href={`https://www.youtube.com/watch?v=${videoMetadata.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                                  >
                                    <PlayIcon className="w-4 h-4" />
                                    Watch on YouTube
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <iframe
                                ref={iframeRef}
                                src={`https://www.youtube-nocookie.com/embed/${videoMetadata.videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                                className="w-full h-full"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            )}
                          </div>
                          
                          {/* Video Info */}
                          <div className="space-y-2">
                            <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-2">{videoTitle}</h3>
                            <div className="flex items-center justify-between text-white/70 text-xs sm:text-sm">
                              <span>YouTube Channel: {videoMetadata.channelName}</span>
                              <span>{videoMetadata.isLive ? <span className="text-red-500 font-bold animate-pulse">LIVE</span> : formatDuration(videoMetadata.duration)}</span>
                            </div>
                          </div>
                          
                          {/* Action Icons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handlePlayPreview}
                              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                            >
                              {isPlayingPreview ? (
                                <>
                                  <PauseIcon className="w-4 h-4" />
                                  Pause Preview
                                </>
                              ) : (
                                <>
                                  <PlayIcon className="w-4 h-4" />
                                  Play Preview
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleCopyLink}
                              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium"
                            >
                              <CopyIcon className="w-4 h-4" />
                              Copy Link
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Primary Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={handleGetTranscript}
                          disabled={videoMetadata?.isLive}
                          className={`w-full bg-gradient-to-br from-[#B4FF00] to-[#8FD500] text-[#FFF] px-6 py-4 rounded-xl font-bold shadow-lg transition-all text-sm sm:text-base ${
                            videoMetadata?.isLive ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                          } ${activePanel === 'transcript' ? 'ring-4 ring-white/30' : ''}`}
                        >
                          <span className="flex items-center justify-center gap-2"><FileTextIcon className="w-5 h-5" />Get My Transcript</span>
                        </button>
                        <button
                          onClick={handleDownloadVideo}
                          disabled={videoMetadata?.isLive}
                          className={`w-full bg-gradient-to-br from-[#FF0000] to-[#CC0000] text-white px-6 py-4 rounded-xl font-bold shadow-lg transition-all text-sm sm:text-base ${
                            videoMetadata?.isLive ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                          } ${activePanel === 'download' ? 'ring-4 ring-white/30' : ''}`}
                        >
                          <span className="flex items-center justify-center gap-2"><DownloadIcon className="w-5 h-5" />Download Your Video</span>
                        </button>
                        {downloadError && (
                          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-xs sm:text-sm">
                            ⚠️ {downloadError}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right Side: Conditional Panel */}
                    <div className="min-h-[400px]">
                      {activePanel === 'transcript' && (
                        <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 space-y-4 h-full">
                          <div className="flex items-center justify-start gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#8FD500]/20 rounded-lg flex items-center justify-center">
                              <FileTextIcon className="w-5 h-5 text-[#8FD500]" />
                            </div>
                            <h3 className="text-white text-lg sm:text-xl font-bold text-left">AI Powered Intelligence</h3>
                          </div>
                          
                          {/* Output Language Selector */}
                          <div className="space-y-2" ref={languageDropdownRef}>
                            <div className="flex flex-col gap-2">
                              <label className="text-white/90 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 text-left">Select Output Language</label>
                              {/* Selected value button */}
                              <button
                                type="button"
                                onClick={() => { setShowLanguageDropdown(!showLanguageDropdown); setLanguageSearch(''); }}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#8FD500] text-xs sm:text-sm text-left flex items-center justify-between"
                              >
                                <span className="truncate">
                                  {selectedOutputLanguage === 'auto'
                                    ? hasCaptions === false
                                      ? 'Subtitles-Detected: Captions not available'
                                      : captionLanguage
                                        ? `Subtitles-Detected: ${captionLanguage}`
                                        : `Subtitles-Detected${detectedLanguage && detectedLanguage !== '—' && detectedLanguage !== 'Detecting...' ? `: ${detectedLanguage}` : ''}`
                                    : outputLanguages.find(l => l.value === selectedOutputLanguage)?.label || selectedOutputLanguage}
                                </span>
                                <svg className={`w-4 h-4 shrink-0 ml-2 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                            {/* Dropdown panel */}
                            {showLanguageDropdown && (
                              <div className="border border-white/20 rounded-lg bg-[#38235c] overflow-hidden">
                                {/* Search bar */}
                                <div className="p-2 border-b border-white/10">
                                  <input
                                    type="text"
                                    value={languageSearch}
                                    onChange={(e) => setLanguageSearch(e.target.value)}
                                    placeholder="Search language..."
                                    autoFocus
                                    className="w-full px-3 py-2 rounded-md bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#8FD500] text-xs sm:text-sm"
                                  />
                                </div>
                                {/* Options list */}
                                <div className="max-h-48 overflow-y-auto">
                                  {/* Subtitles-Detected option */}
                                  {('auto detect' + (detectedLanguage || '')).toLowerCase().includes(languageSearch.toLowerCase()) && (
                                    <button
                                      type="button"
                                      onClick={() => { setSelectedOutputLanguage('auto'); setShowLanguageDropdown(false); setLanguageSearch(''); setTranscriptGenerated(false); setTranscriptSegments(null); setTranscriptError(''); setTranslateProgress(0); }}
                                      className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm hover:bg-white/10 transition-colors ${selectedOutputLanguage === 'auto' ? 'bg-[#8FD500]/20 text-[#B4FF00]' : 'text-white'}`}
                                    >
                                      {hasCaptions === false
                                        ? 'Subtitles-Detected: Captions not available'
                                        : captionLanguage
                                          ? `Subtitles-Detected: ${captionLanguage}`
                                          : `Subtitles-Detected${detectedLanguage && detectedLanguage !== '—' && detectedLanguage !== 'Detecting...' ? `: ${detectedLanguage}` : ''}`}
                                    </button>
                                  )}
                                  {/* Language options */}
                                  {outputLanguages
                                    .filter(l => l.label.toLowerCase().includes(languageSearch.toLowerCase()))
                                    .map(l => (
                                      <button
                                        key={l.value}
                                        type="button"
                                        onClick={() => { setSelectedOutputLanguage(l.value); setShowLanguageDropdown(false); setLanguageSearch(''); setTranscriptGenerated(false); setTranscriptSegments(null); setTranscriptError(''); setTranslateProgress(0); }}
                                        className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm hover:bg-white/10 transition-colors ${selectedOutputLanguage === l.value ? 'bg-[#8FD500]/20 text-[#B4FF00]' : 'text-white'}`}
                                      >
                                        {l.label}
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Transcript Error */}
                          {transcriptError && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-xs sm:text-sm">
                              {transcriptError}
                            </div>
                          )}

                          {/* Translation Progress Bar */}
                          {transcriptProcessing && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white/90 text-xs sm:text-sm font-medium">
                                  {selectedOutputLanguage !== 'auto'
                                    ? `Translating Content To: ${outputLanguages.find(l => l.value === selectedOutputLanguage)?.label || selectedOutputLanguage}`
                                    : 'Fetching Transcript...'}
                                </span>
                                <span className="text-[#B4FF00] text-xs sm:text-sm font-bold">{translateProgress.toFixed(2)}%</span>
                              </div>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#B4FF00] to-[#8FD500] rounded-full transition-all duration-200 ease-out"
                                  style={{ width: `${translateProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Generate Button */}
                          {!transcriptGenerated && (
                            <button
                              onClick={handleGenerateTranscript}
                              disabled={transcriptProcessing || hasCaptions === false}
                              className={`w-full bg-gradient-to-br from-[#B4FF00] to-[#8FD500] text-[#FFF] px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all text-sm ${
                                transcriptProcessing || hasCaptions === false ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {transcriptProcessing
                                ? selectedOutputLanguage !== 'auto'
                                  ? <span className="flex items-center justify-center gap-2">⚙️ Translating to {outputLanguages.find(l => l.value === selectedOutputLanguage)?.label || selectedOutputLanguage}...</span>
                                  : '⚙️ Fetching Transcript...'
                                : hasCaptions === false
                                  ? 'Captions Not Available'
                                  : selectedOutputLanguage !== 'auto'
                                    ? <span className="flex items-center justify-center gap-2"><LanguagesIcon className="w-5 h-5" />Translate to: {outputLanguages.find(l => l.value === selectedOutputLanguage)?.label || selectedOutputLanguage}</span>
                                    : <span className="flex items-center justify-center gap-2"><FileTextIcon className="w-5 h-5" />Get Transcript in: {captionLanguage || detectedLanguage || 'Detected Language'}</span>}
                            </button>
                          )}
                          
                          {/* Download Options */}
                          {transcriptGenerated && (
                            <div className="space-y-3 pt-4 border-t border-white/10">
                              <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                                <CheckIcon className="w-5 h-5 text-[#8FD500]" />
                                Transcript Generated Successfully!
                              </p>
                              <p className="text-white/70 text-xs">Download your transcript in your preferred format:</p>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  onClick={() => handleDownloadTranscript('docx')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                                >
                                  📄 .DOCX
                                </button>
                                <button
                                  onClick={() => handleDownloadTranscript('txt')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                                >
                                  📝 .TXT
                                </button>
                                <button
                                  onClick={() => handleDownloadTranscript('srt')}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all"
                                >
                                  🎬 .SRT
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {activePanel === 'download' && (
                        <div className="bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 space-y-4 h-full">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <DownloadIcon className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-white text-lg sm:text-xl font-bold">Video Download Workspace</h3>
                          </div>

                          <p className="text-white/70 text-xs sm:text-sm text-left">Select your preferred quality and format:</p>

                          {/* Loading state */}
                          {formatsLoading && (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                              <span className="text-white/70 ml-3 text-sm">Fetching available formats...</span>
                            </div>
                          )}

                          {/* Download error */}
                          {downloadError && !formatsLoading && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-xs sm:text-sm">
                              {downloadError}
                            </div>
                          )}

                          {/* Quality Table */}
                          {formatSizes && !formatsLoading && (
                            <div className="space-y-2">
                              {['720p HD', '480p', '360p', '240p', 'Audio Only'].map((quality) => {
                                const fmt = formatSizes[quality];
                                const isDownloading = downloadingQuality === quality;
                                const isOtherDownloading = downloadingQuality !== null && downloadingQuality !== quality;
                                const isUnavailable = !fmt?.available;
                                const isOverLimit = fmt?.overLimit;

                                return (
                                  <div
                                    key={quality}
                                    className={`bg-white/5 p-3 rounded-lg border transition-all ${
                                      isDownloading ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/10 hover:bg-white/10'
                                    } ${isOtherDownloading || isUnavailable || isOverLimit ? 'opacity-60' : ''}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${
                                          isUnavailable ? 'bg-gray-500' : isOverLimit ? 'bg-yellow-500' : 'bg-[#8FD500]'
                                        }`}></div>
                                        <div>
                                          <p className="text-white text-sm font-semibold text-left">
                                            {quality} ({quality === 'Audio Only' ? 'MP3' : 'MP4'}){' '}
                                            {!isUnavailable && !isOverLimit && fmt && fmt.sizeMB > 0 && (
                                              <span className="text-white/50 font-mono font-normal">~{fmt.sizeMB} MB</span>
                                            )}
                                          </p>
                                          <p className="text-white/60 text-xs text-left">
                                            {isDownloading && fmt && fmt.sizeMB > 0
                                              ? `Size: ~${fmt.sizeMB} MB`
                                              : `Max: ${QUALITY_DURATION_LIMITS[quality]} min`}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {isUnavailable ? (
                                          <span className="text-gray-400 text-xs px-3 py-1.5">Unavailable</span>
                                        ) : isOverLimit ? (
                                          <span className="text-yellow-400 text-xs px-3 py-1.5">Exceeds {fmt?.maxMinutes} min limit</span>
                                        ) : isDownloading ? (
                                          <span className="text-purple-300 text-xs font-bold px-3 py-1.5">
                                            {downloadProgress >= 100 ? 'Complete!' : `Downloading... ${downloadProgress.toFixed(1)}%`}
                                          </span>
                                        ) : (
                                          <button
                                            onClick={() => handleDownloadVideoQuality(quality)}
                                            disabled={isOtherDownloading}
                                            className={`bg-gradient-to-br from-[#B4FF00] to-[#8FD500] text-[#FFF] px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                                              isOtherDownloading ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-lg'
                                            }`}
                                          >
                                            Download
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    {/* Progress bar when downloading */}
                                    {isDownloading && (
                                      <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all duration-300 ease-out ${
                                            downloadProgress >= 100
                                              ? 'bg-gradient-to-r from-[#B4FF00] to-[#8FD500]'
                                              : 'bg-gradient-to-r from-purple-500 to-purple-400'
                                          }`}
                                          style={{ width: `${downloadProgress}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="bg-blue-500/20 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg text-xs">
                            <strong>Tip:</strong> Higher quality downloads take longer. Audio Only is fastest!
                          </div>
                        </div>
                      )}
                      
                      {!activePanel && (
                        <div className="bg-white/5 rounded-xl border border-white/10 p-8 sm:p-12 flex flex-col items-center justify-center h-full text-center space-y-4">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20M2 12h20"/>
                            </svg>
                          </div>
                          <p className="text-white/60 text-sm sm:text-base">
                            {videoMetadata?.isLive
                              ? 'Oops!! Live streams aren\'t supported for "Transcript" or "Download." Reset and try a non-live YouTube URL.'
                              : 'Start the magic by selecting "Get My Transcript" or "Download Your Video" on the left.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Capability Indicators */}
            {!isCompleted && (
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium">
                  <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>One-click Download</span>
                </div>
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium">
                  <LanguagesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Supports Translation : English</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Category Navigation */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-10 flex-shrink-0">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4">
            {['Lobby', 'Top', 'New', 'Popular', 'Exclusive', 'Jackpot', 'Buy Bonus', 'Instant Win'].map((category) => (
              <button
                key={category}
                className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white px-4 sm:px-5 lg:px-6 xl:px-7 py-2 sm:py-2.5 lg:py-3 rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm lg:text-base whitespace-nowrap"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
