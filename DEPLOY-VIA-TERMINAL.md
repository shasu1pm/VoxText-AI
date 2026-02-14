# Deploy VoxText AI via Terminal (SSH)

## Prerequisites

You need:
1. SSH access to your Hostinger VPS
2. VPS IP address
3. SSH username (usually 'root' or your username)
4. SSH password or key

---

## Method 1: Using Coolify CLI

### Step 1: Connect to your VPS

```bash
ssh root@YOUR_VPS_IP
```
(Replace YOUR_VPS_IP with actual IP)

### Step 2: Check if Coolify CLI is installed

```bash
coolify --version
```

or

```bash
coolify-cli --version
```

### Step 3: Deploy using Coolify CLI

If Coolify CLI exists, you can deploy with:

```bash
# Deploy Backend
coolify deploy \
  --name voxtext-backend \
  --repository https://github.com/shasu1pm/VoxText-AI \
  --branch main \
  --dockerfile Backend/Dockerfile \
  --context Backend \
  --port 5000 \
  --domain api.voxtext.in

# Deploy Frontend
coolify deploy \
  --name voxtext-frontend \
  --repository https://github.com/shasu1pm/VoxText-AI \
  --branch main \
  --dockerfile Frontend/Dockerfile \
  --context Frontend \
  --port 80 \
  --domain voxtext.in
```

---

## Method 2: Direct Docker Deployment (More Control)

### Step 1: SSH into your VPS

```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Clone the repository

```bash
cd /opt
git clone https://github.com/shasu1pm/VoxText-AI.git
cd VoxText-AI
```

### Step 3: Deploy with Docker Compose

```bash
# Make sure Docker and Docker Compose are installed
docker --version
docker-compose --version

# Deploy both frontend and backend
docker-compose up -d --build
```

This will:
- Build both Frontend and Backend
- Start containers in detached mode
- Frontend available on port 80
- Backend available on port 5000

### Step 4: Configure Nginx/Traefik for domains (if not using Coolify proxy)

If you're bypassing Coolify, you'll need to set up reverse proxy manually:

```bash
# Install Nginx (if not already installed)
apt update
apt install nginx -y

# Create Nginx config for frontend
cat > /etc/nginx/sites-available/voxtext <<'EOF'
server {
    listen 80;
    server_name voxtext.in www.voxtext.in;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.voxtext.in;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/voxtext /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Install SSL certificates
apt install certbot python3-certbot-nginx -y
certbot --nginx -d voxtext.in -d www.voxtext.in -d api.voxtext.in
```

---

## Method 3: Using Coolify API

### Step 1: Get Coolify API Token

1. SSH into VPS
2. Access Coolify database or config to get API token
3. Or generate from Coolify web interface: Settings → API Tokens

### Step 2: Use API to deploy

```bash
# Set variables
COOLIFY_URL="http://YOUR_VPS_IP:3000"  # or your Coolify URL
API_TOKEN="your-api-token-here"

# Create backend application
curl -X POST "${COOLIFY_URL}/api/v1/applications" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "voxtext-backend",
    "repository": "https://github.com/shasu1pm/VoxText-AI",
    "branch": "main",
    "dockerfile": "Backend/Dockerfile",
    "buildContext": "Backend",
    "port": 5000,
    "domain": "api.voxtext.in"
  }'

# Create frontend application
curl -X POST "${COOLIFY_URL}/api/v1/applications" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "voxtext-frontend",
    "repository": "https://github.com/shasu1pm/VoxText-AI",
    "branch": "main",
    "dockerfile": "Frontend/Dockerfile",
    "buildContext": "Frontend",
    "port": 80,
    "domain": "voxtext.in",
    "env": {
      "VITE_API_URL": "https://api.voxtext.in"
    }
  }'
```

---

## Verification Commands

### Check running containers
```bash
docker ps
```

### Check logs
```bash
# Backend logs
docker logs voxtext-backend

# Frontend logs
docker logs voxtext-frontend
```

### Test backend health
```bash
curl http://localhost:5000/health
```

### Test frontend
```bash
curl http://localhost:80
```

---

## DNS Configuration (Still Required)

Even with terminal deployment, you still need to configure DNS in Hostinger:

Add these A records pointing to your VPS IP:
- @ → YOUR_VPS_IP
- www → YOUR_VPS_IP
- api → YOUR_VPS_IP

---

## Which Method Should You Use?

**Use Method 1 (Coolify CLI)** if:
- You want Coolify to manage everything
- You want automatic SSL
- You want the Coolify dashboard features

**Use Method 2 (Docker Compose)** if:
- You want simple, direct deployment
- You're comfortable with Docker
- You want more control

**Use Method 3 (Coolify API)** if:
- You want to automate deployments
- You're building CI/CD pipelines
- You prefer programmatic control

---

## Need Help?

Tell me which method you want to try, and I'll guide you through it step-by-step!
