# VoxText AI - Hosting Checklist ✅

Complete this checklist to ensure successful deployment to Hostinger + Coolify.

---

## Pre-Deployment Checklist

### 1. Domain Setup
- [ ] Domain `voxtext.in` purchased and active on Hostinger
- [ ] Access to Hostinger DNS management panel
- [ ] VPS/Server IP address noted down

### 2. Coolify Setup
- [ ] Coolify installed on Hostinger VPS
- [ ] Coolify dashboard accessible
- [ ] SSH access to VPS (if needed for debugging)
- [ ] Server resources sufficient (min: 2GB RAM, 20GB storage)

### 3. GitHub Repository
- [ ] Repository is public or Coolify has access
- [ ] All code pushed to `main` branch
- [ ] Dockerfile for Frontend exists ✅ (Created)
- [ ] Dockerfile for Backend exists ✅ (Already existed)
- [ ] nginx.conf for Frontend exists ✅ (Created)

---

## Deployment Steps

### Backend Deployment
- [ ] Created new application in Coolify
- [ ] Selected correct repository and branch
- [ ] Set Dockerfile location: `Backend/Dockerfile`
- [ ] Set build context: `Backend`
- [ ] Configured port: `5000`
- [ ] Added environment variables (if needed)
- [ ] Set custom domain: `api.voxtext.in`
- [ ] Enabled SSL certificate generation
- [ ] Deployed successfully (green status)
- [ ] Health check passes: `curl https://api.voxtext.in/health`

### Frontend Deployment
- [ ] Created new application in Coolify
- [ ] Selected correct repository and branch
- [ ] Set Dockerfile location: `Frontend/Dockerfile`
- [ ] Set build context: `Frontend`
- [ ] Configured port: `80`
- [ ] Added environment variable: `VITE_API_URL=https://api.voxtext.in`
- [ ] Set custom domain: `voxtext.in`
- [ ] Optional: Added `www.voxtext.in` redirect
- [ ] Enabled SSL certificate generation
- [ ] Deployed successfully (green status)
- [ ] Website loads in browser: `https://voxtext.in`

---

## DNS Configuration

### Hostinger DNS Records
- [ ] A record: `@` → VPS IP
- [ ] A record: `www` → VPS IP
- [ ] A record: `api` → VPS IP
- [ ] DNS propagation completed (check with `dig voxtext.in`)

---

## Post-Deployment Verification

### Functionality Tests
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] YouTube video processing works
- [ ] Transcript generation works
- [ ] MP4/MP3 download functionality works
- [ ] All UI components display correctly

### Security & Performance
- [ ] HTTPS enabled on all domains (🔒 in browser)
- [ ] SSL certificates valid and auto-renewing
- [ ] CORS configured correctly (no console errors)
- [ ] Backend health endpoint accessible
- [ ] Gzip compression working (check network tab)
- [ ] Static assets cached properly

### Monitoring
- [ ] Coolify logs accessible for both services
- [ ] Container restart policy set to "unless-stopped"
- [ ] Health checks configured
- [ ] Resource usage within normal limits

---

## Optional Enhancements

### CI/CD
- [ ] GitHub webhooks configured for auto-deploy
- [ ] Test webhook with dummy commit
- [ ] Verify auto-deployment works

### Backup & Recovery
- [ ] Critical data backup strategy defined
- [ ] Environment variables documented
- [ ] Docker images tagged properly
- [ ] Rollback procedure tested

### Performance Optimization
- [ ] CDN considered for static assets (optional)
- [ ] Caching headers optimized
- [ ] Database connection pooling (if using DB)
- [ ] Rate limiting configured (if needed)

---

## Common Issues & Solutions

### Issue: DNS not resolving
**Solution:**
- Verify A records in Hostinger DNS
- Wait 30-60 minutes for propagation
- Clear local DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### Issue: SSL certificate not generating
**Solution:**
- Ensure DNS points to correct IP
- Check Coolify logs for SSL errors
- Verify port 80 and 443 are open on firewall
- Wait a few minutes and retry in Coolify

### Issue: Frontend can't connect to backend
**Solution:**
- Check CORS settings in `server.py`
- Verify `VITE_API_URL` environment variable
- Check nginx proxy configuration
- Ensure both containers are running

### Issue: Build fails in Coolify
**Solution:**
- Check build logs in Coolify
- Verify Dockerfile paths are correct
- Ensure all dependencies are in package.json/requirements.txt
- Check for syntax errors in Dockerfiles

---

## Support Resources

- **Coolify Docs:** https://coolify.io/docs
- **Hostinger Support:** Hostinger control panel → Support
- **VoxText AI Issues:** https://github.com/shasu1pm/VoxText-AI/issues

---

## Final Verification Commands

```bash
# Check DNS resolution
dig voxtext.in
dig api.voxtext.in

# Test backend health
curl https://api.voxtext.in/health

# Check SSL certificate
curl -vI https://voxtext.in 2>&1 | grep -i "SSL\|certificate"

# Test response time
curl -w "@-" -o /dev/null -s https://voxtext.in <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
         time_total:  %{time_total}\n
EOF
```

---

## 🎉 Deployment Complete!

Once all items are checked:
- ✅ Your app is live at **https://voxtext.in**
- ✅ API is running at **https://api.voxtext.in**
- ✅ Auto-deployment configured
- ✅ Monitoring active

**Congratulations on your successful deployment!** 🚀

---

**Date Completed:** _______________

**Deployed by:** _______________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
