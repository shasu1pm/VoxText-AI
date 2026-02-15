#!/usr/bin/env python3
"""Test script for production debugging"""

import sys
sys.path.insert(0, '/app')

try:
    from server import _extract_info_cached

    url = 'https://www.youtube.com/watch?v=NNbMuNhNZ7o'
    print(f"Testing URL: {url}")
    print("=" * 60)

    info = _extract_info_cached(url)

    print(f"Duration: {info.get('duration')}")
    print(f"Has subtitles: {bool(info.get('subtitles'))}")
    print(f"Has automatic_captions: {bool(info.get('automatic_captions'))}")

    subs = info.get('subtitles') or {}
    auto_caps = info.get('automatic_captions') or {}

    print(f"Subtitle languages: {list(subs.keys())}")
    print(f"Auto caption languages (first 5): {list(auto_caps.keys())[:5]}")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
