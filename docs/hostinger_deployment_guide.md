# 🚀 WenClims — Complete Hostinger Deployment Guide
### For First-Time Deployers — Step-by-Step, Nothing Skipped
### Date: 2026-08-05

---

> This guide assumes you have:
> - A Hostinger account with a VPS plan (recommended: VPS 2 or above — at least 2GB RAM)
> - Your domain: `wenclims.org`
> - Your admin subdomain: `admin.wenclims.org`
> - Your Git repository on GitHub/GitLab

---

## Understanding What You're Deploying

Before you start, understand the 3 separate apps you're running:

```
wenclims.org              → client/ (React build = static files, served by Nginx)
admin.wenclims.org        → admin/ (React build = static files, served by Nginx)
api.wenclims.org (or /api) → server/ (Node.js Express app, runs 24/7 on port 5000)
PostgreSQL DB              → Runs on same server (port 5432, NOT exposed to internet)
```

**The key insight:** React apps (client + admin) are just HTML/CSS/JS files after building.
The Express server is the only thing that actually runs continuously as a process.

---

## Phase 1: Prepare Your Code Before Pushing to GitHub

**Do these steps on your LOCAL machine (Windows) before touching the server.**

---

### Step 1.1: Fix the Critical Issue — Admin API URL

Your admin panel has `localhost:5000` hardcoded. Fix this BEFORE deploying.

**File to edit:** `admin/src/services/api.ts` — Line 1:
```typescript
// CHANGE THIS:
const API_BASE_URL = 'http://localhost:5000/api/v1';

// TO THIS:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
```

Then create `admin/.env.production` (add to `.gitignore`!):
```
VITE_API_BASE_URL=https://wenclims.org/api/v1
```

---

### Step 1.2: Check What Files Must NOT Go on GitHub

**Files you must NEVER commit to GitHub (verify your `.gitignore`):**

| File/Folder | Why |
|-------------|-----|
| `server/.env` | Contains real passwords and JWT secrets |
| `client/.env*` | May contain API keys |
| `admin/.env*` | May contain environment-specific URLs |
| `node_modules/` (any) | Huge, installable from package.json |
| `dist/` (any) | Build output, regenerated on server |
| `*.log` | Log files |

**Verify `.env` was never accidentally committed:**
```bash
# Run this in PowerShell in your project folder:
git log --all --full-history -- server/.env
git log --all --full-history -- "server/.env"
```
If ANY output appears, your secrets were committed and leaked. You must:
1. Change ALL secrets (generate new ones)
2. Optionally: use `git-filter-repo` to rewrite history (complex — ask for help)

**Your current root `.gitignore` correctly has `.env` — BUT** also add:
```
# Add these to root .gitignore:
admin/.env.production
client/.env.production
server/.env.production
```

---

### Step 1.3: Generate Strong Secrets for Production

Run these commands in PowerShell or use an online tool for production secrets:

```powershell
# For JWT secrets (on Linux/Mac use: openssl rand -base64 64)
# On Windows PowerShell:
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

Generate 3 different random strings for:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`  
- `COOKIE_SECRET`

Also generate a strong DB password (20+ random characters).

---

### Step 1.4: Build Test Locally (Optional but Recommended)

```powershell
# Test that client builds without errors:
cd client
npm run build
# Look for any build errors

# Test that admin builds:
cd ..\admin
npm run build
# Look for any build errors

# Test server TypeScript compiles:
cd ..\server
npm run build
# Look for any TypeScript errors
```

---

## Phase 2: Set Up Your Hostinger VPS Server

---

### Step 2.1: Log Into Your VPS via SSH

Hostinger gives you an IP address and root password when you create a VPS.

```powershell
# On Windows, open PowerShell and run:
ssh root@YOUR_SERVER_IP
# Enter the password Hostinger gave you

# Example:
ssh root@195.123.45.67
```

If you haven't used SSH before, also download **PuTTY** (Windows SSH client) as an alternative.

---

### Step 2.2: Initial Server Setup (Do This First Time Only)

```bash
# Update the server
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git unzip

# Create a non-root user (more secure than using root)
adduser wenclims
usermod -aG sudo wenclims

# Switch to that user
su - wenclims
```

---

### Step 2.3: Install Node.js (v20 LTS)

```bash
# Install Node.js 20 LTS using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation:
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

---

### Step 2.4: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL to run on boot
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check it's running:
sudo systemctl status postgresql
```

---

### Step 2.5: Set Up PostgreSQL Database

```bash
# Switch to postgres user
sudo -i -u postgres

# Open PostgreSQL prompt
psql

# Inside psql — run these commands one by one:
CREATE USER wenclims_user WITH PASSWORD 'YOUR_STRONG_RANDOM_PASSWORD_HERE';
CREATE DATABASE wenclims_db OWNER wenclims_user;
GRANT ALL PRIVILEGES ON DATABASE wenclims_db TO wenclims_user;

# Exit psql:
\q

# Exit postgres user:
exit
```

---

### Step 2.6: Run the Database Schema

```bash
# Switch back to your wenclims user
su - wenclims

# Run the schema SQL to create all tables
psql -U wenclims_user -d wenclims_db -f /path/to/schema.sql
# We'll get the schema file from your repo in the next steps
```

---

### Step 2.7: Install Nginx (Web Server)

```bash
sudo apt install -y nginx

# Start and enable Nginx:
sudo systemctl start nginx
sudo systemctl enable nginx

# Check it's running:
sudo systemctl status nginx
```

---

### Step 2.8: Install PM2 (Node.js Process Manager)

PM2 keeps your Node.js server running 24/7 and restarts it if it crashes.

```bash
sudo npm install -g pm2

# Verify:
pm2 --version
```

---

## Phase 3: Deploy Your Code

---

### Step 3.1: Clone Your Repository on the Server

```bash
# Go to home directory
cd ~

# Clone your GitHub repo (use your actual repo URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git wenclims
cd wenclims
```

---

### Step 3.2: Create the Production `.env` File on Server

**IMPORTANT: Do NOT copy your local `.env` file. Create a new one on the server with strong secrets.**

```bash
cd ~/wenclims/server
nano .env
```

In nano, type your production environment (use the secrets you generated in Step 1.3):

```
PORT=5000
NODE_ENV=production

# Database (use the password from Step 2.5)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wenclims_db
DB_USER=wenclims_user
DB_PASSWORD=YOUR_STRONG_RANDOM_DB_PASSWORD

# JWT Secrets (use the random strings from Step 1.3)
JWT_SECRET=YOUR_64_CHAR_RANDOM_STRING_HERE
JWT_REFRESH_SECRET=YOUR_DIFFERENT_64_CHAR_RANDOM_STRING_HERE
COOKIE_SECRET=YOUR_COOKIE_RANDOM_STRING_HERE
```

Save in nano: Press `Ctrl+O` then `Enter` then `Ctrl+X`

```bash
# Restrict permissions on .env file:
chmod 600 .env
```

---

### Step 3.3: Install Dependencies on Server

```bash
# From the root of your project
cd ~/wenclims

# Install server dependencies
cd server
npm install --production
# Note: --production skips dev dependencies (faster, smaller)

# Install client dependencies
cd ../client
npm install

# Install admin dependencies
cd ../admin
npm install
```

---

### Step 3.4: Run the Database Schema

```bash
cd ~/wenclims/server
psql -U wenclims_user -d wenclims_db -f src/db/schema.sql
# Enter your DB password when prompted
```

---

### Step 3.5: Build the Frontend Apps

```bash
# Build the public client
cd ~/wenclims/client
npm run build
# This creates client/dist/ folder with all the static files

# Build the admin panel
cd ../admin
npm run build
# This creates admin/dist/ folder
```

---

### Step 3.6: Build and Start the Server with PM2

```bash
# Build TypeScript to JavaScript
cd ~/wenclims/server
npm run build
# This creates server/dist/ folder

# Start with PM2
pm2 start dist/index.js --name "wenclims-api"

# Make PM2 start on server reboot
pm2 startup
# Run the command that PM2 shows you
pm2 save

# Check it's running:
pm2 status
pm2 logs wenclims-api
```

---

## Phase 4: Configure Nginx

Nginx acts as a "reverse proxy" — it receives incoming requests and forwards them to the right place.

---

### Step 4.1: Create Nginx Config for Public Website

```bash
sudo nano /etc/nginx/sites-available/wenclims
```

Paste this configuration:

```nginx
# Main website: wenclims.org
server {
    listen 80;
    server_name wenclims.org www.wenclims.org;
    
    # Where the React build files are
    root /home/wenclims/wenclims/client/dist;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Max upload body size
    client_max_body_size 10m;
    
    # Forward /api/ requests to Node.js
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # React Router — return index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

---

### Step 4.2: Create Nginx Config for Admin Panel

```bash
sudo nano /etc/nginx/sites-available/admin-wenclims
```

Paste this:

```nginx
# Admin panel: admin.wenclims.org
server {
    listen 80;
    server_name admin.wenclims.org;
    
    root /home/wenclims/wenclims/admin/dist;
    index index.html;
    
    # Extra security for admin panel
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin" always;
    
    # DO NOT show admin panel in search engines
    add_header X-Robots-Tag "noindex, nofollow" always;
    
    # Smaller body limit for admin
    client_max_body_size 5m;
    
    # Forward API calls to Node.js
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # React Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### Step 4.3: Enable the Sites

```bash
# Enable both sites
sudo ln -s /etc/nginx/sites-available/wenclims /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin-wenclims /etc/nginx/sites-enabled/

# Remove default Nginx page
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration for errors
sudo nginx -t
# Should say: configuration file test is successful

# Restart Nginx
sudo systemctl restart nginx
```

---

## Phase 5: Set Up SSL/HTTPS (FREE with Let's Encrypt)

HTTPS is mandatory. This makes your site secure and Google ranks it higher.

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates for both domains
# IMPORTANT: Your domain must already be pointing to your server IP in DNS settings!
sudo certbot --nginx -d wenclims.org -d www.wenclims.org -d admin.wenclims.org

# Enter your email when asked (for expiry notifications)
# Accept terms of service
# Choose to redirect HTTP → HTTPS (option 2)

# Test auto-renewal:
sudo certbot renew --dry-run
```

Certbot automatically modifies your Nginx config to add HTTPS.
SSL certificates auto-renew every 90 days.

---

## Phase 6: Point Your Domain to the Server

---

### Step 6.1: Set Up DNS on Hostinger

1. Go to Hostinger control panel → **Domains** → your domain
2. Click **DNS/Nameservers** → **Manage DNS Records**
3. Add/edit these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_SERVER_IP | 3600 |
| A | www | YOUR_SERVER_IP | 3600 |
| A | admin | YOUR_SERVER_IP | 3600 |

4. DNS changes take 15 minutes to 24 hours to propagate worldwide.

---

### Step 6.2: Verify DNS Propagation

After adding DNS records, wait 15-30 minutes, then check:
- Visit: https://dnschecker.org
- Enter: `wenclims.org` → should show your server IP globally

---

## Phase 7: Fix the localhost Port References in Your Code

**This is the section you asked about specifically.**

When running locally, you have hardcoded ports:
- `http://localhost:5173` — public client
- `http://localhost:5174` — admin panel
- `http://localhost:5000` — API server

When deployed, these change to:
- `https://wenclims.org` — public client
- `https://admin.wenclims.org` — admin panel
- Requests go to `/api/...` (same domain, Nginx proxies to localhost:5000 internally)

---

### What Changes You Need to Make (Port-by-Port):

**1. Server CORS — `server/src/index.ts`:**

Change this:
```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];
```

To this (support BOTH local and production):
```typescript
const allowedOrigins = [
  'http://localhost:5173',    // local dev public
  'http://localhost:5174',    // local dev admin
  'https://wenclims.org',     // production public
  'https://www.wenclims.org', // production www
  'https://admin.wenclims.org', // production admin
];
```

Also fix the CORS callback (HIGH-01 issue):
```typescript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false); // REJECT unknown origins!
    }
  },
  credentials: true,
}));
```

**2. Admin API URL — `admin/src/services/api.ts`:**

Change:
```typescript
const API_BASE_URL = 'http://localhost:5000/api/v1';
```
To:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
```

Then create `admin/.env.production`:
```
VITE_API_BASE_URL=https://wenclims.org/api/v1
```

**3. Client API — `client/src/services/api.ts`:**

Already correctly uses: `import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'`

Create `client/.env.production`:
```
VITE_API_BASE_URL=https://wenclims.org/api/v1
```

**4. Admin redirect URL — `admin/src/services/api.ts` (Line 32):**

Change:
```typescript
window.location.href = '/admin--wensclims-xk9f2m/login';
```
This is fine — it's a relative URL and works in both dev and production.

**Summary:** In production, Nginx routes everything on the SAME domain (wenclims.org),
so `/api/...` goes to localhost:5000 internally. You NEVER use `localhost:5000` in production
from the browser — Nginx handles that routing transparently.

---

## Phase 8: Update and Redeploy (Future Deployments)

After making changes locally, here's how to push updates to production:

```bash
# On your server:
cd ~/wenclims

# Pull latest changes from GitHub
git pull origin main

# Install any new dependencies
cd server && npm install --production
cd ../client && npm install
cd ../admin && npm install
cd ..

# Rebuild TypeScript server
cd server && npm run build && cd ..

# Rebuild React apps
cd client && npm run build && cd ..
cd admin && npm run build && cd ..

# Restart the API server
pm2 restart wenclims-api

# Nginx doesn't need restart unless you changed its config
```

---

## Docker vs No Docker — Should You Use It?

**Your Question: Should I use Docker? Yes or No?**

### For Your Situation (First-Time Deployer, Hostinger VPS):

**RECOMMENDATION: NO Docker for now.**

Here's why:

| | Without Docker | With Docker |
|--|----------------|-------------|
| Setup complexity | Simple | Complex |
| Learning curve | Low | High (new concepts: images, containers, compose) |
| Works on Hostinger VPS | Yes | Yes, but needs more RAM |
| Good for first deployment | YES | NO |
| Good for teams | Maybe | YES |
| Good for CI/CD | Possible | Best fit |

**Use plain deployment (this guide) for your first deployment.**
Once the site is live and stable, you can migrate to Docker later.

If you want Docker in the future, then yes — a `docker-compose.yml` with 3 services
(postgres, server, nginx) would be very clean. But learn Docker separately first.

---

## CI/CD Pipeline — Should You Set It Up?

**Your Question: Is CI/CD pipeline good?**

**RECOMMENDATION: Yes, but start simple — add it AFTER the site is live.**

### What CI/CD Does:
Every time you push code to GitHub, it automatically:
1. Runs your tests
2. Builds the apps
3. Deploys to the server
4. No manual SSH needed

### Simple CI/CD for Your Stack (GitHub Actions):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy WenClims

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_IP }}
          username: wenclims
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/wenclims
            git pull origin main
            cd server && npm install --production && npm run build
            cd ../client && npm install && npm run build
            cd ../admin && npm install && npm run build
            pm2 restart wenclims-api
```

**Priority:** Get the site deployed manually first. Add CI/CD as improvement later.

---

## File/Folder Checklist — What Goes on GitHub and What Doesn't

### DO Commit to GitHub:
```
✅ client/src/       (all source code)
✅ admin/src/        (all source code)
✅ server/src/       (all source code)
✅ client/package.json
✅ admin/package.json
✅ server/package.json
✅ package.json (root)
✅ client/vite.config.ts
✅ admin/vite.config.ts
✅ server/tsconfig.json
✅ server/.env.example  (template with fake values only!)
✅ README.md
✅ .gitignore
✅ server/src/db/schema.sql
```

### DO NOT Commit to GitHub:
```
❌ server/.env                    (real passwords!)
❌ client/.env.production         (real URLs)
❌ admin/.env.production          (real URLs)
❌ node_modules/ (any)           (too large, use npm install)
❌ dist/ (any)                   (built on server)
❌ *.log                         (log files)
❌ server/dist/                  (compiled JS output)
❌ client/dist/                  (React build output)
❌ admin/dist/                   (React build output)
```

---

## Deployment Summary Checklist

Use this as your final checklist before going live:

### Pre-Deployment (Local):
- [ ] Fix `admin/src/services/api.ts` — use env variable for API URL
- [ ] Create `admin/.env.production` with production URL (add to `.gitignore`)
- [ ] Create `client/.env.production` with production URL (add to `.gitignore`)
- [ ] Fix CORS in `server/src/index.ts` — add production domains, fix the else branch
- [ ] Generate strong random secrets (JWT, DB password)
- [ ] Verify `.env` was never committed to git
- [ ] Test local build: `npm run build` in client/ and admin/
- [ ] Push code to GitHub (without `.env` files!)

### Server Setup:
- [ ] VPS created on Hostinger (Ubuntu 22.04 recommended)
- [ ] SSH access working
- [ ] Node.js 20 installed
- [ ] PostgreSQL installed and running
- [ ] Database `wenclims_db` created
- [ ] Database user created with strong password
- [ ] Nginx installed
- [ ] PM2 installed globally

### Deployment:
- [ ] Repository cloned on server
- [ ] Production `.env` created on server (never committed to git)
- [ ] `npm install` done in server/, client/, admin/
- [ ] Database schema run: `psql -f schema.sql`
- [ ] Server built: `npm run build` in server/
- [ ] Client built: `npm run build` in client/
- [ ] Admin built: `npm run build` in admin/
- [ ] PM2 started: `pm2 start dist/index.js --name wenclims-api`
- [ ] PM2 set to run on reboot: `pm2 startup && pm2 save`
- [ ] Nginx configured for both domains
- [ ] Nginx test passed: `sudo nginx -t`
- [ ] DNS records pointing to server IP

### SSL/HTTPS:
- [ ] Certbot installed
- [ ] SSL certificates obtained for wenclims.org and admin.wenclims.org
- [ ] HTTP → HTTPS redirect working
- [ ] Certificate auto-renewal tested

### Verification:
- [ ] Visit https://wenclims.org — site loads correctly
- [ ] Visit https://admin.wenclims.org — admin panel loads
- [ ] Admin login works with real credentials
- [ ] API returns data: https://wenclims.org/api/health
- [ ] No console errors in browser developer tools
- [ ] Mobile view looks correct

---

## Common Problems and Solutions

| Problem | Solution |
|---------|----------|
| "502 Bad Gateway" in browser | PM2 server not running — run: `pm2 restart wenclims-api` |
| "404 Not Found" on React routes | Nginx config missing `try_files $uri $uri/ /index.html;` |
| "CORS error" in browser console | Add your production domain to `allowedOrigins` in server |
| Admin panel can't reach API | Check `VITE_API_BASE_URL` in admin `.env.production` |
| SSL certificate fails | DNS not propagated yet — wait 30 minutes and retry |
| Database connection error | Check `DB_PASSWORD` in server `.env` matches PostgreSQL password |
| `npm run build` fails | Check for TypeScript errors locally first |
| Changes not showing after git pull | Remember to rebuild (`npm run build`) and restart PM2 |

---

## Useful Commands Reference (for After Deployment)

```bash
# View server logs
pm2 logs wenclims-api

# Restart server after code changes
pm2 restart wenclims-api

# View server status
pm2 status

# Check Nginx errors
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check RAM usage
free -m

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log

# Test API from server itself
curl http://localhost:5000/api/health

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

*This guide is specific to your WenClims project and Hostinger VPS. No code was changed.*
