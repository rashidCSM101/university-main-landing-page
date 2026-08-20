# 🌐 WenClims Full-Stack Deployment Roadmap
### Part 1: Deployment Order & Architecture
### Part 2: 100% Free Testing Stack (Supabase + Render + Vercel/GitHub Pages)
### Part 3: Production Stack on Hostinger VPS (Single Server All-in-One)

---

## 🧭 Part 1: Deployment Order & Architecture

### Question: *Do we need to deploy the server first, and after that deploy admin? Are they deployed separately?*

**YES! The backend server MUST always be deployed first.**

Here is why:
```
┌─────────────────────────────────────────────────────────────┐
│ 1. DATABASE (PostgreSQL)                                    │
│    Stores users, team members, tools, projects, audit logs. │
└──────────────────────────────┬──────────────────────────────┘
                               │ (DB Connection URI)
┌──────────────────────────────▼──────────────────────────────┐
│ 2. BACKEND SERVER (server/)                                 │
│    Node.js Express REST API running on Port 5000.           │
│    Produces live API URL: https://api.yourdomain.com/api/v1 │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼ (API Requests)               ▼ (API & Auth)
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ 3. PUBLIC CLIENT (client/)   │ │ 4. ADMIN DASHBOARD (admin/)  │
│    React Vite static build.  │ │    React Vite static build.  │
│    Displays landing page.    │ │    Requires server for login │
│    https://yourdomain.com    │ │    https://admin.yourdomain  │
└──────────────────────────────┘ └──────────────────────────────┘
```

1. **The Database & Backend Server (`server/`)** must be running first so that your API endpoint (e.g., `https://api.yourdomain.com/api/v1` or `https://render-server.onrender.com/api/v1`) is live.
2. **The Admin Panel (`admin/`)** requires the live backend URL at build time (`VITE_API_BASE_URL`) to allow administrators to log in, authenticate with JWT, and manage data.
3. **The Public Client (`client/`)** uses the live API URL to dynamically fetch published projects, tools, research scientists, and emergency banner alerts.

---

## 🆓 Part 2: 100% Free Testing Deployment (Zero Cost)

You can test the entire full-stack application online for free using this combination:

| Component | Free Platform | URL Example |
| :--- | :--- | :--- |
| **Database** | **Supabase** or **Neon.tech** (PostgreSQL) | `postgres://...@aws-0-eu-central-1.pooler.supabase.com:6543/postgres` |
| **Backend API** | **Render.com** (Web Service) | `https://wenclims-api.onrender.com` |
| **Admin Panel** | **Vercel** or **Netlify** | `https://wenclims-admin.vercel.app` |
| **Public Site** | **GitHub Pages** (or Vercel) | `https://hex-byte.tech` |

---

### Step 2.1: Create Free PostgreSQL Database on Supabase

1. Go to **[supabase.com](https://supabase.com)** and sign up for free.
2. Click **"New Project"**, name it `wenclims-db`, choose a strong password, and select a nearby region (e.g., Frankfurt / Singapore).
3. Once created, go to **Project Settings → Database → Connection String** and copy the `URI` (Node.js mode).
4. Run your migration/seed script or open the Supabase **SQL Editor** and paste the SQL tables from your project's `server/src/database/schema.sql` (or `schema.ts`).

---

### Step 2.2: Deploy Backend Server to Render.com (Free)

1. Go to **[render.com](https://render.com)** and sign up with GitHub.
2. Click **New + → Web Service**.
3. Connect your repository: `university-main-landing-page`.
4. Configure the Web Service:
   - **Name**: `wenclims-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start` (or `node dist/index.js`)
   - **Instance Type**: `Free`
5. Add **Environment Variables** in the Render dashboard:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = *(Your Supabase connection string from Step 2.1)*
   - `JWT_SECRET` = *(Any random 32-character string)*
   - `CORS_ORIGIN` = `https://hex-byte.tech,https://wenclims-admin.vercel.app,http://localhost:5173,http://localhost:5174`
6. Click **"Deploy Web Service"**.
7. Once deployed, copy your live API URL:
   `https://wenclims-api.onrender.com` (Test in browser: `https://wenclims-api.onrender.com/api/v1/health` should return `{"status":"healthy"}`).

---

### Step 2.3: Deploy Admin Dashboard to Vercel (Free)

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **"Add New Project"** and select `university-main-landing-page`.
3. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`admin`**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://wenclims-api.onrender.com/api/v1`
5. Click **"Deploy"**.
6. You now have a working Admin Dashboard at `https://your-admin-project.vercel.app` where you can log in and manage the database!

---

### Step 2.4: Connect Public Frontend (`client/`)

Your public client is already deployed on GitHub Pages (`https://hex-byte.tech`).
To connect it to your new live backend:
1. In `client/`, create or update `.env.production`:
   ```env
   VITE_API_BASE_URL=https://wenclims-api.onrender.com/api/v1
   ```
2. Re-deploy with one command:
   ```bash
   cd client
   npm run deploy
   ```

---

## 🏢 Part 3: Production Deployment on Hostinger VPS (Single Server)

When you are ready for commercial production on Hostinger, you can host **all 3 components (Database + Server + Client + Admin) on a single Hostinger VPS** for the highest speed and lowest cost.

### Recommended Hostinger Plan:
- **KVM VPS 2** (2 vCPU, 8 GB RAM, Ubuntu 22.04 or 24.04 64-bit).

---

### Step 3.1: Server Architecture on Hostinger VPS

```
Hostinger VPS (Single Ubuntu Server IP: 123.45.67.89)
│
├── PostgreSQL (localhost:5432)
│
├── PM2 Process Manager
│   └── Node.js Express Server (localhost:5000)
│
└── Nginx Web Server (Port 80 / 443 with SSL)
    ├── /var/www/wenclims/client/dist  ──► Serves https://hex-byte.tech
    ├── /var/www/wenclims/admin/dist   ──► Serves https://admin.hex-byte.tech
    └── /api/v1 Proxy                  ──► Proxies to http://localhost:5000
```

---

### Step 3.2: Hostinger Initial Server Setup (One-Time)

Connect to your VPS via SSH from PowerShell or terminal:
```bash
ssh root@YOUR_VPS_IP
```

Run standard system updates and install Node.js 20 & PostgreSQL:
```bash
# 1. Update system packages
apt update && apt upgrade -y

# 2. Install Node.js 20 LTS & Git
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx postgresql postgresql-contrib

# 3. Install PM2 process manager globally
npm install -g pm2
```

---

### Step 3.3: Set Up PostgreSQL on the VPS

```bash
# Switch to postgres user
sudo -u postgres psql

# Run SQL commands:
CREATE DATABASE wenclims_db;
CREATE USER wenclims_user WITH ENCRYPTED PASSWORD 'YourStrongDBPassword123!';
GRANT ALL PRIVILEGES ON DATABASE wenclims_db TO wenclims_user;
GRANT ALL ON SCHEMA public TO wenclims_user;
\q
```

---

### Step 3.4: Clone & Build the Application on VPS

```bash
# Create web directory and clone repository
mkdir -p /var/www
cd /var/www
git clone https://github.com/rashidCSM101/university-main-landing-page.git wenclims
cd wenclims

# 1. Build and Start Backend Server
cd /var/www/wenclims/server
npm install
npm run build

# Create server .env
cat << 'EOF' > .env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://wenclims_user:YourStrongDBPassword123!@localhost:5432/wenclims_db
JWT_SECRET=super_secret_production_jwt_key_998822
CORS_ORIGIN=https://hex-byte.tech,https://admin.hex-byte.tech
EOF

# Start Server with PM2
pm2 start dist/index.js --name "wenclims-server"
pm2 startup
pm2 save

# 2. Build Admin Dashboard
cd /var/www/wenclims/admin
cat << 'EOF' > .env.production
VITE_API_BASE_URL=https://hex-byte.tech/api/v1
EOF
npm install
npm run build

# 3. Build Public Client Frontend
cd /var/www/wenclims/client
cat << 'EOF' > .env.production
VITE_API_BASE_URL=https://hex-byte.tech/api/v1
EOF
npm install
npm run build
```

---

### Step 3.5: Configure Nginx (Reverse Proxy & Static Files)

Create Nginx site configuration:
```bash
nano /etc/nginx/sites-available/wenclims
```

Paste the following Nginx block:
```nginx
# 1. Main Public Website & API Reverse Proxy
server {
    listen 80;
    server_name hex-byte.tech www.hex-byte.tech;

    # Public Client React SPA
    root /var/www/wenclims/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy /api requests to Express Server
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 2. Admin Dashboard Subdomain
server {
    listen 80;
    server_name admin.hex-byte.tech;

    root /var/www/wenclims/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site and test Nginx:
```bash
ln -s /etc/nginx/sites-available/wenclims /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### Step 3.6: Install Free SSL Certificates (HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d hex-byte.tech -d www.hex-byte.tech -d admin.hex-byte.tech
```

Certbot will automatically install SSL and configure auto-renewals!

---

## ⚡ Summary Checklist

| Task | Free Testing Stack | Hostinger VPS Production |
| :--- | :--- | :--- |
| **1. Database** | Supabase (Cloud Free) | Local PostgreSQL on VPS |
| **2. Backend Server** | Render.com (Deploy 1st) | Node.js + PM2 on VPS (Deploy 1st) |
| **3. Admin Panel** | Vercel (`admin/`) | Nginx serving `admin/dist` |
| **4. Client Frontend** | GitHub Pages (`hex-byte.tech`) | Nginx serving `client/dist` |
| **5. SSL Certificate** | Automated (by Cloud providers) | Certbot Let's Encrypt (Free) |
