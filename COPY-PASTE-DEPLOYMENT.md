# 📋 COPY-PASTE DEPLOYMENT GUIDE
## Just copy these values into Coolify - No thinking required!

---

## 🎯 FRONTEND DEPLOYMENT

### In Coolify - Create New Application

**Copy-paste these exact values:**

```
Application Name: voxtext-frontend

Repository URL: https://github.com/shasu1pm/VoxText-AI

Branch: main

Build Pack: Dockerfile

Dockerfile Location: Frontend/Dockerfile

Base Directory: Frontend

Port: 80

Domain: voxtext.in

Environment Variable:
  Key: VITE_API_URL
  Value: https://api.voxtext.in

SSL: Enable/Generate Certificate
```

**Then click: DEPLOY**

---

## 🎯 BACKEND DEPLOYMENT

### In Coolify - Create New Application

**Copy-paste these exact values:**

```
Application Name: voxtext-backend

Repository URL: https://github.com/shasu1pm/VoxText-AI

Branch: main

Build Pack: Dockerfile

Dockerfile Location: Backend/Dockerfile

Base Directory: Backend

Port: 5000

Domain: api.voxtext.in

Environment Variables:
  Key: FLASK_ENV
  Value: production

  Key: PYTHONUNBUFFERED
  Value: 1

SSL: Enable/Generate Certificate
```

**Then click: DEPLOY**

---

## 🌐 DNS CONFIGURATION (Hostinger)

### Get Your VPS IP First
Look in Coolify or Hostinger VPS panel for your server IP

### Add These DNS Records

**Replace YOUR_VPS_IP with actual IP address**

```
Type: A
Name: @
Value: YOUR_VPS_IP
TTL: 3600

Type: A
Name: www
Value: YOUR_VPS_IP
TTL: 3600

Type: A
Name: api
Value: YOUR_VPS_IP
TTL: 3600
```

---

## ✅ VERIFICATION

After deployment completes (10-15 min) and DNS propagates (5-30 min):

**Test Backend:**
```
https://api.voxtext.in/health
```
Should show: {"status": "healthy", "service": "voxtext-backend"}

**Test Frontend:**
```
https://voxtext.in
```
Should load your VoxText AI application!

---

**That's it! Just copy-paste and click deploy!**
