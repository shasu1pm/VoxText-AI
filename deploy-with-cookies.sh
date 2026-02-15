#!/bin/bash
# Deploy backend with YouTube cookies to fix bot detection

set -e

VPS_IP="72.62.229.88"
VPS_USER="root"
PROJECT_PATH="/opt/VoxText-AI"
LOCAL_COOKIES="Backend/youtube_cookies.txt"

echo "========================================="
echo "Deploying Backend with YouTube Cookies"
echo "========================================="
echo ""

# Check if cookies file exists locally
if [ ! -f "$LOCAL_COOKIES" ]; then
    echo "⚠️  WARNING: youtube_cookies.txt not found!"
    echo ""
    echo "YouTube will block the VPS IP without cookies."
    echo "Please follow YOUTUBE-COOKIES-GUIDE.md to export cookies."
    echo ""
    read -p "Continue without cookies? (y/N): " continue_without_cookies

    if [[ ! "$continue_without_cookies" =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled. Please add cookies first."
        exit 1
    fi
else
    echo "✅ Found youtube_cookies.txt locally"

    # Upload cookies to VPS
    echo "📤 Uploading cookies to VPS..."
    scp "$LOCAL_COOKIES" ${VPS_USER}@${VPS_IP}:${PROJECT_PATH}/Backend/
    echo "✅ Cookies uploaded"
fi

echo ""
echo "Step 1: Connecting to VPS..."
ssh -o StrictHostKeyChecking=accept-new ${VPS_USER}@${VPS_IP} << 'ENDSSH'

set -e
cd /opt/VoxText-AI

echo ""
echo "Step 2: Pulling latest code from GitHub..."
git pull origin main

echo ""
echo "Step 3: Verifying cookies on VPS..."
if [ -f "Backend/youtube_cookies.txt" ]; then
    echo "✅ Cookies file present on VPS"
    ls -lh Backend/youtube_cookies.txt
else
    echo "⚠️  No cookies file on VPS - may have bot detection issues"
fi

echo ""
echo "Step 4: Rebuilding backend container..."
docker compose down backend
docker compose up -d --build backend

echo ""
echo "Step 5: Waiting for backend to start..."
sleep 10

echo ""
echo "Step 6: Checking backend status..."
docker ps | grep voxtext-backend

echo ""
echo "Step 7: Testing health endpoint..."
curl -s http://localhost:5001/health

echo ""
echo "Step 8: Testing YouTube video metadata..."
echo "Testing Japanese video (NNbMuNhNZ7o)..."
RESULT=$(curl -s "http://localhost:5001/api/metadata?url=https://www.youtube.com/watch?v=NNbMuNhNZ7o")

# Check if we got duration and captions
HAS_DURATION=$(echo "$RESULT" | grep -o '"duration":[0-9]*' | grep -v '"duration":null' || echo "")
HAS_CAPTIONS=$(echo "$RESULT" | grep -o '"hasCaptions":true' || echo "")

echo ""
if [ -n "$HAS_DURATION" ] && [ -n "$HAS_CAPTIONS" ]; then
    echo "✅ SUCCESS! YouTube metadata working correctly:"
    echo "$RESULT" | python3 -m json.tool | grep -E "(duration|hasCaptions|captionLanguage|language)" | head -10
else
    echo "❌ WARNING: Still getting incomplete metadata"
    echo "Duration found: ${HAS_DURATION:-NO}"
    echo "Captions found: ${HAS_CAPTIONS:-NO}"
    echo ""
    echo "This means:"
    echo "- Cookies may be expired or invalid"
    echo "- YouTube is still blocking the IP"
    echo "- Please re-export fresh cookies and try again"
fi

echo ""
echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""

ENDSSH

echo ""
echo "Testing live API..."
echo ""
curl -s https://api.voxtext.in/health
echo ""
echo ""
echo "✅ All done! Backend deployed successfully."
echo ""
echo "Test your live site at: https://voxtext.in"
