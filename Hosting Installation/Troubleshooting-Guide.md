# VoxText AI - Troubleshooting Guide

**Common issues and their solutions**

---

## Container Issues

### Containers Not Starting

**Symptoms:**
- `docker ps` shows no voxtext containers
- Containers exit immediately

**Diagnosis:**
```bash
docker compose logs
docker ps -a
```

**Solutions:**
```bash
# Check if ports are in use
netstat -tulpn | grep 8080
netstat -tulpn | grep 5001

# Rebuild from scratch
docker compose down
docker compose up -d --build

# Check for errors in logs
docker compose logs --tail=100
```

---

### Container is Unhealthy

**Symptoms:**
- Container shows "unhealthy" status
- Service not responding

**Diagnosis:**
```bash
docker ps
docker inspect voxtext-frontend
docker inspect voxtext-backend
```

**Solutions:**
```bash
# Check container logs
docker logs voxtext-frontend
docker logs voxtext-backend

# Restart specific container
docker restart voxtext-frontend
docker restart voxtext-backend

# If still failing, rebuild
docker compose down
docker compose up -d --build
```

---

### Out of Memory Errors

**Symptoms:**
- Containers crash randomly
- OOM (Out of Memory) errors in logs

**Diagnosis:**
```bash
free -h
docker stats
```

**Solutions:**
```bash
# Add memory limits to docker-compose.yml
# Under each service, add:
    deploy:
      resources:
        limits:
          memory: 512M

# Restart Docker
systemctl restart docker
```

---

## Nginx Issues

### 502 Bad Gateway

**Symptoms:**
- Browser shows "502 Bad Gateway"
- Nginx can't reach backend containers

**Diagnosis:**
```bash
nginx -t
curl http://localhost:8080
curl http://localhost:5001/health
tail -50 /var/log/nginx/error.log
```

**Solutions:**
```bash
# Verify containers are running
docker ps

# Check if ports are accessible
curl http://localhost:8080
curl http://localhost:5001/health

# Restart Nginx
systemctl restart nginx

# If still failing, check Nginx config
nginx -t
nano /etc/nginx/sites-available/voxtext
```

---

### 504 Gateway Timeout

**Symptoms:**
- Request takes too long
- Nginx times out waiting for backend

**Solutions:**
```bash
# Increase timeout in Nginx config
nano /etc/nginx/sites-available/voxtext

# Add these lines in location block:
    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
    send_timeout 600;

# Test and reload
nginx -t
systemctl reload nginx
```

---

### Nginx Won't Start

**Symptoms:**
- `systemctl start nginx` fails
- Port 80 or 443 already in use

**Diagnosis:**
```bash
nginx -t
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

**Solutions:**
```bash
# Find what's using port 80
lsof -i :80

# If it's another process, stop it
systemctl stop apache2  # Example

# Or change Nginx port in config
nano /etc/nginx/sites-available/voxtext

# Test and start
nginx -t
systemctl start nginx
```

---

## SSL Certificate Issues

### Certificate Expired

**Symptoms:**
- Browser shows "Your connection is not private"
- Certificate expired warning

**Diagnosis:**
```bash
certbot certificates
```

**Solutions:**
```bash
# Renew certificate
certbot renew

# Force renewal if needed
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx
```

---

### Certbot Renewal Fails

**Symptoms:**
- `certbot renew` fails
- Email notification about renewal failure

**Diagnosis:**
```bash
certbot renew --dry-run
tail -50 /var/log/letsencrypt/letsencrypt.log
```

**Solutions:**
```bash
# Ensure Nginx is running
systemctl status nginx

# Ensure ports 80 and 443 are accessible
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Try manual renewal
certbot renew -v

# If challenge fails, check Nginx config
nginx -t
cat /etc/nginx/sites-available/voxtext

# Worst case: Delete and recreate certificate
certbot delete --cert-name voxtext.in
certbot --nginx -d voxtext.in -d www.voxtext.in -d api.voxtext.in --non-interactive --agree-tos --email your-email@example.com --redirect
```

---

## DNS Issues

### Domain Not Resolving

**Symptoms:**
- "DNS_PROBE_FINISHED_NXDOMAIN" error
- Domain doesn't load

**Diagnosis:**
```bash
dig voxtext.in +short
nslookup voxtext.in
nslookup voxtext.in 8.8.8.8
```

**Solutions:**
1. **Check DNS records in Hostinger:**
   - Verify A records exist
   - Verify they point to correct IP (72.62.229.88)

2. **Wait for propagation:**
   - Can take up to 1 hour
   - Check propagation: https://dnschecker.org

3. **Clear DNS cache (on your computer):**
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac
   sudo dscacheutil -flushcache

   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

### Wrong IP Resolution

**Symptoms:**
- Domain resolves to wrong IP
- Site shows different content

**Diagnosis:**
```bash
dig voxtext.in +short
# Should show: 72.62.229.88
```

**Solutions:**
1. Update DNS records in Hostinger
2. Wait 30-60 minutes for propagation
3. Verify with: `dig voxtext.in @8.8.8.8`

---

## Application Issues

### Frontend Shows Blank Page

**Symptoms:**
- Browser shows empty white page
- No errors in browser console

**Diagnosis:**
```bash
# Check if frontend is serving files
curl -I http://localhost:8080

# Check browser console (F12)
# Look for API connection errors
```

**Solutions:**
```bash
# Check backend is accessible
curl http://localhost:5001/health

# Verify environment variables
docker exec voxtext-frontend env | grep VITE

# Check frontend logs
docker logs voxtext-frontend

# Rebuild frontend
cd /opt/VoxText-AI
docker compose down
docker compose up -d --build
```

---

### API Requests Failing (CORS Errors)

**Symptoms:**
- Browser console shows CORS errors
- API calls blocked

**Diagnosis:**
- Open browser console (F12)
- Look for "Access-Control-Allow-Origin" errors

**Solutions:**

1. **Check backend CORS configuration:**
   ```bash
   # Edit backend server.py
   nano /opt/VoxText-AI/Backend/server.py

   # Verify CORS is configured:
   from flask_cors import CORS
   CORS(app, origins=["https://voxtext.in", "https://www.voxtext.in"])
   ```

2. **Rebuild backend:**
   ```bash
   docker compose down
   docker compose up -d --build
   ```

---

### YouTube Processing Not Working

**Symptoms:**
- Video processing fails
- Download errors

**Diagnosis:**
```bash
# Check backend logs
docker logs voxtext-backend

# Test yt-dlp directly
docker exec -it voxtext-backend bash
yt-dlp --version
yt-dlp "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
exit
```

**Solutions:**
```bash
# Update yt-dlp in container
docker exec -it voxtext-backend pip install --upgrade yt-dlp

# Or rebuild backend
cd /opt/VoxText-AI
docker compose down
docker compose up -d --build backend
```

---

## Performance Issues

### Slow Response Times

**Symptoms:**
- Site loads slowly
- High latency

**Diagnosis:**
```bash
# Check server resources
top
free -h
df -h

# Check container resources
docker stats

# Test response time
curl -w "@-" -o /dev/null -s https://voxtext.in <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_starttransfer:  %{time_starttransfer}\n
         time_total:  %{time_total}\n
EOF
```

**Solutions:**

1. **Increase Gunicorn workers:**
   ```bash
   nano /opt/VoxText-AI/Backend/Dockerfile

   # Change CMD line:
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "8", "--timeout", "120", "server:app"]

   # Rebuild
   docker compose up -d --build backend
   ```

2. **Enable Nginx caching:**
   ```bash
   nano /etc/nginx/sites-available/voxtext

   # Add cache settings
   ```

3. **Clean up disk space:**
   ```bash
   docker system prune -a
   apt autoclean
   ```

---

### High Memory Usage

**Symptoms:**
- Server running out of memory
- Containers being killed

**Diagnosis:**
```bash
free -h
docker stats
top
```

**Solutions:**

1. **Add memory limits:**
   ```bash
   nano /opt/VoxText-AI/docker-compose.yml

   # Add under each service:
   deploy:
     resources:
       limits:
         memory: 1G
       reservations:
         memory: 512M

   # Restart
   docker compose down
   docker compose up -d
   ```

2. **Reduce Gunicorn workers:**
   ```bash
   # Edit Backend Dockerfile
   nano /opt/VoxText-AI/Backend/Dockerfile

   # Reduce workers from 4 to 2
   CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", ...]
   ```

---

## Port Conflicts

### Port Already in Use

**Symptoms:**
- "bind: address already in use" errors
- Containers fail to start

**Diagnosis:**
```bash
netstat -tulpn | grep :8080
netstat -tulpn | grep :5001
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

**Solutions:**

1. **Find and stop conflicting process:**
   ```bash
   # Find process using port
   lsof -i :8080

   # Kill process
   kill -9 [PID]
   ```

2. **Change port in docker-compose.yml:**
   ```bash
   nano /opt/VoxText-AI/docker-compose.yml

   # Change ports:
   # "8080:80" → "8081:80"
   # "5001:5000" → "5002:5000"

   # Update Nginx config to match
   nano /etc/nginx/sites-available/voxtext

   # Restart
   docker compose down
   docker compose up -d
   systemctl reload nginx
   ```

---

## Git Issues

### Cannot Pull Updates

**Symptoms:**
- `git pull` fails
- Merge conflicts

**Solutions:**

1. **Stash local changes:**
   ```bash
   cd /opt/VoxText-AI
   git stash
   git pull origin main
   git stash pop
   ```

2. **Force pull (loses local changes):**
   ```bash
   cd /opt/VoxText-AI
   git fetch origin
   git reset --hard origin/main
   ```

3. **Check git status:**
   ```bash
   git status
   git log --oneline -5
   ```

---

## Network Issues

### Cannot Connect to External Services

**Symptoms:**
- Containers can't reach internet
- DNS resolution fails inside containers

**Diagnosis:**
```bash
# Test from host
ping 8.8.8.8
curl google.com

# Test from container
docker exec -it voxtext-backend ping 8.8.8.8
docker exec -it voxtext-backend curl google.com
```

**Solutions:**

1. **Check Docker network:**
   ```bash
   docker network ls
   docker network inspect voxtext-ai_voxtext-network
   ```

2. **Restart Docker:**
   ```bash
   systemctl restart docker
   docker compose up -d
   ```

3. **Check firewall:**
   ```bash
   ufw status
   # Ensure UFW allows outbound traffic
   ```

---

## Emergency Recovery

### Complete System Reset

**When everything is broken:**

```bash
# 1. Stop all services
docker compose down
systemctl stop nginx

# 2. Backup current state
mkdir -p /root/emergency-backup-$(date +%Y%m%d)
cp -r /opt/VoxText-AI /root/emergency-backup-$(date +%Y%m%d)/
cp /etc/nginx/sites-available/voxtext /root/emergency-backup-$(date +%Y%m%d)/

# 3. Clean up
docker system prune -af
rm -rf /opt/VoxText-AI

# 4. Fresh start
cd /opt
git clone https://github.com/shasu1pm/VoxText-AI.git
cd VoxText-AI

# 5. Update ports if needed
sed -i 's/"80:80"/"8080:80"/' docker-compose.yml
sed -i 's/"5000:5000"/"5001:5000"/' docker-compose.yml

# 6. Deploy
docker compose up -d --build

# 7. Recreate Nginx config
nano /etc/nginx/sites-available/voxtext
# (paste correct configuration)

# 8. Test and start
nginx -t
systemctl start nginx

# 9. Verify
docker ps
systemctl status nginx
curl https://voxtext.in
curl https://api.voxtext.in/health
```

---

## Getting Help

### Collect Diagnostic Information

**Before asking for help, collect:**

```bash
# System info
uname -a
lsb_release -a

# Docker info
docker --version
docker ps
docker compose logs --tail=50

# Nginx info
nginx -v
nginx -t
systemctl status nginx
tail -50 /var/log/nginx/error.log

# SSL info
certbot certificates

# Network info
ip addr
netstat -tulpn
```

### Support Resources

- **GitHub Issues:** https://github.com/shasu1pm/VoxText-AI/issues
- **Coolify Community:** https://coolify.io/docs
- **Nginx Documentation:** https://nginx.org/en/docs
- **Docker Documentation:** https://docs.docker.com

---

## Prevention Tips

1. **Regular backups:**
   ```bash
   # Run weekly
   /root/backup-voxtext.sh
   ```

2. **Monitor disk space:**
   ```bash
   # Check weekly
   df -h
   docker system df
   ```

3. **Keep systems updated:**
   ```bash
   # Run monthly
   apt update && apt upgrade -y
   docker compose pull
   docker compose up -d --build
   ```

4. **Monitor SSL expiry:**
   ```bash
   # Check monthly
   certbot certificates
   ```

5. **Review logs regularly:**
   ```bash
   # Check weekly
   docker compose logs --tail=100
   tail -100 /var/log/nginx/error.log
   ```
