# Coolify Deployment Steps - VoxText AI

## BACKEND DEPLOYMENT

### Step 1: Create New Application
1. Click **"+ New"** button in Coolify
2. Select **"Application"**

### Step 2: Configure Source
**Select:** Public Repository (or GitHub if connected)

**Repository Details:**
```
Repository URL: https://github.com/shasu1pm/VoxText-AI
Branch: main
```

### Step 3: Build Configuration
**Build Pack:** Dockerfile

**Important Settings:**
```
Dockerfile Location: Backend/Dockerfile
Base Directory (Build Context): Backend
Port: 5000
```

### Step 4: General Settings
```
Application Name: voxtext-backend
```

### Step 5: Environment Variables
Click "Environment Variables" tab:
```
FLASK_ENV=production
PYTHONUNBUFFERED=1
```

### Step 6: Domain Settings
Click "Domains" tab:
```
Domain: api.voxtext.in
```

**Important:** Enable/Check these:
- ✅ Generate SSL Certificate (Let's Encrypt)
- ✅ Force HTTPS

### Step 7: Deploy
- Click **"Save"** button
- Click **"Deploy"** button
- Wait for build to complete (5-10 minutes)
- Check logs for any errors

### Step 8: Verify Backend
Once deployed, test:
```
curl https://api.voxtext.in/health
```
Should return: `{"status": "healthy", "service": "voxtext-backend"}`

---

## FRONTEND DEPLOYMENT

### Step 1: Create New Application
1. Click **"+ New"** button in Coolify
2. Select **"Application"**

### Step 2: Configure Source
**Select:** Public Repository (or GitHub if connected)

**Repository Details:**
```
Repository URL: https://github.com/shasu1pm/VoxText-AI
Branch: main
```

### Step 3: Build Configuration
**Build Pack:** Dockerfile

**Important Settings:**
```
Dockerfile Location: Frontend/Dockerfile
Base Directory (Build Context): Frontend
Port: 80
```

### Step 4: General Settings
```
Application Name: voxtext-frontend
```

### Step 5: Environment Variables
Click "Environment Variables" tab:
```
VITE_API_URL=https://api.voxtext.in
```

### Step 6: Domain Settings
Click "Domains" tab:
```
Domain: voxtext.in
```

**Optional - Add www redirect:**
```
Additional Domain: www.voxtext.in
Redirect to: voxtext.in
```

**Important:** Enable/Check these:
- ✅ Generate SSL Certificate (Let's Encrypt)
- ✅ Force HTTPS

### Step 7: Deploy
- Click **"Save"** button
- Click **"Deploy"** button
- Wait for build to complete (5-10 minutes)
- Check logs for any errors

### Step 8: Verify Frontend
Once deployed, open browser:
```
https://voxtext.in
```
Should load your VoxText AI application!

---

## DNS CONFIGURATION (Hostinger)

### Required DNS Records

In your **Hostinger DNS Management** for `voxtext.in`:

**Get Your VPS IP Address First:**
- From Coolify dashboard, note your server IP address
- OR from Hostinger VPS panel

**Add these A Records:**

| Type | Name/Host | Value (Points to) | TTL  |
|------|-----------|-------------------|------|
| A    | @         | YOUR_VPS_IP       | 3600 |
| A    | www       | YOUR_VPS_IP       | 3600 |
| A    | api       | YOUR_VPS_IP       | 3600 |

**Example (replace with YOUR IP):**
```
A    @      165.22.xxx.xxx    3600
A    www    165.22.xxx.xxx    3600
A    api    165.22.xxx.xxx    3600
```

**Important:** DNS propagation takes 5-60 minutes. Be patient!

---

## TROUBLESHOOTING

### Build Failed?
**Check:**
1. Coolify logs for specific error
2. Dockerfile location is correct
3. Base directory is set correctly
4. All dependencies are in requirements.txt/package.json

### SSL Certificate Failed?
**Check:**
1. DNS is pointing to correct IP (wait for propagation)
2. Port 80 and 443 are open on firewall
3. Domain ownership is verified
4. Try regenerating certificate after DNS propagates

### Backend Not Responding?
**Check:**
1. Container is running (green status in Coolify)
2. Port 5000 is exposed
3. Health endpoint: `curl http://YOUR_VPS_IP:5000/health`
4. Logs for errors

### Frontend Shows Blank Page?
**Check:**
1. Browser console for errors (F12)
2. VITE_API_URL environment variable is set
3. Build completed successfully
4. Nginx configuration is correct

---

## VERIFICATION CHECKLIST

### Backend
- [ ] Container running (green in Coolify)
- [ ] Health check passes: `curl https://api.voxtext.in/health`
- [ ] No errors in logs
- [ ] SSL certificate generated

### Frontend
- [ ] Container running (green in Coolify)
- [ ] Website loads: `https://voxtext.in`
- [ ] No console errors in browser
- [ ] SSL certificate generated
- [ ] Can make API calls to backend

### DNS
- [ ] All A records added
- [ ] DNS propagated (test with `nslookup voxtext.in`)
- [ ] All domains resolve to VPS IP

---

## COMMON COOLIFY UI VARIATIONS

Coolify UI may vary by version. Here are common field names:

**Repository:**
- "Git Repository URL" or "Repository URL" or "Source"

**Dockerfile Path:**
- "Dockerfile Location" or "Dockerfile Path" or "Custom Dockerfile"

**Build Context:**
- "Base Directory" or "Build Context" or "Context Directory"

**Port:**
- "Port" or "Exposed Port" or "Container Port"

**Domain:**
- "Domain" or "Custom Domain" or "FQDN" or "Hostname"

---

## NEXT STEPS AFTER DEPLOYMENT

1. ✅ Test all features end-to-end
2. ✅ Set up monitoring/alerts in Coolify
3. ✅ Configure GitHub webhooks for auto-deploy
4. ✅ Add custom error pages (optional)
5. ✅ Enable backup strategy
6. ✅ Monitor resource usage

---

**Need help?** Check the specific error in Coolify logs and search for it, or ask for assistance!
