# VoxText AI - Hosting Installation Documentation

**Complete deployment documentation for VoxText AI on Hostinger VPS with Coolify**

---

## 📚 Documentation Overview

This folder contains complete step-by-step guides for deploying VoxText AI to production.

### Documents Included:

1. **[Complete-Deployment-Guide.md](Complete-Deployment-Guide.md)** ⭐ **START HERE**
   - Full deployment walkthrough
   - Every command explained
   - Step-by-step instructions from SSH to live site
   - All configuration files included
   - **~50 pages** of detailed documentation

2. **[Quick-Reference-Commands.md](Quick-Reference-Commands.md)**
   - Quick command reference
   - Daily operations
   - Common tasks
   - File locations
   - One-liners for frequent operations

3. **[Troubleshooting-Guide.md](Troubleshooting-Guide.md)**
   - Common issues and solutions
   - Diagnostic commands
   - Emergency recovery procedures
   - Performance optimization
   - Error message references

---

## 🚀 Quick Start

### If This Is Your First Deployment:

1. **Read:** [Complete-Deployment-Guide.md](Complete-Deployment-Guide.md)
2. **Follow:** Steps 1-8 in order
3. **Keep handy:** Quick Reference Commands
4. **If issues:** Check Troubleshooting Guide

### If You're Maintaining Existing Deployment:

1. **Use:** [Quick-Reference-Commands.md](Quick-Reference-Commands.md)
2. **For problems:** [Troubleshooting-Guide.md](Troubleshooting-Guide.md)

---

## 📖 What's Covered

### Complete Deployment Guide Includes:

- ✅ SSH access setup
- ✅ Repository cloning
- ✅ Docker container deployment
- ✅ Nginx reverse proxy configuration
- ✅ DNS configuration (Hostinger)
- ✅ SSL certificate installation (Let's Encrypt)
- ✅ Verification and testing
- ✅ Maintenance procedures
- ✅ Backup strategies
- ✅ Security recommendations

### Quick Reference Includes:

- Container management commands
- Nginx operations
- SSL certificate management
- Testing and verification
- System monitoring
- Emergency recovery

### Troubleshooting Guide Includes:

- Container issues
- Nginx problems
- SSL certificate errors
- DNS resolution issues
- Application bugs
- Performance problems
- Network issues
- Complete system reset procedures

---

## 🎯 Deployment Summary

### What Was Deployed:

**Live URLs:**
- Frontend: https://voxtext.in
- Backend API: https://api.voxtext.in
- Health Check: https://api.voxtext.in/health

**Server Details:**
- VPS IP: 72.62.229.88
- Server: srv1363720 (Hostinger)
- OS: Ubuntu 24.04 LTS
- Domain: voxtext.in

**Technology Stack:**
- Frontend: React + Vite + Nginx (Container)
- Backend: Python + Flask + Gunicorn (Container)
- Reverse Proxy: Nginx (System)
- SSL: Let's Encrypt (Free)
- Containerization: Docker + Docker Compose

**Port Mapping:**
- Frontend Container: 8080 → 80
- Backend Container: 5001 → 5000
- Nginx: 80 (HTTP), 443 (HTTPS)

---

## 📂 File Locations

### On VPS Server:

```
Project Directory:    /opt/VoxText-AI
Nginx Config:         /etc/nginx/sites-available/voxtext
Nginx Enabled:        /etc/nginx/sites-enabled/voxtext
SSL Certificates:     /etc/letsencrypt/live/voxtext.in/
Docker Compose:       /opt/VoxText-AI/docker-compose.yml
Nginx Logs:           /var/log/nginx/
Certbot Logs:         /var/log/letsencrypt/
```

### On GitHub:

```
Repository:           https://github.com/shasu1pm/VoxText-AI
Frontend Code:        /Frontend
Backend Code:         /Backend
Deployment Docs:      /Hosting Installation
```

---

## 🛠️ Common Tasks

### Check Status:
```bash
docker ps
systemctl status nginx
curl https://voxtext.in
curl https://api.voxtext.in/health
```

### View Logs:
```bash
docker compose logs -f
tail -f /var/log/nginx/error.log
```

### Restart Services:
```bash
docker compose restart
systemctl restart nginx
```

### Update Application:
```bash
cd /opt/VoxText-AI
git pull origin main
docker compose down
docker compose up -d --build
```

---

## 🆘 Getting Help

### Troubleshooting Steps:

1. **Check the Troubleshooting Guide** for your specific issue
2. **Review logs** for error messages
3. **Verify all services** are running
4. **Test DNS resolution** and connectivity
5. **Check SSL certificates** are valid

### Diagnostic Commands:

```bash
# Full system check
docker ps && systemctl status nginx && certbot certificates

# View recent errors
docker compose logs --tail=50
tail -50 /var/log/nginx/error.log

# Test connectivity
curl https://voxtext.in
curl https://api.voxtext.in/health
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Internet Users                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │   DNS Resolution    │
         │  voxtext.in         │
         │  → 72.62.229.88     │
         └──────────┬──────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Nginx Reverse Proxy │
         │  Ports: 80, 443      │
         │  + SSL Termination   │
         └─────┬──────────┬─────┘
               │          │
      ┌────────┘          └────────┐
      ▼                            ▼
┌─────────────────┐      ┌──────────────────┐
│ Frontend        │      │ Backend          │
│ Container       │◄─────┤ Container        │
│ Nginx:80        │ API  │ Gunicorn:5000    │
│ Host Port: 8080 │      │ Host Port: 5001  │
│ React + Vite    │      │ Flask + yt-dlp   │
└─────────────────┘      └──────────────────┘
         │                        │
         └────────────┬───────────┘
                      │
         Docker Network: voxtext-network
```

---

## ✅ Deployment Checklist

Use this to verify your deployment:

- [ ] SSH access working
- [ ] Repository cloned to `/opt/VoxText-AI`
- [ ] Docker containers running
- [ ] Backend health check: `{"service":"voxtext-backend","status":"healthy"}`
- [ ] Nginx installed and running
- [ ] Nginx configuration enabled
- [ ] DNS A records configured:
  - [ ] @ → 72.62.229.88
  - [ ] www → 72.62.229.88
  - [ ] api → 72.62.229.88
- [ ] SSL certificates installed
- [ ] HTTPS working on all domains
- [ ] HTTP redirects to HTTPS
- [ ] Backend API accessible
- [ ] Frontend loads in browser
- [ ] YouTube functionality tested

---

## 📅 Maintenance Schedule

### Daily:
- Monitor application performance
- Check error logs if issues reported

### Weekly:
- Review logs: `docker compose logs --tail=100`
- Check disk space: `df -h`
- Monitor container health: `docker ps`

### Monthly:
- Update system packages: `apt update && apt upgrade -y`
- Review SSL certificate expiry: `certbot certificates`
- Clean up Docker: `docker system prune`
- Test backup restoration

### Quarterly:
- Full security audit
- Performance optimization review
- Update application dependencies

---

## 🔐 Security Notes

### Implemented Security Features:

✅ HTTPS/SSL encryption (Let's Encrypt)
✅ Auto-renewal for SSL certificates
✅ Security headers (X-Frame-Options, X-XSS-Protection, etc.)
✅ CORS configuration
✅ Docker container isolation
✅ Non-root user in containers
✅ Production mode (debug disabled)

### Recommended Additional Security:

- Enable UFW firewall
- Install Fail2Ban for SSH protection
- Regular security updates
- Monitor access logs
- Use strong SSH keys
- Implement rate limiting

---

## 💰 Cost Breakdown

| Item | Cost | Status |
|------|------|--------|
| Domain (voxtext.in) | ~$10-15/year | Purchased |
| Hostinger VPS | ~$4-30/month | Active |
| Coolify | FREE | Installed |
| SSL Certificates | FREE | Auto-renewing |
| Nginx | FREE | Installed |
| Docker | FREE | Installed |
| **Total Additional** | **$0/month** | ✅ |

---

## 📞 Support Resources

### Documentation:
- This deployment guide
- [VoxText AI Repository](https://github.com/shasu1pm/VoxText-AI)
- [Coolify Documentation](https://coolify.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs)
- [Docker Documentation](https://docs.docker.com)
- [Let's Encrypt](https://letsencrypt.org)

### Community:
- GitHub Issues: https://github.com/shasu1pm/VoxText-AI/issues
- Coolify Community: https://coolify.io/discord

### Contact:
- Email: shasu1pm@gmail.com
- GitHub: @shasu1pm

---

## 🎉 Success!

If you've completed the deployment:

**Your VoxText AI application is now:**
- ✅ Live on the internet
- ✅ Secured with HTTPS
- ✅ Running in production mode
- ✅ Auto-scaling with Docker
- ✅ Monitored with health checks
- ✅ Backed up and maintainable

**Congratulations!** 🎊

---

**Document Last Updated:** February 14, 2026
**Deployment Version:** 1.0
**Maintained By:** VoxText AI Team
