#!/bin/bash
# Deploy backend to production server

set -e  # Exit on error

VPS_IP="72.62.229.88"
VPS_USER="root"
PROJECT_PATH="/opt/VoxText-AI"

echo "========================================="
echo "Deploying Backend to Production"
echo "========================================="
echo ""

echo "Step 1: Connecting to VPS..."
ssh -o StrictHostKeyChecking=accept-new ${VPS_USER}@${VPS_IP} << 'ENDSSH'

set -e

cd /opt/VoxText-AI

echo "Step 2: Pulling latest code from GitHub..."
git pull origin main

echo ""
echo "Step 3: Rebuilding backend container..."
docker compose down backend
docker compose up -d --build backend

echo ""
echo "Step 4: Waiting for backend to start..."
sleep 5

echo ""
echo "Step 5: Checking backend status..."
docker ps | grep voxtext-backend

echo ""
echo "Step 6: Testing health endpoint..."
curl -s http://localhost:5001/health

echo ""
echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "Backend is now running with the latest code."
echo ""

ENDSSH

echo ""
echo "Testing live API..."
echo ""
curl -s https://api.voxtext.in/health
echo ""
echo ""
echo "✅ All done! Backend deployed successfully."
