# VoxText AI - Quick Start Guide for Coolify Deployment

## 🚀 Deploy in 5 Steps (15 minutes)

### Step 1: Prepare Your Repository (Already Done! ✅)

Your GitHub repo is ready with:
- ✅ Frontend Dockerfile
- ✅ Backend Dockerfile
- ✅ nginx configuration
- ✅ docker-compose.yml

---

### Step 2: Login to Coolify

1. Access your Coolify dashboard (usually at your VPS IP or domain)
2. Make sure Coolify is connected to your server

---

### Step 3: Deploy Backend First

**In Coolify Dashboard:**

1. Click **"+ New Resource"** → **"Application"**

2. **Source Configuration:**
   - Source: **Public Repository**
   - Repository URL: `https://github.com/shasu1pm/VoxText-AI`
   - Branch: `main`
   - Build Pack: **Dockerfile**

3. **Application Settings:**
   ```
   Name: voxtext-backend
   Port: 5000
   Dockerfile Location: Backend/Dockerfile
   Build Context: Backend
   ```

4. **Environment Variables:**
   ```
   FLASK_ENV=production
   ```

5. **Domain Configuration:**
   - Custom Domain: `api.voxtext.in`
   - Enable "Generate SSL Certificate"

6. Click **"Save"** then **"Deploy"**

7. Wait for build to complete (2-5 minutes)

---

### Step 4: Deploy Frontend

**In Coolify Dashboard:**

1. Click **"+ New Resource"** → **"Application"**

2. **Source Configuration:**
   - Source: **Public Repository**
   - Repository URL: `https://github.com/shasu1pm/VoxText-AI`
   - Branch: `main`
   - Build Pack: **Dockerfile**

3. **Application Settings:**
   ```
   Name: voxtext-frontend
   Port: 80
   Dockerfile Location: Frontend/Dockerfile
   Build Context: Frontend
   ```

4. **Build Variables (for frontend build):**
   ```
   VITE_API_URL=https://api.voxtext.in/api
   ```
   Optional:
   ```
   VITE_YOUTUBE_API_KEY=your_youtube_api_key
   ```

5. **Domain Configuration:**
   - Custom Domain: `voxtext.in`
   - Enable "Generate SSL Certificate"
   - Optional: Add `www.voxtext.in` and redirect to `voxtext.in`

6. Click **"Save"** then **"Deploy"**

7. Wait for build to complete (3-7 minutes)

---

### Step 5: Configure DNS on Hostinger

**Go to Hostinger DNS Management:**

Add these DNS records:

| Type | Name | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | YOUR_VPS_IP     | 3600 |
| A    | www  | YOUR_VPS_IP     | 3600 |
| A    | api  | YOUR_VPS_IP     | 3600 |

> **Replace** `YOUR_VPS_IP` with your actual VPS IP address from Hostinger

**Wait 5-30 minutes** for DNS propagation

---

## ✅ Verification

### Test Backend:
```bash
curl https://api.voxtext.in/health
```
Expected response:
```json
{"status": "healthy", "service": "voxtext-backend"}
```

### Test Frontend:
Open in browser: **https://voxtext.in**

Should load your VoxText AI application!

---

## 🔄 Enable Auto-Deploy (CI/CD)

**In Coolify:**
1. Go to Backend app → Settings → **"Webhooks"**
2. Copy the webhook URL
3. Go to GitHub repo: **Settings → Webhooks → Add webhook**
4. Paste URL, select **"Push events"**, click **"Add webhook"**
5. Repeat for Frontend app

Now every `git push` to `main` will auto-deploy! 🎉

---

## 🛠️ Troubleshooting

### Frontend shows blank page:
- Check browser console for errors
- Verify API URL in environment variables
- Check Coolify logs for build errors

### Backend not responding:
- Check if container is running in Coolify
- Verify port 5000 is exposed
- Check firewall rules on VPS

### SSL certificate error:
- Wait for DNS propagation (use `dig voxtext.in`)
- Ensure domain points to correct IP
- Coolify will auto-retry SSL generation

---

## 📊 Monitor Your Apps

**In Coolify Dashboard:**
- **Logs:** Real-time application logs
- **Metrics:** CPU, RAM, Network usage
- **Deployments:** History of all deployments
- **Events:** Webhook triggers and builds

---

## 🎯 Next Steps

1. ✅ Deploy and verify both services
2. ✅ Configure custom domain
3. ✅ Enable auto-deploy from GitHub
4. 📈 Monitor performance in Coolify
5. 🔒 Review security settings
6. 🚀 Share your live app!

---

## 💰 Total Cost

- **Domain:** Already purchased ✅
- **Coolify:** Free (open-source) ✅
- **Deployment:** $0 ✅

---

**Need more details?** Check `DEPLOYMENT.md` for comprehensive guide.

**Your app will be live at:**
- 🌐 Frontend: https://voxtext.in
- 🔌 Backend: https://api.voxtext.in

Happy deploying! 🚀
