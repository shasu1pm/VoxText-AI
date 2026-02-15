# YouTube Cookies Setup Guide

## Why Do You Need This?

YouTube blocks VPS/cloud server IP addresses, treating them as bots. This causes the backend to return empty metadata (no duration, captions, or formats). Adding YouTube cookies from a logged-in browser session fixes this issue.

---

## Step-by-Step Instructions

### **Option 1: Chrome/Edge (Recommended)**

1. **Install the Cookie Extension:**
   - Go to: https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc
   - Click "Add to Chrome" / "Add to Edge"
   - Grant permissions when prompted

2. **Export YouTube Cookies:**
   - Open a new tab and go to: https://www.youtube.com
   - **Make sure you're logged into your YouTube/Google account**
   - Click the extension icon (cookie icon in your toolbar)
   - Click "Export" or "Download cookies.txt"
   - Save the file as `youtube_cookies.txt`

3. **Move the File:**
   ```bash
   # Move the downloaded file to your VoxText-AI Backend folder
   # On Windows:
   move "%USERPROFILE%\Downloads\youtube_cookies.txt" "D:\Claude Code\VoxText-AI\Backend\"

   # Verify it's there:
   dir "D:\Claude Code\VoxText-AI\Backend\youtube_cookies.txt"
   ```

---

### **Option 2: Firefox**

1. **Install the Cookie Extension:**
   - Go to: https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/
   - Click "Add to Firefox"
   - Grant permissions when prompted

2. **Export YouTube Cookies:**
   - Open a new tab and go to: https://www.youtube.com
   - **Make sure you're logged into your YouTube/Google account**
   - Right-click anywhere on the page
   - Select "cookies.txt" from the context menu
   - Save the file as `youtube_cookies.txt`

3. **Move the File:**
   ```bash
   # Move to Backend folder
   move "%USERPROFILE%\Downloads\youtube_cookies.txt" "D:\Claude Code\VoxText-AI\Backend\"
   ```

---

### **Option 3: Manual Export (Advanced)**

If you can't use extensions:

1. **Open Developer Tools:**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Or `Cmd+Option+I` (Mac)

2. **Go to Application/Storage Tab:**
   - Chrome: Click "Application" tab → "Cookies" → "https://www.youtube.com"
   - Firefox: Click "Storage" tab → "Cookies" → "https://www.youtube.com"

3. **Export Cookies:**
   - You'll need to manually create a Netscape format cookies.txt file
   - Format: `domain	flag	path	secure	expiration	name	value`
   - This is complex - **use Option 1 or 2 instead!**

---

## After Exporting Cookies

### **Verify the File:**

```bash
# Check file exists and has content
type "D:\Claude Code\VoxText-AI\Backend\youtube_cookies.txt"
```

You should see something like:
```
# Netscape HTTP Cookie File
.youtube.com	TRUE	/	TRUE	1234567890	CONSENT	YES+...
.youtube.com	TRUE	/	FALSE	1234567890	VISITOR_INFO1_LIVE	...
```

### **Deploy to Production:**

The deployment script will automatically copy the cookies file to the server and rebuild the container.

---

## Security Notes

⚠️ **IMPORTANT:**

- **Cookies contain your YouTube login session** - keep them private!
- **Do NOT commit cookies to GitHub** - they're already in `.gitignore`
- **Cookies expire** - you may need to re-export them every few months
- **If you log out of YouTube**, the cookies become invalid - re-export them

---

## Troubleshooting

### "File not found" error when building Docker:
- This is normal if cookies don't exist
- The app will work without cookies on localhost but may fail on production VPS

### "Login required" errors still appearing:
- Cookies may be expired - re-export fresh cookies
- Make sure you were logged into YouTube when exporting
- Verify the file format is correct (Netscape format)

### "Bot detection" still happening:
- Try logging into YouTube Premium if you have it
- Use a personal Google account (not a bot/test account)
- Clear cache: `docker system prune -a` and rebuild

---

## What Happens Now?

1. ✅ Code updated to check for `youtube_cookies.txt`
2. ✅ If cookies exist, yt-dlp will use them to bypass bot detection
3. ✅ If cookies don't exist, app still works but may fail on VPS IPs
4. ✅ Production will work exactly like localhost once cookies are added

---

## Quick Commands

```bash
# 1. Export cookies using browser extension
# 2. Move to Backend folder:
move "%USERPROFILE%\Downloads\youtube_cookies.txt" "D:\Claude Code\VoxText-AI\Backend\"

# 3. Verify:
type "D:\Claude Code\VoxText-AI\Backend\youtube_cookies.txt"

# 4. Deploy will be handled automatically when you commit and push
```

---

**Ready to deploy once you add the cookies!** 🚀
