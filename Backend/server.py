import re
import time
import json as json_lib
import os
import tempfile
import threading
import glob as glob_mod
import shutil
import urllib.request
import urllib.error
import urllib.parse
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
    YouTubeRequestFailed,
    CouldNotRetrieveTranscript
)

app = Flask(__name__)
CORS(app, expose_headers=["Content-Disposition"])


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({"status": "healthy", "service": "voxtext-backend"}), 200

# In-memory cache for yt-dlp info to avoid duplicate extractions (429 rate limits)
# Key: video URL, Value: {"info": dict, "cookie_jar": CookieJar, "timestamp": float}
_info_cache = {}
_CACHE_TTL = 300  # 5 minutes

# Caption result cache to avoid repeated requests for same video+language
# Key: (video_url, lang_code), Value: {"result": dict, "timestamp": float}
_caption_result_cache = {}
_CAPTION_CACHE_TTL = 600  # 10 minutes

# Shared cookie jar across all yt-dlp sessions (persists YouTube auth cookies)
import http.cookiejar
_cookie_jar = http.cookiejar.MozillaCookieJar()


def _extract_video_id(url):
    """Extract YouTube video ID from URL."""
    # Handle various YouTube URL formats
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def _get_transcript_via_api(video_id, languages=None):
    """
    Get transcript using youtube-transcript-api (bypasses bot detection).
    Returns dict with transcript data or None if unavailable.
    """
    if not video_id:
        return None

    try:
        api = YouTubeTranscriptApi()

        # Get list of available transcripts
        transcript_list = api.list(video_id)

        # Build available languages dict
        available_langs = {}
        for trans in transcript_list:
            available_langs[trans.language_code] = {
                "name": trans.language,
                "type": "manual" if not trans.is_generated else "auto"
            }

        # Fetch transcript in preferred language
        if languages:
            transcript = api.fetch(video_id, languages=languages)
        else:
            # Get first available (prefer manual over auto)
            manual_transcripts = [t for t in transcript_list if not t.is_generated]
            if manual_transcripts:
                transcript = manual_transcripts[0].fetch()
            else:
                transcript = list(transcript_list)[0].fetch()

        # Convert to segments format
        segments = []
        for entry in transcript:
            segments.append({
                "startMs": int(entry.start * 1000),
                "endMs": int((entry.start + entry.duration) * 1000),
                "text": entry.text
            })

        return {
            "language": transcript.language_code,
            "languageName": transcript.language,
            "segments": segments,
            "type": "manual" if not transcript.is_generated else "auto",
            "availableLanguages": available_langs
        }

    except (TranscriptsDisabled, NoTranscriptFound):
        return None
    except (VideoUnavailable, YouTubeRequestFailed, CouldNotRetrieveTranscript) as e:
        # These errors mean we should fall back to yt-dlp
        return None
    except Exception as e:
        # Unexpected error, log but don't crash
        print(f"youtube-transcript-api error: {e}")
        return None


def _extract_info_cached(url):
    """Extract video info via yt-dlp, using cache to avoid duplicate requests."""
    now = time.time()
    # Clean expired entries
    expired = [k for k, v in _info_cache.items() if now - v["timestamp"] > _CACHE_TTL]
    for k in expired:
        del _info_cache[k]

    if url in _info_cache:
        return _info_cache[url]["info"]

    # Check for YouTube cookies file to bypass bot detection
    cookies_path = os.path.join(os.path.dirname(__file__), "youtube_cookies.txt")

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "geo_bypass": True,
        "ignore_no_formats_error": True,
        "noplaylist": True,
        "extractor_args": {"youtube": {"player_client": ["ios", "android", "web"]}},
        "http_headers": {
            "User-Agent": "com.google.ios.youtube/19.16.3 (iPhone14,5; U; CPU iOS 15_6 like Mac OS X)"
        },
    }

    # Add cookies if available (helps bypass YouTube bot detection on VPS/cloud IPs)
    if os.path.exists(cookies_path):
        ydl_opts["cookiefile"] = cookies_path
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        # Inject shared cookie jar so cookies persist across requests
        if hasattr(ydl, 'cookiejar'):
            for cookie in _cookie_jar:
                ydl.cookiejar.set_cookie(cookie)
        info = ydl.extract_info(url, download=False)
        # Save cookies back to shared jar
        if hasattr(ydl, 'cookiejar'):
            for cookie in ydl.cookiejar:
                _cookie_jar.set_cookie(cookie)
    _info_cache[url] = {"info": info, "timestamp": now}
    return info


def _fetch_url_with_cookies(caption_url):
    """Fetch a URL using the shared cookie jar from yt-dlp sessions."""
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(_cookie_jar))
    req = urllib.request.Request(caption_url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.youtube.com/",
        "Origin": "https://www.youtube.com",
    })
    with opener.open(req, timeout=15) as resp:
        return resp.read().decode("utf-8")


def _fetch_url_via_ytdlp(caption_url):
    """Fetch a caption URL using yt-dlp's HTTP handler.
    Uses yt-dlp's internal opener which handles cookies, auth tokens,
    and YouTube-specific headers better than raw urllib."""
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "geo_bypass": True,
        "noplaylist": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        if hasattr(ydl, 'cookiejar'):
            for cookie in _cookie_jar:
                ydl.cookiejar.set_cookie(cookie)
        response = ydl.urlopen(caption_url)
        content = response.read().decode("utf-8")
        if hasattr(ydl, 'cookiejar'):
            for cookie in ydl.cookiejar:
                _cookie_jar.set_cookie(cookie)
        return content


def _parse_caption_content(raw):
    """Parse json3 or VTT caption content into timed segments."""
    segments = []
    try:
        caption_data = json_lib.loads(raw)
        events = caption_data.get("events", [])
        for event in events:
            start_ms = event.get("tStartMs", 0)
            dur_ms = event.get("dDurMs", 0)
            segs = event.get("segs")
            if not segs:
                continue
            text = "".join(s.get("utf8", "") for s in segs).strip()
            text = text.replace("\n", " ")
            if not text:
                continue
            segments.append({
                "startMs": start_ms,
                "endMs": start_ms + dur_ms,
                "text": text,
            })
    except (json_lib.JSONDecodeError, KeyError):
        # Fallback: try parsing as VTT
        lines = raw.strip().split("\n")
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if "-->" in line:
                parts = line.split("-->")
                start_str = parts[0].strip()
                end_str = parts[1].strip().split(" ")[0]

                def vtt_to_ms(ts):
                    ts_parts = ts.replace(",", ".").split(":")
                    if len(ts_parts) == 3:
                        h, m, rest = ts_parts
                        s_parts = rest.split(".")
                        s = s_parts[0]
                        ms = s_parts[1] if len(s_parts) > 1 else "0"
                    elif len(ts_parts) == 2:
                        h = "0"
                        m = ts_parts[0]
                        rest = ts_parts[1]
                        s_parts = rest.split(".")
                        s = s_parts[0]
                        ms = s_parts[1] if len(s_parts) > 1 else "0"
                    else:
                        return 0
                    return (int(h) * 3600 + int(m) * 60 + int(s)) * 1000 + int(ms.ljust(3, "0")[:3])

                start_ms = vtt_to_ms(start_str)
                end_ms = vtt_to_ms(end_str)
                text_lines = []
                i += 1
                while i < len(lines) and lines[i].strip():
                    text_lines.append(lines[i].strip())
                    i += 1
                text = " ".join(text_lines)
                if text:
                    segments.append({
                        "startMs": start_ms,
                        "endMs": end_ms,
                        "text": text,
                    })
            i += 1
    return segments


def _translate_text_google(text, source_lang, target_lang):
    """Translate text using Google Translate free API (translate.googleapis.com)."""
    encoded = urllib.parse.quote(text)
    api_url = (
        f"https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl={source_lang}&tl={target_lang}&dt=t&q={encoded}"
    )
    req = urllib.request.Request(api_url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json_lib.loads(resp.read().decode("utf-8"))
    # Response format: [[["translated", "original", ...], ...], ...]
    return "".join(part[0] for part in data[0] if part[0])


def _translate_segments(segments, source_lang, target_lang):
    """Translate caption segments in batches using Google Translate."""
    texts = [seg["text"] for seg in segments]

    # Batch texts by URL-encoded length to stay within Google Translate URL limits.
    # Non-Latin chars (Hindi, Tamil etc.) expand 3-9x when URL-encoded,
    # so we measure the actual encoded size, not character count.
    MAX_ENCODED_LEN = 5000  # Safe URL query length for Google Translate
    batches = []
    current_batch = []
    current_encoded_len = 0

    for text in texts:
        text_encoded_len = len(urllib.parse.quote(text))
        if current_encoded_len + text_encoded_len + 3 > MAX_ENCODED_LEN and current_batch:
            batches.append(current_batch)
            current_batch = [text]
            current_encoded_len = text_encoded_len
        else:
            current_batch.append(text)
            current_encoded_len += text_encoded_len + 3  # +3 for encoded "\n"
    if current_batch:
        batches.append(current_batch)

    translated_texts = []
    for batch in batches:
        combined = "\n".join(batch)
        try:
            result = _translate_text_google(combined, source_lang, target_lang)
            parts = result.split("\n")
            # Pad if Google Translate merged some lines
            while len(parts) < len(batch):
                parts.append(batch[len(parts)])
            translated_texts.extend(parts[:len(batch)])
        except Exception as e:
            print(f"[translate] Batch failed ({len(batch)} segments): {e}")
            # If translation fails for this batch, keep original texts
            translated_texts.extend(batch)

    # Build translated segments preserving timing
    translated_segments = []
    for i, seg in enumerate(segments):
        translated_segments.append({
            "startMs": seg["startMs"],
            "endMs": seg["endMs"],
            "text": translated_texts[i].strip() if i < len(translated_texts) else seg["text"],
        })
    return translated_segments


# Language code to readable name mapping
LANGUAGE_MAP = {
    "en": "English", "en-us": "English", "en-gb": "English (UK)",
    "es": "Spanish", "fr": "French", "de": "German", "it": "Italian",
    "pt": "Portuguese", "pt-br": "Portuguese (Brazil)",
    "ru": "Russian", "ja": "Japanese", "ko": "Korean",
    "zh": "Chinese", "zh-cn": "Chinese (Simplified)", "zh-tw": "Chinese (Traditional)",
    "zh-hans": "Chinese (Simplified)", "zh-hant": "Chinese (Traditional)",
    "ar": "Arabic", "hi": "Hindi", "tr": "Turkish", "nl": "Dutch",
    "pl": "Polish", "sv": "Swedish", "da": "Danish", "fi": "Finnish",
    "no": "Norwegian", "nb": "Norwegian", "nn": "Norwegian",
    "th": "Thai", "vi": "Vietnamese", "id": "Indonesian",
    "ms": "Malay", "tl": "Filipino", "fil": "Filipino",
    "uk": "Ukrainian", "cs": "Czech",
    "el": "Greek", "he": "Hebrew", "hu": "Hungarian", "ro": "Romanian",
    "bg": "Bulgarian", "hr": "Croatian", "sk": "Slovak", "sl": "Slovenian",
    "sr": "Serbian", "lt": "Lithuanian", "lv": "Latvian", "et": "Estonian",
    "bn": "Bengali", "ta": "Tamil", "te": "Telugu", "ml": "Malayalam",
    "kn": "Kannada", "mr": "Marathi", "gu": "Gujarati", "pa": "Punjabi",
    "ur": "Urdu", "fa": "Persian", "sw": "Swahili", "af": "Afrikaans",
    "ca": "Catalan", "eu": "Basque", "gl": "Galician",
    "is": "Icelandic",
    "am": "Amharic", "az": "Azerbaijani", "my": "Burmese",
    "ka": "Georgian", "ha": "Hausa", "ig": "Igbo",
    "kk": "Kazakh", "km": "Khmer", "lo": "Lao",
    "mn": "Mongolian", "ne": "Nepali", "si": "Sinhala",
    "uz": "Uzbek", "yo": "Yoruba", "zu": "Zulu",
}

# Reverse map: language name -> readable name (for title scanning)
LANGUAGE_NAMES = {name.lower(): name for name in LANGUAGE_MAP.values()}
# Also add common variants
LANGUAGE_NAMES.update({
    "mandarin": "Chinese", "cantonese": "Chinese", "chinese": "Chinese",
    "brazilian portuguese": "Portuguese (Brazil)", "brazilian": "Portuguese (Brazil)",
    "tagalog": "Filipino", "farsi": "Persian",
    "bangla": "Bengali", "odia": "Odia", "oriya": "Odia",
    "assamese": "Assamese", "nepali": "Nepali", "sinhala": "Sinhala",
    "burmese": "Burmese", "khmer": "Khmer", "lao": "Lao",
    "mongolian": "Mongolian", "tibetan": "Tibetan", "uzbek": "Uzbek",
    "kazakh": "Kazakh", "azerbaijani": "Azerbaijani", "georgian": "Georgian",
    "armenian": "Armenian", "amharic": "Amharic", "yoruba": "Yoruba",
    "igbo": "Igbo", "hausa": "Hausa", "zulu": "Zulu", "xhosa": "Xhosa",
    "icelandic": "Icelandic",
})


def resolve_language(code):
    """Map a language code to a human-readable name."""
    if not code:
        return None
    normalized = code.lower().strip()
    return LANGUAGE_MAP.get(normalized) or LANGUAGE_MAP.get(normalized.split("-")[0])


def detect_language_from_title(title):
    """Scan the video title for explicit language mentions like '| Tamil |' or 'in Hindi'."""
    if not title:
        return None
    title_lower = title.lower()

    # Priority 1: Contextual "through/via [language]" with spaces
    # e.g. "Learn Japanese through Tamil" → spoken language is Tamil
    for lang_name, readable in sorted(LANGUAGE_NAMES.items(), key=lambda x: -len(x[0])):
        medium_pattern = r'(?:through|thru|via)\s+' + re.escape(lang_name) + r'(?:[\s\.\,\|\)\]!?]|$)'
        if re.search(medium_pattern, title_lower):
            return readable

    # Priority 2: Hashtag parsing for compound words like #englishthroughtamil
    hashtags = re.findall(r'#(\w+)', title_lower)
    for hashtag in hashtags:
        for lang_name, readable in sorted(LANGUAGE_NAMES.items(), key=lambda x: -len(x[0])):
            # Match "through/thru/via" + language inside hashtag
            ht_pattern = r'(?:through|thru|via)' + re.escape(lang_name) + r'$'
            if re.search(ht_pattern, hashtag):
                return readable

    # Priority 3: General patterns: "| Tamil |", "| Tamil", "(Tamil)", "in Tamil", "- Tamil"
    for lang_name, readable in sorted(LANGUAGE_NAMES.items(), key=lambda x: -len(x[0])):
        pattern = r'(?:^|[\|\(\[\-–—,\s])' + re.escape(lang_name) + r'(?:[\|\)\]\-–—,\s]|$)'
        if re.search(pattern, title_lower):
            return readable
    return None


# Unicode script ranges for detecting non-Latin text in titles
SCRIPT_LANGUAGE_MAP = {
    "Tamil": (0x0B80, 0x0BFF),
    "Hindi": (0x0900, 0x097F),       # Devanagari (also Marathi, Nepali)
    "Bengali": (0x0980, 0x09FF),
    "Telugu": (0x0C00, 0x0C7F),
    "Kannada": (0x0C80, 0x0CFF),
    "Malayalam": (0x0D00, 0x0D7F),
    "Sinhala": (0x0D80, 0x0DFF),
    "Gujarati": (0x0A80, 0x0AFF),
    "Punjabi": (0x0A00, 0x0A7F),     # Gurmukhi
    "Thai": (0x0E00, 0x0E7F),
    "Lao": (0x0E80, 0x0EFF),
    "Arabic": (0x0600, 0x06FF),      # Also covers Urdu, Persian
    "Hebrew": (0x0590, 0x05FF),
    "Greek": (0x0370, 0x03FF),
    "Russian": (0x0400, 0x04FF),     # Cyrillic (also Serbian, Ukrainian)
    "Georgian": (0x10A0, 0x10FF),
    "Amharic": (0x1200, 0x137F),     # Ethiopic
    "Burmese": (0x1000, 0x109F),     # Myanmar
    "Khmer": (0x1780, 0x17FF),
    "Korean": (0xAC00, 0xD7AF),      # Hangul
    "Japanese": (0x3040, 0x309F),     # Hiragana
    "Chinese": (0x4E00, 0x9FFF),     # CJK Unified Ideographs
}


def detect_language_from_script(title):
    """Detect language from non-Latin script characters in the title."""
    if not title:
        return None
    for lang, (start, end) in SCRIPT_LANGUAGE_MAP.items():
        for ch in title:
            if start <= ord(ch) <= end:
                return lang
    return None


def detect_language_from_tags(tags):
    """Scan video tags for language mentions like 'tamil funny video'."""
    if not tags:
        return None
    # Count how many tags mention each language
    lang_counts = {}
    for tag in tags:
        tag_lower = tag.lower()
        for lang_name, readable in LANGUAGE_NAMES.items():
            pattern = r'(?:^|[\s])' + re.escape(lang_name) + r'(?:[\s]|$)'
            if re.search(pattern, tag_lower):
                lang_counts[readable] = lang_counts.get(readable, 0) + 1
    if not lang_counts:
        return None
    # Return the most frequently mentioned language (ignore English since
    # many non-English creators tag "english" generically)
    non_english = {k: v for k, v in lang_counts.items() if k != "English"}
    if non_english:
        return max(non_english, key=non_english.get)
    return max(lang_counts, key=lang_counts.get)


def detect_language_from_description(description, channel):
    """Detect language from video description and channel name.
    Looks for explicit language mentions in description."""
    if not description and not channel:
        return None

    combined_text = f"{description or ''} {channel or ''}".lower()

    # Check for explicit language mentions in description/channel
    # Priority order: explicit mentions first
    language_keywords = {
        "Tamil": ["tamil", "தமிழ்", " ta ", " tn "],
        "Telugu": ["telugu", "తెలుగు", " te ", " ap ", " telangana"],
        "Hindi": ["hindi", "हिन्दी", " hi "],
        "Kannada": ["kannada", "ಕನ್ನಡ", " kn ", " karnataka"],
        "Malayalam": ["malayalam", "മലയാളം", " ml ", " kerala"],
        "Bengali": ["bengali", "bangla", "বাংলা", " bn ", " wb "],
        "Marathi": ["marathi", "मराठी", " mr ", " maharashtra"],
        "Gujarati": ["gujarati", "ગુજરાતી", " gu "],
        "Punjabi": ["punjabi", "ਪੰਜਾਬੀ", " pa "],
        "Sanskrit": ["sanskrit", "संस्कृत", " sa "],
    }

    # Count mentions of each language
    lang_scores = {}
    for lang, keywords in language_keywords.items():
        score = sum(combined_text.count(kw) for kw in keywords)
        if score > 0:
            lang_scores[lang] = score

    # Special handling for devotional/spiritual content
    # Check for spiritual keywords that might indicate South Indian languages
    if "spiritual" in combined_text or "devotional" in combined_text or "bhakti" in combined_text:
        # Check title/description for deity names associated with regions
        south_indian_deities = [
            "venkateshwara", "venkateswara", "balaji", "tirupati",  # Tamil/Telugu
            "murugan", "subrahmanya", "ayyappa", "meenakshi",  # Tamil
            "vishnu", "shiva", "krishna", "rama"  # Pan-Indian but common in South
        ]
        for deity in south_indian_deities:
            if deity in combined_text:
                # If no other language detected and has South Indian deity
                # Default to Tamil for devotional content (common in diaspora)
                if not lang_scores:
                    lang_scores["Tamil"] = 0.5

    # Return language with highest mentions
    if lang_scores:
        return max(lang_scores, key=lang_scores.get)

    return None


def detect_original_caption_language(auto_caps):
    """Find the original auto-detected language from YouTube's ASR.
    The original track has kind=asr and no tlang param in URL."""
    if not auto_caps:
        return None
    for lang_code, tracks in auto_caps.items():
        for track in tracks[:1]:
            url = track.get("url", "")
            if "kind=asr" in url and "tlang" not in url:
                return resolve_language(lang_code)
    return None


@app.route("/api/metadata", methods=["GET"])
def get_metadata():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "Missing 'url' query parameter"}), 400

    try:
        info = _extract_info_cached(url)
    except yt_dlp.utils.DownloadError as e:
        error_msg = str(e)
        if "Private video" in error_msg:
            return jsonify({"error": "This video is private"}), 403
        if "Video unavailable" in error_msg or "removed" in error_msg:
            return jsonify({"error": "This video is unavailable or deleted"}), 404
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    duration = info.get("duration")
    is_live = info.get("is_live", False)
    channel = info.get("channel") or info.get("uploader") or "YouTube Channel"
    title = info.get("title") or "YouTube Video"
    thumbnail = info.get("thumbnail") or ""
    video_id = info.get("id") or ""

    # Language detection priority:
    # 1. Description/Channel hints (most reliable for regional content)
    # 2. Title hint: "through/via" patterns + hashtag parsing + general keywords
    # 3. Non-Latin script detection in title (Tamil, Hindi, etc.)
    # 4. Tags hint (creators often tag videos with their language)
    # 5. YouTube's "Video language" field (set by uploader in YouTube Studio)
    # 6. Auto-caption original language (YouTube ASR detection - can be wrong!)
    # 7. Fallback: Use first available caption language

    language = detect_language_from_description(info.get("description"), channel)

    if not language:
        language = detect_language_from_title(title)

    if not language:
        language = detect_language_from_script(title)

    if not language:
        language = detect_language_from_tags(info.get("tags"))

    if not language:
        language = resolve_language(info.get("language"))

    if not language:
        language = detect_original_caption_language(info.get("automatic_captions"))

    # Fallback: If still no language detected, use first available caption language
    if not language:
        # Filter out live_chat from subtitles
        temp_manual_subs = {k: v for k, v in (info.get("subtitles") or {}).items() if k != "live_chat"}
        temp_auto_caps = info.get("automatic_captions") or {}

        # Try manual subtitles first
        for lang_code in temp_manual_subs:
            if temp_manual_subs[lang_code]:
                language = resolve_language(lang_code) or lang_code
                break

        # Then try automatic captions
        if not language:
            for lang_code in temp_auto_caps:
                if temp_auto_caps[lang_code]:
                    language = resolve_language(lang_code) or lang_code
                    break

    playable_in_embed = info.get("playable_in_embed", True)

    # Caption availability info
    auto_caps = info.get("automatic_captions") or {}
    manual_subs = info.get("subtitles") or {}

    # Filter out live_chat from manual_subs (it's not a real caption)
    manual_subs = {k: v for k, v in manual_subs.items() if k != "live_chat"}

    has_captions = bool(auto_caps or manual_subs)
    # Determine the caption language that will actually be used (matches /api/captions auto-pick logic)
    caption_language = None
    caption_language_code = None
    for lang_code in manual_subs:
        if manual_subs[lang_code]:
            caption_language = resolve_language(lang_code) or lang_code
            caption_language_code = lang_code
            break
    if not caption_language:
        for lang_code, tracks in auto_caps.items():
            for track in tracks[:1]:
                track_url = track.get("url", "")
                if "kind=asr" in track_url and "tlang" not in track_url:
                    caption_language = resolve_language(lang_code) or lang_code
                    caption_language_code = lang_code
                    break
            if caption_language:
                break

    available_caption_languages = {}
    for lang_code, tracks in manual_subs.items():
        if tracks:
            name = resolve_language(lang_code) or lang_code
            available_caption_languages[lang_code] = {"name": name, "type": "manual"}
    for lang_code, tracks in auto_caps.items():
        if lang_code not in available_caption_languages and tracks:
            name = resolve_language(lang_code) or lang_code
            available_caption_languages[lang_code] = {"name": name, "type": "auto"}

    return jsonify({
        "duration": duration,
        "channelName": channel,
        "title": title,
        "thumbnail": thumbnail,
        "videoId": video_id,
        "language": language,
        "playableInEmbed": playable_in_embed if playable_in_embed is not None else True,
        "captionLanguage": caption_language,
        "captionLanguageCode": caption_language_code,
        "hasCaptions": has_captions,
        "availableCaptionLanguages": available_caption_languages,
        "isLive": bool(is_live),
    })


@app.route("/api/captions", methods=["GET"])
def get_captions():
    """
    Get video captions/transcripts.
    Primary method: youtube-transcript-api (bypasses bot detection)
    Fallback: yt-dlp (if transcript API fails)
    """
    url = request.args.get("url")
    lang = request.args.get("lang")
    if not url:
        return jsonify({"error": "Missing 'url' query parameter"}), 400

    # Extract video ID
    video_id = _extract_video_id(url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    # === PRIMARY METHOD: youtube-transcript-api ===
    # This works reliably on VPS/cloud IPs without bot detection
    try:
        # Build language preference list
        preferred_langs = []
        if lang:
            preferred_langs.append(lang)
            # Add base language fallback (e.g., "en" for "en-US")
            if "-" in lang:
                preferred_langs.append(lang.split("-")[0])

        # Try to get transcript via API
        transcript_data = _get_transcript_via_api(video_id, languages=preferred_langs if preferred_langs else None)

        if transcript_data:
            # Success! Return the transcript
            return jsonify(transcript_data)

    except Exception as e:
        # Log but don't fail - we'll try yt-dlp fallback
        print(f"youtube-transcript-api failed: {e}")

    # === FALLBACK METHOD: yt-dlp ===
    # Only used if youtube-transcript-api fails (rare)
    # This may fail on VPS due to bot detection, but kept for compatibility
    try:
        info = _extract_info_cached(url)
    except yt_dlp.utils.DownloadError as e:
        error_msg = str(e)
        if "Private video" in error_msg:
            return jsonify({"error": "This video is private"}), 403
        if "Video unavailable" in error_msg or "removed" in error_msg:
            return jsonify({"error": "This video is unavailable or deleted"}), 404
        if "Sign in to confirm" in error_msg or "bot" in error_msg.lower():
            return jsonify({"error": "Video temporarily unavailable due to rate limiting. Please try again."}), 429
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    manual_subs = info.get("subtitles") or {}
    auto_caps = info.get("automatic_captions") or {}

    # Filter out live_chat (it's not a real caption)
    manual_subs = {k: v for k, v in manual_subs.items() if k != "live_chat"}

    if not manual_subs and not auto_caps:
        return jsonify({"error": "No captions available for this video"}), 404

    # Determine target language
    target_lang = lang
    if not target_lang:
        # Auto-pick: prefer manual, then original ASR
        for lc in manual_subs:
            if manual_subs[lc]:
                target_lang = lc
                break
        if not target_lang:
            for lc, tracks in auto_caps.items():
                if tracks:
                    target_lang = lc
                    break

    # Find matching language (case-insensitive)
    manual_lower = {k.lower(): k for k in manual_subs}
    auto_lower = {k.lower(): k for k in auto_caps}
    tl = target_lang.lower() if target_lang else ""

    resolved_lang = None
    tracks = None
    caption_type = "manual"

    if tl in manual_lower:
        resolved_lang = manual_lower[tl]
        tracks = manual_subs[resolved_lang]
    elif tl in auto_lower:
        resolved_lang = auto_lower[tl]
        tracks = auto_caps[resolved_lang]
        caption_type = "auto"
    else:
        # Base language fallback
        base = tl.split("-")[0]
        for lc in manual_subs:
            if lc.lower().split("-")[0] == base:
                resolved_lang = lc
                tracks = manual_subs[lc]
                break
        if not tracks:
            for lc in auto_caps:
                if lc.lower().split("-")[0] == base:
                    resolved_lang = lc
                    tracks = auto_caps[lc]
                    caption_type = "auto"
                    break

    if not tracks:
        return jsonify({"error": f"No captions available for language: {lang}"}), 404

    # Get caption URL
    caption_url = None
    for track in tracks:
        if track.get("ext") == "json3":
            caption_url = track.get("url")
            break
    if not caption_url and tracks:
        caption_url = tracks[0].get("url")

    if not caption_url:
        return jsonify({"error": "Could not find caption download URL"}), 404

    # Fetch and parse captions
    try:
        raw = _fetch_url_with_cookies(caption_url)
        if not raw:
            raw = _fetch_url_via_ytdlp(caption_url)

        segments = _parse_caption_content(raw)
        if not segments:
            return jsonify({"error": "Failed to parse captions"}), 500

        lang_name = resolve_language(resolved_lang) or resolved_lang
        return jsonify({
            "language": resolved_lang,
            "languageName": lang_name,
            "segments": segments,
            "type": caption_type,
        })

    except Exception as e:
        return jsonify({"error": f"Failed to fetch captions: {str(e)}"}), 500




@app.route("/api/formats", methods=["GET"])
def get_formats():
    """Return available download formats with estimated file sizes."""
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "Missing 'url' query parameter"}), 400

    try:
        info = _extract_info_cached(url)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    duration = info.get("duration") or 0
    formats_list = info.get("formats") or []

    # Check if video was live or is a premiere (might not have standard formats)
    was_live = info.get("was_live", False)
    is_live = info.get("is_live", False)

    QUALITY_MAP = {
        "720p HD": 720,
        "480p": 480,
        "360p": 360,
        "240p": 240,
    }
    DURATION_LIMITS = {
        "720p HD": 2700,    # 45 min
        "480p": 3600,       # 1 hour
        "360p": 7200,       # 2 hours
        "240p": 7200,       # 2 hours
        "Audio Only": 3600, # 1 hour
    }

    result = {}
    for quality_label, target_height in QUALITY_MAP.items():
        best = None
        for f in formats_list:
            h = f.get("height")
            vcodec = f.get("vcodec")

            # Skip audio-only formats and formats without video codec
            if not h or not vcodec or vcodec == "none":
                continue

            # Find exact match or closest match below target
            if h == target_height:
                best = f
                break
            elif h <= target_height and (not best or h > best.get("height", 0)):
                best = f

        if best:
            size_bytes = best.get("filesize") or best.get("filesize_approx")
            # Estimate size if not provided and we have bitrate and duration
            if not size_bytes and best.get("tbr") and duration > 0:
                size_bytes = int(best["tbr"] * 1000 / 8 * duration * 1.1)
            # If still no size and no duration, use a default estimate
            elif not size_bytes and not duration:
                # Estimate based on typical bitrates (very rough)
                typical_bitrate = {720: 2500, 480: 1000, 360: 750, 240: 400}.get(target_height, 1000)
                # Assume 5 minutes if no duration (for livestreams/premieres)
                size_bytes = int(typical_bitrate * 1000 / 8 * 300)

            size_mb = round((size_bytes or 0) / (1024 * 1024), 1)
            over_limit = duration > DURATION_LIMITS[quality_label] if duration > 0 else False

            result[quality_label] = {
                "sizeMB": size_mb,
                "available": True,
                "overLimit": over_limit,
                "maxMinutes": DURATION_LIMITS[quality_label] // 60,
            }
        else:
            result[quality_label] = {"sizeMB": 0, "available": False, "overLimit": False, "maxMinutes": DURATION_LIMITS[quality_label] // 60}

    # Audio Only
    best_audio = None
    for f in formats_list:
        acodec = f.get("acodec")
        vcodec = f.get("vcodec")

        # Audio-only format: has audio codec, no video codec or height
        if acodec and acodec != "none" and (not vcodec or vcodec == "none" or not f.get("height")):
            # Prefer higher quality audio
            if not best_audio or (f.get("abr") or 0) > (best_audio.get("abr") or 0):
                best_audio = f

    if best_audio:
        size_bytes = best_audio.get("filesize") or best_audio.get("filesize_approx")
        # Estimate size if not provided
        if not size_bytes and best_audio.get("abr") and duration > 0:
            size_bytes = int(best_audio["abr"] * 1000 / 8 * duration)
        # If still no size and no duration, estimate for 5 minutes
        elif not size_bytes and not duration:
            typical_audio_bitrate = best_audio.get("abr") or 128
            size_bytes = int(typical_audio_bitrate * 1000 / 8 * 300)

        size_mb = round((size_bytes or 0) / (1024 * 1024), 1)
        over_limit = duration > DURATION_LIMITS["Audio Only"] if duration > 0 else False
        result["Audio Only"] = {"sizeMB": size_mb, "available": True, "overLimit": over_limit, "maxMinutes": 60}
    else:
        result["Audio Only"] = {"sizeMB": 0, "available": False, "overLimit": False, "maxMinutes": 60}

    return jsonify({"formats": result, "duration": duration})


def _delayed_cleanup(path, delay=5):
    """Delete a temp file/directory after a delay."""
    def cleanup():
        import time as _time
        _time.sleep(delay)
        try:
            if os.path.isdir(path):
                shutil.rmtree(path, ignore_errors=True)
            elif os.path.exists(path):
                os.remove(path)
        except Exception:
            pass
    threading.Thread(target=cleanup, daemon=True).start()


@app.route("/api/download", methods=["GET"])
def download_video():
    """Download video in specified quality, send file, then delete."""
    url = request.args.get("url")
    quality = request.args.get("quality")
    if not url or not quality:
        return jsonify({"error": "Missing 'url' or 'quality' parameter"}), 400

    DURATION_LIMITS = {
        "720p HD": 2700,
        "480p": 3600,
        "360p": 7200,
        "240p": 7200,
        "Audio Only": 3600,
    }
    if quality not in DURATION_LIMITS:
        return jsonify({"error": f"Invalid quality: {quality}"}), 400

    try:
        info = _extract_info_cached(url)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    duration = info.get("duration") or 0
    if duration > DURATION_LIMITS[quality]:
        return jsonify({"error": f"Video too long for {quality}. Max: {DURATION_LIMITS[quality] // 60} minutes"}), 400

    QUALITY_HEIGHT = {"720p HD": 720, "480p": 480, "360p": 360, "240p": 240}
    temp_dir = tempfile.mkdtemp()
    try:
        if quality == "Audio Only":
            ydl_opts = {
                "format": "bestaudio/best",
                "postprocessors": [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3", "preferredquality": "192"}],
                "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s"),
                "quiet": True, "no_warnings": True, "noplaylist": True, "geo_bypass": True,
            }
            ext = "mp3"
            mimetype = "audio/mpeg"
        else:
            height = QUALITY_HEIGHT[quality]
            ydl_opts = {
                "format": f"bestvideo[height<={height}]+bestaudio/best[height<={height}]/best",
                "merge_output_format": "mp4",
                "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s"),
                "quiet": True, "no_warnings": True, "noplaylist": True, "geo_bypass": True,
            }
            ext = "mp4"
            mimetype = "video/mp4"

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            if hasattr(ydl, 'cookiejar'):
                for cookie in _cookie_jar:
                    ydl.cookiejar.set_cookie(cookie)
            ydl.download([url])
            if hasattr(ydl, 'cookiejar'):
                for cookie in ydl.cookiejar:
                    _cookie_jar.set_cookie(cookie)

        # Find the downloaded file
        files = glob_mod.glob(os.path.join(temp_dir, f"*.{ext}"))
        if not files:
            files = glob_mod.glob(os.path.join(temp_dir, "*.*"))
        if not files:
            return jsonify({"error": "Download completed but file not found"}), 500

        filepath = files[0]
        title = info.get("title") or "video"
        # Sanitize title for filename: remove characters invalid in filenames
        safe_title = re.sub(r'[<>:"/\\|?*]', '', title).strip()
        filename = f"VoxText-AI_{safe_title}.{ext}"

        response = send_file(filepath, mimetype=mimetype, as_attachment=True, download_name=filename)
        _delayed_cleanup(temp_dir, delay=10)
        return response

    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        return jsonify({"error": f"Download failed: {str(e)}"}), 500


if __name__ == "__main__":
    # Development server - for production use gunicorn
    app.run(host="0.0.0.0", port=5000, debug=False)
