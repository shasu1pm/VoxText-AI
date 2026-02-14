# VoxText AI - Quick Reference Commands

**Quick command reference for daily operations and troubleshooting**

---

## Container Management

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# Start containers
docker compose up -d

# Stop containers
docker compose down

# Restart containers
docker compose restart

# Rebuild containers
docker compose up -d --build

# View logs (all)
docker compose logs

# View logs (follow)
docker compose logs -f

# View logs (specific service)
docker compose logs backend
docker compose logs frontend

# Execute command in container
docker exec -it voxtext-backend bash
docker exec -it voxtext-frontend sh

# Check container resource usage
docker stats
```

---

## Nginx Management

```bash
# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Restart Nginx
systemctl restart nginx

# Start Nginx
systemctl start nginx

# Stop Nginx
systemctl stop nginx

# Check status
systemctl status nginx

# View error logs
tail -f /var/log/nginx/error.log

# View access logs
tail -f /var/log/nginx/access.log

# Edit configuration
nano /etc/nginx/sites-available/voxtext
```

---

## SSL Certificate Management

```bash
# List certificates
certbot certificates

# Renew certificates
certbot renew

# Test renewal (dry run)
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal

# View certificate details
openssl x509 -in /etc/letsencrypt/live/voxtext.in/fullchain.pem -text -noout
```

---

## Testing and Verification

```bash
# Test frontend locally
curl -I http://localhost:8080

# Test backend locally
curl http://localhost:5001/health

# Test frontend via domain
curl -I https://voxtext.in

# Test backend via domain
curl https://api.voxtext.in/health

# Test SSL certificate
curl -vI https://voxtext.in 2>&1 | grep -i "SSL"

# Check DNS resolution
dig voxtext.in +short
dig api.voxtext.in +short

# Check from external DNS
nslookup voxtext.in 8.8.8.8
```

---

## System Monitoring

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU and processes
top
htop  # Better interface

# Check Docker disk usage
docker system df

# Check port usage
netstat -tulpn | grep :80
netstat -tulpn | grep :443
netstat -tulpn | grep :8080
netstat -tulpn | grep :5001

# Check system logs
journalctl -u nginx
journalctl -u docker
```

---

## Update and Maintenance

```bash
# Update application from GitHub
cd /opt/VoxText-AI
git pull origin main
docker compose down
docker compose up -d --build

# Update system packages
apt update
apt upgrade -y

# Clean up Docker
docker system prune -a  # Warning: removes unused images

# Backup configuration
cp /etc/nginx/sites-available/voxtext /root/backups/voxtext-nginx-$(date +%Y%m%d).conf
```

---

## Emergency Recovery

```bash
# Full restart
docker compose down
docker compose up -d --build
systemctl restart nginx

# Check all services
docker ps
systemctl status nginx
curl https://voxtext.in
curl https://api.voxtext.in/health

# View recent errors
docker compose logs --tail=50
tail -50 /var/log/nginx/error.log
```

---

## File Locations

```
Project Directory: /opt/VoxText-AI
Nginx Config: /etc/nginx/sites-available/voxtext
Nginx Enabled: /etc/nginx/sites-enabled/voxtext
SSL Certificates: /etc/letsencrypt/live/voxtext.in/
Nginx Logs: /var/log/nginx/
Certbot Logs: /var/log/letsencrypt/
```

---

## Important URLs

```
Frontend: https://voxtext.in
Backend API: https://api.voxtext.in
Health Check: https://api.voxtext.in/health
Coolify Dashboard: http://72.62.229.88:8000
```

---

## Common One-Liners

```bash
# Full status check
docker ps && systemctl status nginx && certbot certificates

# Restart everything
docker compose restart && systemctl restart nginx

# View all logs
docker compose logs -f & tail -f /var/log/nginx/error.log

# Check if site is up
curl -Is https://voxtext.in | head -1

# Find what's using a port
lsof -i :80
netstat -tulpn | grep :80

# Quick backup
tar -czf /root/voxtext-backup-$(date +%Y%m%d).tar.gz /opt/VoxText-AI /etc/nginx/sites-available/voxtext
```
