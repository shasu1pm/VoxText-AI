# VoxText AI - Deployment Guide for Coolify on Hostinger

## Prerequisites

✅ Domain: voxtext.in (configured on Hostinger)
✅ Coolify installed on Hostinger VPS
✅ GitHub repository with Frontend and Backend code

---

## Deployment Architecture

```
voxtext.in (Frontend) → Nginx → React SPA
   ↓ (API calls to /api)
api.voxtext.in or voxtext.in/api (Backend) → Flask + yt-dlp
```

---

## Step 1: Access Coolify Dashboard

1. Log in to your Coolify instance on Hostinger
2. Typical URL: `https://coolify.yourdomain.com` or the IP with port

---

## Step 2: Deploy Backend (Flask API)

### Option A: Deploy from GitHub (Recommended)

1. **Create New Resource** in Coolify
   - Click "+ New" → "Application"
   - Select "Public Repository"
   - Repository: `https://github.com/shasu1pm/VoxText-AI`
   - Branch: `main`
   - Build Pack: **Dockerfile**

2. **Configure Backend Settings**
   - **Name:** `voxtext-backend`
   - **Port:** `5000`
   - **Dockerfile Location:** `/Backend/Dockerfile`
   - **Build Context:** `/Backend`

3. **Environment Variables**
   ```
   FLASK_ENV=production
   PYTHONUNBUFFERED=1
   ```

4. **Domain Settings**
   - Add custom domain: `api.voxtext.in`
   - OR use subdirectory: `voxtext.in/api` (requires reverse proxy config)
   - Enable HTTPS (Coolify auto-generates Let's Encrypt SSL)

5. **Deploy**
   - Click "Deploy" and wait for build completion

---

## Step 3: Deploy Frontend (React + Vite)

1. **Create New Resource** in Coolify
   - Click "+ New" → "Application"
   - Select "Public Repository"
   - Repository: `https://github.com/shasu1pm/VoxText-AI`
   - Branch: `main`
   - Build Pack: **Dockerfile**

2. **Configure Frontend Settings**
   - **Name:** `voxtext-frontend`
   - **Port:** `80`
   - **Dockerfile Location:** `/Frontend/Dockerfile`
   - **Build Context:** `/Frontend`

3. **Environment Variables** (if needed for API URL)
   ```
   VITE_API_URL=https://api.voxtext.in
   ```

   > Note: Update your frontend code to use `VITE_API_URL` environment variable for API calls

4. **Domain Settings**
   - Add custom domain: `voxtext.in`
   - Add www redirect: `www.voxtext.in` → `voxtext.in`
   - Enable HTTPS

5. **Deploy**
   - Click "Deploy"

---

## Step 4: DNS Configuration on Hostinger

Go to Hostinger DNS Management for `voxtext.in`:

### A Records
```
Type    Name    Value                TTL
A       @       <Your-VPS-IP>        3600
A       www     <Your-VPS-IP>        3600
A       api     <Your-VPS-IP>        3600
```

### CNAME Record (if using Coolify subdomain)
```
Type     Name    Value                      TTL
CNAME    www     voxtext.in                 3600
```

> **Important:** DNS propagation can take 5-60 minutes

---

## Step 5: Verify Deployment

### Check Backend
```bash
curl https://api.voxtext.in/health
# Should return API health status
```

### Check Frontend
Open browser: `https://voxtext.in`
- Should load React application
- Check browser console for any API connection errors

---

## Step 6: Configure CORS (Important!)

Make sure your Flask backend (`server.py`) has proper CORS configuration:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://voxtext.in",
    "https://www.voxtext.in"
])
```

---

## Alternative: Docker Compose Deployment

If you prefer deploying with Docker Compose:

1. **In Coolify:**
   - Create "Docker Compose" application
   - Paste the `docker-compose.yml` content
   - Set repository to auto-pull updates

2. **Custom Configuration:**
   - Map ports correctly in Coolify's network
   - Use Coolify's reverse proxy for SSL termination

---

## Monitoring & Logs

### In Coolify Dashboard:
- **Logs:** Real-time container logs for debugging
- **Metrics:** CPU, Memory, Network usage
- **Restart Policy:** Set to "unless-stopped" for auto-recovery

---

## Automatic Deployments (CI/CD)

Enable **GitHub Webhook** in Coolify:
1. Go to application settings
2. Copy webhook URL
3. Add to GitHub repo: Settings → Webhooks
4. Select "Push events"
5. Now every push to `main` branch auto-deploys!

---

## Troubleshooting

### Frontend can't reach backend
✅ Check CORS settings in Flask
✅ Verify nginx.conf proxy_pass points to correct backend URL
✅ Ensure both services are in same Docker network

### Build fails
✅ Check Dockerfile paths are correct
✅ Verify all dependencies are in package.json/requirements.txt
✅ Check Coolify build logs for specific errors

### SSL certificate issues
✅ Ensure DNS is correctly pointed to VPS IP
✅ Wait for DNS propagation (use `dig voxtext.in`)
✅ Coolify auto-renews Let's Encrypt certificates

---

## Production Optimizations

1. **Backend:**
   - Use production WSGI server (Gunicorn/Waitress)
   - Update `Backend/Dockerfile` CMD to use Gunicorn:
     ```dockerfile
     CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "server:app"]
     ```

2. **Frontend:**
   - Already optimized with Nginx + gzip
   - Static assets cached for 1 year
   - SPA routing handled correctly

3. **Database/Storage:**
   - If needed, add Redis/PostgreSQL service in Coolify
   - Use volumes for persistent data

---

## Estimated Deployment Time

- Initial setup: 15-30 minutes
- DNS propagation: 5-60 minutes
- SSL certificate generation: 2-5 minutes
- **Total: ~1 hour**

---

## Cost Estimate

- Domain (voxtext.in): Already purchased ✅
- Coolify: Free (self-hosted) ✅
- Hostinger VPS: Based on your plan
- **Total additional cost: $0** 🎉

---

## Need Help?

- Check Coolify logs in dashboard
- Review container health checks
- Verify network connectivity between services
- Check GitHub Actions if using CI/CD

---

**Ready to deploy!** Follow the steps above and your VoxText AI will be live on voxtext.in 🚀
