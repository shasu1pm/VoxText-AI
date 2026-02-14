#!/usr/bin/env python3
"""Test script to diagnose YouTube video issues"""

import yt_dlp
import json

url = "https://www.youtube.com/watch?v=AzJ38LSBEpQ"

ydl_opts = {
    "quiet": True,
    "no_warnings": True,
    "skip_download": True,
    "noplaylist": True,
}

print(f"Testing URL: {url}\n")

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(url, download=False)

    print("=" * 80)
    print("BASIC INFO")
    print("=" * 80)
    print(f"Title: {info.get('title')}")
    print(f"Channel: {info.get('channel') or info.get('uploader')}")
    print(f"Duration: {info.get('duration')}")
    print(f"Is Live: {info.get('is_live')}")
    print(f"Was Live: {info.get('was_live')}")
    print(f"Language: {info.get('language')}")
    print(f"Video ID: {info.get('id')}")

    print("\n" + "=" * 80)
    print("CAPTIONS")
    print("=" * 80)

    manual_subs = info.get("subtitles") or {}
    auto_caps = info.get("automatic_captions") or {}

    print(f"\nManual Subtitles: {len(manual_subs)} languages")
    for lang, tracks in list(manual_subs.items())[:10]:
        print(f"  - {lang}: {len(tracks)} tracks")
        if tracks:
            print(f"    First track: {tracks[0].get('ext')} - {tracks[0].get('url')[:100]}...")

    print(f"\nAutomatic Captions: {len(auto_caps)} languages")
    for lang, tracks in list(auto_caps.items())[:10]:
        print(f"  - {lang}: {len(tracks)} tracks")
        if tracks:
            track = tracks[0]
            print(f"    First track: {track.get('ext')} - URL contains 'kind=asr': {'kind=asr' in track.get('url', '')}")

    print("\n" + "=" * 80)
    print("FORMATS")
    print("=" * 80)

    formats = info.get("formats") or []
    print(f"\nTotal formats: {len(formats)}")

    # Group by resolution
    video_formats = {}
    audio_formats = []

    for fmt in formats:
        resolution = fmt.get("resolution")
        height = fmt.get("height")
        ext = fmt.get("ext")
        filesize = fmt.get("filesize") or fmt.get("filesize_approx") or 0
        vcodec = fmt.get("vcodec")
        acodec = fmt.get("acodec")

        if vcodec and vcodec != "none":
            if height:
                key = f"{height}p"
                if key not in video_formats:
                    video_formats[key] = []
                video_formats[key].append({
                    "ext": ext,
                    "filesize": filesize,
                    "vcodec": vcodec,
                    "acodec": acodec
                })
        elif acodec and acodec != "none":
            audio_formats.append({
                "ext": ext,
                "filesize": filesize,
                "acodec": acodec
            })

    print("\nVideo Formats by Resolution:")
    for res in sorted(video_formats.keys(), key=lambda x: int(x.replace('p', ''))):
        print(f"  {res}: {len(video_formats[res])} formats")
        for fmt in video_formats[res][:2]:
            print(f"    - {fmt['ext']}, size: {fmt['filesize'] / 1024 / 1024:.1f}MB, vcodec: {fmt['vcodec']}, acodec: {fmt['acodec']}")

    print(f"\nAudio Only Formats: {len(audio_formats)}")
    for fmt in audio_formats[:3]:
        print(f"  - {fmt['ext']}, size: {fmt['filesize'] / 1024 / 1024:.1f}MB, acodec: {fmt['acodec']}")

    # Check for specific issues
    print("\n" + "=" * 80)
    print("DIAGNOSTICS")
    print("=" * 80)

    issues = []

    if not info.get('duration'):
        issues.append("⚠️  Duration is null/0 - might be a live stream or removed video")

    if info.get('was_live'):
        issues.append("⚠️  This was a live stream")

    if info.get('is_live'):
        issues.append("⚠️  This is currently live")

    if not manual_subs and not auto_caps:
        issues.append("❌ No captions available")
    elif "live_chat" in manual_subs and len(manual_subs) == 1:
        issues.append("❌ Only live_chat captions (not real captions)")

    if not video_formats:
        issues.append("❌ No video formats available")

    if not audio_formats:
        issues.append("❌ No audio formats available")

    if issues:
        print("\nIssues Found:")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\n✅ No issues detected")
