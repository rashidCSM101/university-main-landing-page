# ☁️ WenClims — Complete Azure Deployment Guide
### Testing Deployment with $100 Azure Credits (Client + Admin + Server + PostgreSQL)
### Date: 2026-08-18

---

> [!NOTE]
> This guide deploys **all 3 apps** to Azure using your **$100 free credits** for testing.
> It is written for someone who has **never used Azure before** — every single step is explained.
>
> **Your 3 apps:**
> - `client/` → Public React website (`wenclims.org`)
> - `admin/` → Admin React dashboard (`admin.wenclims.org`)
> - `server/` → Node.js Express API (running 24/7)
> - PostgreSQL → Database (on Azure)

---

## 📋 Table of Contents

1. [What Azure Services You Need (& Cost Breakdown)](#1-what-azure-services-you-need--cost-breakdown)
2. [Create Your Azure Account & Activate Credits](#2-create-your-azure-account--activate-credits)
3. [Install Azure CLI on Your Windows PC](#3-install-azure-cli-on-your-windows-pc)
4. [Phase 1 — Set Up the Database (PostgreSQL on Azure)](#4-phase-1--set-up-the-database-postgresql-on-azure)
5. [Phase 2 — Deploy the Express Server (App Service)](#5-phase-2--deploy-the-express-server-app-service)
6. [Phase 3 — Deploy the Public Client (Static Web App)](#6-phase-3--deploy-the-public-client-static-web-app)
7. [Phase 4 — Deploy the Admin Panel (Static Web App)](#7-phase-4--deploy-the-admin-panel-static-web-app)
8. [Update CORS in Server for Azure URLs](#8-update-cors-in-server-for-azure-urls)
9. [Fix the Admin API URL (Critical Step)](#9-fix-the-admin-api-url-critical-step)
10. [Verify Everything is Working](#10-verify-everything-is-working)
11. [How to Stop/Delete Resources (Save Credits)](#11-how-to-stopdelete-resources-save-credits)
12. [Cost Tracker Reference](#12-cost-tracker-reference)
13. [Common Problems & Fixes](#13-common-problems--fixes)

---

## 1. What Azure Services You Need (& Cost Breakdown)

### Services Plan for $100 Testing Budget

| App | Azure Service | Tier | Estimated Cost |
|-----|--------------|------|----------------|
| `client/` (Public React) | **Azure Static Web Apps** | Free | **$0/month** |
| `admin/` (Admin React) | **Azure Static Web Apps** | Free | **$0/month** |
| `server/` (Node.js API) | **Azure App Service** | B1 Basic | ~$13/month |
| PostgreSQL DB | **Azure Database for PostgreSQL** | Burstable B1ms | ~$12/month |
| **TOTAL** | | | **~$25/month** |

> [!TIP]
> With $100 credits → You can test for **approximately 4 months** before credits run out.
> If you only need 1 month of testing, you can easily stay well under $30 total.

### Why These Services?

| Service | Why Use It |
|---------|-----------|
| **Azure Static Web Apps (Free)** | React apps are just HTML/CSS/JS files after `npm run build`. Azure hosts them for free, gives you HTTPS, CDN, and custom domain at no cost. |
| **Azure App Service (B1 Basic)** | Runs your Node.js/Express server 24/7. B1 is the cheapest paid tier — has 1 vCPU, 1.75 GB RAM, supports SSL and custom domain. |
| **Azure Database for PostgreSQL Flexible Server (B1ms)** | Managed PostgreSQL. Azure handles backups, patches, and restarts automatically. B1ms is cheapest testing tier. |

---

## 2. Create Your Azure Account & Activate Credits

### Step 2.1: Sign Up / Log In

1. Go to: **https://portal.azure.com**
2. Sign in with your Microsoft account (or create one free).
3. If you have a **$100 Azure credit code** (e.g., from Visual Studio subscription or Azure for Students):
   - Go to: **https://my.visualstudio.com/Benefits** → Find Azure credit → Activate
   - OR go to: **https://azure.microsoft.com/en-us/pricing/member-offers/credit-for-visual-studio-subscribers/**

### Step 2.2: Check Your Credits

1. In Azure Portal top search bar → type: **"Subscriptions"** → Click it.
2. Click your subscription name.
3. Left sidebar → **"Cost Management"** → **"Overview"**.
4. You should see your remaining credit balance here.

> [!IMPORTANT]
> Set a **spending limit alert** so Azure emails you before you run out of credits:
> Go to: **Cost Management → Budgets → + Add** → Set budget to $80 → Add alert at 80% → Enter your email.

---

## 3. Install Azure CLI on Your Windows PC

The Azure CLI lets you run Azure commands directly in PowerShell on your Windows machine.

### Step 3.1: Download and Install

1. Go to: **https://aka.ms/installazurecliwindows**
2. Download the `.msi` installer.
3. Run it and follow the installation wizard (click Next → Next → Install → Finish).

### Step 3.2: Verify Installation

Open a **new** PowerShell window (close old ones first) and run:
```powershell
az --version
```
You should see something like: `azure-cli 2.xx.x`

### Step 3.3: Log In to Your Azure Account

```powershell
az login
```
A browser window will open → Sign in with your Microsoft account → Come back to PowerShell.

You should see JSON output with your subscription details. ✅

### Step 3.4: Set Your Default Subscription (if you have multiple)

```powershell
# List all subscriptions
az account list --output table

# Set the one with your $100 credits as default
az account set --subscription "YOUR_SUBSCRIPTION_ID_OR_NAME"
```

---

## 4. Phase 1 — Set Up the Database (PostgreSQL on Azure)

> [!IMPORTANT]
> **Do this FIRST** — the server needs the database connection string before it can start.

### Step 4.1: Create a Resource Group

A Resource Group is like a folder that holds all your Azure resources together.
This makes it easy to delete everything at once when testing is done.

```powershell
az group create --name wenclims-rg --location eastus
```

- `wenclims-rg` → Name of your resource group (you can choose any name)
- `eastus` → Azure data center location (US East is good; use `southeastasia` for closer to Pakistan)

> [!TIP]
> To see all available locations run: `az account list-locations --output table`
> Good option for Pakistan: `--location eastus` or `--location uaenorth` (UAE — closer geographically)

---

### Step 4.2: Create the PostgreSQL Flexible Server

```powershell
az postgres flexible-server create `
  --resource-group wenclims-rg `
  --name wenclims-db-server `
  --location eastus `
  --admin-user wenclims_user `
  --admin-password "YourStr0ngP@ssword!" `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --storage-size 32 `
  --version 16 `
  --yes
```

**What each part means:**
- `--name wenclims-db-server` → The server name. Your DB will be at: `wenclims-db-server.postgres.database.azure.com`
- `--admin-user wenclims_user` → Database username
- `--admin-password` → **Use a strong password here!** Min 8 chars, must have uppercase + lowercase + number + special character
- `--sku-name Standard_B1ms` → Cheapest burstable tier (~$12/month)
- `--storage-size 32` → 32 GB storage

> [!CAUTION]
> **Write down your admin username and password** — you will need them in the server `.env` file later.

**This command takes 3–5 minutes to complete.** Wait until you see output confirming success.

---

### Step 4.3: Create the Database

```powershell
az postgres flexible-server db create `
  --resource-group wenclims-rg `
  --server-name wenclims-db-server `
  --database-name wenclims_db
```

---

### Step 4.4: Allow Your App Service to Connect to the Database (Firewall Rule)

By default Azure blocks all connections. We need to allow the App Service to reach the DB:

```powershell
# Allow all Azure services to connect (for testing - includes App Service)
az postgres flexible-server firewall-rule create `
  --resource-group wenclims-rg `
  --name wenclims-db-server `
  --rule-name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0
```

> [!NOTE]
> `0.0.0.0` to `0.0.0.0` is Azure's special rule meaning "allow all Azure internal services."
> This is safe because the database is still not accessible from the public internet.

---

### Step 4.5: Run the Database Schema (Create Tables)

You need to connect to the Azure PostgreSQL and run your `schema.sql` file.

**Option A — Using pgAdmin (Easiest for Windows):**

1. Open pgAdmin on your computer.
2. Right-click **Servers** → **Register Server**.
3. Fill in the connection details:
   - **Name**: `Azure WenClims DB`
   - **Host**: `wenclims-db-server.postgres.database.azure.com`
   - **Port**: `5432`
   - **Database**: `wenclims_db`
   - **Username**: `wenclims_user`
   - **Password**: (the password you set in Step 4.2)
   - **SSL Mode**: `require`
4. Click **Save** → Connect.
5. Right-click the `wenclims_db` database → **Query Tool**.
6. Open your schema file: `File → Open` → Navigate to `server/src/db/schema.sql` → Click **Open**.
7. Press **F5** (Run) to execute all the SQL.
8. You should see "Query returned successfully" with no errors. ✅

**Option B — Using psql command line:**

```powershell
# In PowerShell (psql must be installed)
psql "host=wenclims-db-server.postgres.database.azure.com port=5432 dbname=wenclims_db user=wenclims_user sslmode=require" -f "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\server\src\db\schema.sql"
```

---

## 5. Phase 2 — Deploy the Express Server (App Service)

### Step 5.1: Create the App Service Plan

The App Service Plan defines the server hardware. B1 is cheapest with enough power for testing:

```powershell
az appservice plan create `
  --name wenclims-server-plan `
  --resource-group wenclims-rg `
  --sku B1 `
  --is-linux
```

- `--sku B1` → Basic B1 tier (~$13/month)
- `--is-linux` → Node.js runs on Linux

---

### Step 5.2: Create the Web App (App Service)

```powershell
az webapp create `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --plan wenclims-server-plan `
  --runtime "NODE:20-lts"
```

- `--name wenclims-api` → Your app name. Your server will be at: `https://wenclims-api.azurewebsites.net`
- `--runtime "NODE:20-lts"` → Use Node.js 20 LTS (same as your local setup)

> [!NOTE]
> Azure app names must be globally unique. If `wenclims-api` is taken, try `wenclims-api-2026` or similar.

---

### Step 5.3: Configure Environment Variables on Azure App Service

This is where you set your production `.env` values. These replace the local `server/.env` file:

```powershell
az webapp config appsettings set `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --settings `
    PORT=8080 `
    NODE_ENV=production `
    DB_HOST=wenclims-db-server.postgres.database.azure.com `
    DB_PORT=5432 `
    DB_NAME=wenclims_db `
    DB_USER=wenclims_user `
    DB_PASSWORD="YourStr0ngP@ssword!" `
    JWT_SECRET="REPLACE_WITH_64_CHAR_RANDOM_STRING" `
    JWT_REFRESH_SECRET="REPLACE_WITH_ANOTHER_64_CHAR_RANDOM_STRING" `
    COOKIE_SECRET="REPLACE_WITH_COOKIE_RANDOM_STRING" `
    WEBSITES_PORT=8080
```

> [!CAUTION]
> Replace the placeholder values with your **actual strong secrets**.
> Generate strong JWT secrets by running in PowerShell:
> ```powershell
> [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
> ```
> Run this command **3 times** to generate 3 different secrets.

> [!IMPORTANT]
> Azure App Service uses port `8080` internally by default for Node.js, not `5000`.
> `WEBSITES_PORT=8080` tells Azure which port your app listens on.
> Your Express server already uses `process.env.PORT` so this is handled automatically.

---

### Step 5.4: Configure SSL for PostgreSQL Connection

Azure PostgreSQL requires SSL. Add this SSL config:

```powershell
az webapp config appsettings set `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --settings `
    PGSSLMODE=require
```

Also update `server/src/db/index.ts` — the pool config needs SSL for production.
**You will fix this in the code section (Step 5.6 below) before deploying.**

---

### Step 5.5: Prepare Server Code for Azure Deployment

**Fix 1 — Add SSL to PostgreSQL pool** (`server/src/db/index.ts`):

The Azure PostgreSQL server **requires SSL**. Add the SSL option to the pool:

```typescript
// server/src/db/index.ts — pool config
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'wenclims_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 10, // Reduce from 20 to 10 for B1 tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Add this for Azure PostgreSQL SSL requirement:
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

**Fix 2 — Add startup script for Azure** (`server/package.json`):

Azure App Service looks for a `start` script. Verify your `server/package.json` has:
```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "NODE_ENV=test jest"
}
```
✅ You already have `"start": "node dist/index.js"` — good.

---

### Step 5.6: Deploy the Server Code to Azure

We use Git deployment (push code → Azure builds it automatically).

**Method: ZIP Deploy (Fastest for Testing)**

```powershell
# 1. Go to the server folder
cd "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\server"

# 2. Build the TypeScript to JavaScript first
npm run build

# 3. Create a zip of the files Azure needs
# (dist folder + package.json + package-lock.json)
Compress-Archive -Path dist, package.json, package-lock.json -DestinationPath deploy.zip -Force

# 4. Deploy the zip to Azure
az webapp deploy `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --src-path deploy.zip `
  --type zip
```

**Wait 2–3 minutes** for Azure to deploy and restart the app.

---

### Step 5.7: Tell Azure to Install npm Dependencies & Start the App

After zip deploy, Azure needs to install production dependencies:

```powershell
az webapp config set `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --startup-file "node dist/index.js"
```

Also set Node.js version:
```powershell
az webapp config appsettings set `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --settings WEBSITE_NODE_DEFAULT_VERSION="~20"
```

---

### Step 5.8: Install Dependencies on Azure (Remote)

Open the Azure Portal → Find your `wenclims-api` App Service → Left sidebar → **SSH** → Open SSH terminal:

```bash
# Inside Azure SSH terminal:
cd /home/site/wwwroot
npm install --production
```

OR alternatively, include `node_modules` in your zip (not recommended — very large).

**Better alternative:** Use **Azure App Service Build Service** which runs `npm install` automatically.

Enable it:
```powershell
az webapp config appsettings set `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

Then re-deploy with the source code (not compiled dist) so Azure builds it:

```powershell
cd "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\server"

# This time zip the source (Azure will compile TypeScript for you)
Compress-Archive -Path src, package.json, package-lock.json, tsconfig.json -DestinationPath deploy-src.zip -Force

az webapp deploy `
  --name wenclims-api `
  --resource-group wenclims-rg `
  --src-path deploy-src.zip `
  --type zip
```

---

### Step 5.9: Verify the Server is Running

```powershell
# Check the health endpoint
Invoke-WebRequest -Uri "https://wenclims-api.azurewebsites.net/api/health" -Method GET
```

Expected response:
```json
{
  "status": "OK",
  "service": "WenClims Weather & Climate API Server",
  "environment": "production"
}
```

If you get an error, check the logs:
```powershell
az webapp log tail --name wenclims-api --resource-group wenclims-rg
```

---

## 6. Phase 3 — Deploy the Public Client (Static Web App)

Azure Static Web Apps = **FREE**, includes HTTPS, CDN, and custom domains.

### Step 6.1: Create the Static Web App for Client

```powershell
az staticwebapp create `
  --name wenclims-client `
  --resource-group wenclims-rg `
  --location "eastus2" `
  --sku Free
```

> [!NOTE]
> Static Web Apps are available in limited locations. Use `eastus2`, `westus2`, or `centralus`.
> The CDN distributes globally regardless of chosen location.

---

### Step 6.2: Set the API URL Environment Variable

```powershell
az staticwebapp appsettings set `
  --name wenclims-client `
  --setting-names `
    VITE_API_BASE_URL=https://wenclims-api.azurewebsites.net/api/v1
```

> [!IMPORTANT]
> Vite environment variables for static web apps must be set at BUILD TIME, not runtime.
> The best approach is to create `client/.env.production` locally before building.

Create this file locally (do NOT commit to git):
```
# client/.env.production
VITE_API_BASE_URL=https://wenclims-api.azurewebsites.net/api/v1
```

---

### Step 6.3: Build the Client Locally

```powershell
cd "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\client"

# This reads client/.env.production automatically during build
npm run build
```

This creates the `client/dist/` folder with all the static files.

---

### Step 6.4: Deploy the Built Client to Azure Static Web Apps

```powershell
# Get the deployment token for your static web app
$DEPLOYMENT_TOKEN = az staticwebapp secrets list `
  --name wenclims-client `
  --resource-group wenclims-rg `
  --query "properties.apiKey" `
  --output tsv

# Deploy using SWA CLI
npm install -g @azure/static-web-apps-cli

swa deploy "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\client\dist" `
  --deployment-token $DEPLOYMENT_TOKEN `
  --env production
```

> [!TIP]
> If `swa` CLI gives errors, use the Azure Portal manual upload:
> 1. Go to Azure Portal → Search "Static Web Apps" → Click `wenclims-client`.
> 2. Left sidebar → **Environments** → **Browse** → this shows the live URL.
> 3. For manual deployment, use **GitHub Actions** integration (described in Step 6.5).

---

### Step 6.5: Alternative — Deploy via GitHub Actions (Recommended)

This is the recommended method: connect your GitHub repo and Azure auto-deploys on every push.

1. Go to **Azure Portal** → search **"Static Web Apps"** → click `wenclims-client`.
2. Left sidebar → **Deployment** → **GitHub**.
3. Click **"Link to a repository"**.
4. Authorize Azure to access GitHub → Select your repository → Select branch `main`.
5. Set **App location**: `/client`
6. Set **Build location**: `dist`
7. Set **API location**: (leave empty)
8. Click **Save**.

Azure creates a GitHub Actions workflow file in your repository automatically.
Every `git push` to `main` will now auto-build and deploy the client. 🚀

**Your client will be live at:**
`https://wenclims-client.azurestaticapps.net`

---

## 7. Phase 4 — Deploy the Admin Panel (Static Web App)

Exactly the same process as the client, but for the `admin/` folder.

### Step 7.1: Create the Static Web App for Admin

```powershell
az staticwebapp create `
  --name wenclims-admin `
  --resource-group wenclims-rg `
  --location "eastus2" `
  --sku Free
```

---

### Step 7.2: Create Admin Production Environment File

Create `admin/.env.production` locally (do NOT commit to git):
```
# admin/.env.production
VITE_API_BASE_URL=https://wenclims-api.azurewebsites.net/api/v1
```

> [!IMPORTANT]
> Your `admin/src/services/api.ts` currently has `localhost:5000` hardcoded.
> Before building, update line 1 to use the environment variable:
> ```typescript
> const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
> ```
> This is the same fix noted in the security analysis report.

---

### Step 7.3: Build the Admin Panel

```powershell
cd "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\admin"
npm run build
```

Creates `admin/dist/` folder.

---

### Step 7.4: Deploy the Admin Panel

```powershell
# Get the deployment token for admin static web app
$ADMIN_TOKEN = az staticwebapp secrets list `
  --name wenclims-admin `
  --resource-group wenclims-rg `
  --query "properties.apiKey" `
  --output tsv

swa deploy "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\admin\dist" `
  --deployment-token $ADMIN_TOKEN `
  --env production
```

**Your admin panel will be live at:**
`https://wenclims-admin.azurestaticapps.net`

---

## 8. Update CORS in Server for Azure URLs

> [!CAUTION]
> This is the most important code change. Without it, the browser will block all API calls from your deployed React apps.

Open `server/src/index.ts` and update the `allowedOrigins` array:

```typescript
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',

  // Azure Static Web Apps URLs (Testing)
  'https://wenclims-client.azurestaticapps.net',
  'https://wenclims-admin.azurestaticapps.net',

  // Production domains (when you have them)
  'https://wenclims.org',
  'https://www.wenclims.org',
  'https://admin.wenclims.org',
];

// IMPORTANT: Fix the CORS else branch too!
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // REJECT unknown origins (was wrongly allowing all in original code)
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
}));
```

After making this code change → rebuild and redeploy the server (repeat Step 5.6).

---

## 9. Fix the Admin API URL (Critical Step)

> [!CAUTION]
> Your `admin/src/services/api.ts` Line 1 currently has `localhost:5000` hardcoded.
> This means the admin panel in production will try to call `localhost:5000` — which doesn't exist!
> You MUST fix this before deploying admin.

**File:** `admin/src/services/api.ts` — Change Line 1:

```typescript
// BEFORE (broken in production):
const API_BASE_URL = 'http://localhost:5000/api/v1';

// AFTER (reads from environment variable):
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
```

Then add `admin/.env.production` as shown in Step 7.2, and rebuild.

---

## 10. Verify Everything is Working

After all deployments, test each component:

### Test 1 — Server API Health
```powershell
Invoke-WebRequest -Uri "https://wenclims-api.azurewebsites.net/api/health"
```
Expected: `{"status":"OK", ...}`

### Test 2 — Public Data Endpoints
```powershell
Invoke-WebRequest -Uri "https://wenclims-api.azurewebsites.net/api/v1/tools"
Invoke-WebRequest -Uri "https://wenclims-api.azurewebsites.net/api/v1/team"
Invoke-WebRequest -Uri "https://wenclims-api.azurewebsites.net/api/v1/projects"
```

### Test 3 — Client Website
Open in browser: `https://wenclims-client.azurestaticapps.net`
- Does the homepage load? ✅
- Does the team page load? ✅
- Does the map render? ✅

### Test 4 — Admin Panel
Open in browser: `https://wenclims-admin.azurestaticapps.net`
- Does the login page load? ✅
- Login with your admin credentials.
- Does the dashboard show data? ✅

### Test 5 — Check Server Logs for Errors
```powershell
az webapp log tail --name wenclims-api --resource-group wenclims-rg
```

### Checklist Summary

| Check | URL | Expected |
|-------|-----|---------|
| Server health | `https://wenclims-api.azurewebsites.net/api/health` | `{"status":"OK"}` |
| Client loads | `https://wenclims-client.azurestaticapps.net` | Website renders |
| Client API works | Homepage shows real data from DB | Team/tools cards appear |
| Admin loads | `https://wenclims-admin.azurestaticapps.net` | Login page appears |
| Admin login works | Log in with real credentials | Dashboard shows data |
| No CORS errors | Open browser DevTools → Console tab | No red CORS errors |

---

## 11. How to Stop/Delete Resources (Save Credits)

When you are done testing and want to stop Azure billing:

### Option A — Delete Everything (Complete Cleanup)

```powershell
# This deletes ALL resources in one command
az group delete --name wenclims-rg --yes --no-wait
```

> [!CAUTION]
> This is permanent and deletes the database too. Export your data first if needed.

### Option B — Stop the App Service (Saves ~$13/month, keeps DB running)

```powershell
# Stop (pause) the server — you won't be billed for compute
az webapp stop --name wenclims-api --resource-group wenclims-rg

# Restart it later:
az webapp start --name wenclims-api --resource-group wenclims-rg
```

> [!NOTE]
> **Static Web Apps (client + admin) are always free** — no need to stop them.
> **PostgreSQL Flexible Server** — stopping it saves ~$12/month:
> ```powershell
> az postgres flexible-server stop --resource-group wenclims-rg --name wenclims-db-server
> ```

### Option C — Scale Down to Save Credits

```powershell
# Downgrade App Service from B1 (~$13) to F1 (FREE) for light testing
az appservice plan update --name wenclims-server-plan --resource-group wenclims-rg --sku F1
```

> [!WARNING]
> F1 (Free) tier has limitations: only 60 CPU minutes/day, no custom domain, app sleeps after 20 min of inactivity, and SSL requires workaround. Use B1 for real testing.

---

## 12. Cost Tracker Reference

Monitor costs to avoid surprises:

### Check Current Spending

```powershell
# View current month's cost breakdown
az consumption usage list --start-date 2026-08-01 --end-date 2026-08-31 --output table
```

### Azure Portal Method (Easier)

1. Azure Portal → Search **"Cost Management"**.
2. Click **"Cost analysis"**.
3. You see a breakdown by service and date.

### Estimated Credit Duration

| Scenario | Monthly Cost | Credits Last |
|----------|-------------|-------------|
| All services running 24/7 | ~$25/month | **4 months** |
| Stop App Service + DB at night (8h/day) | ~$10/month | **10 months** |
| Only Static Web Apps (no backend running) | $0/month | Forever |

---

## 13. Common Problems & Fixes

| Problem | Error Message | Fix |
|---------|--------------|-----|
| Server won't start | Application Error / 500 | Check logs: `az webapp log tail --name wenclims-api --resource-group wenclims-rg` |
| DB connection refused | `ECONNREFUSED` or `SSL required` | Add `ssl: { rejectUnauthorized: false }` to pool config (Step 5.5) |
| CORS error in browser | `Access-Control-Allow-Origin` blocked | Add your Azure URLs to `allowedOrigins` in `server/src/index.ts` (Step 8) |
| Admin can't reach API | Network Error / 500 in admin | Fix `admin/src/services/api.ts` to use env variable (Step 9) |
| Build fails on Azure | TypeScript errors | Fix errors locally first with `npm run build` in server/ |
| Static Web App 404 on refresh | Page Not Found | Add `staticwebapp.config.json` (see below) |
| App Service port mismatch | Connection timeout | Set `WEBSITES_PORT=8080` in App Settings (Step 5.3) |

### Fix for Static Web App 404 on Direct Route Refresh

Create this file at `client/public/staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ]
}
```

And the same for `admin/public/staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ]
}
```

This replaces the `404.html` trick needed for GitHub Pages — Azure Static Web Apps has its own native routing config.

---

## 📋 Complete Deployment Checklist

### Preparation (Local Machine):
- [ ] Fix `admin/src/services/api.ts` Line 1 — use `import.meta.env.VITE_API_BASE_URL`
- [ ] Fix `server/src/db/index.ts` — add SSL option for production
- [ ] Fix `server/src/index.ts` — update CORS allowed origins with Azure URLs
- [ ] Fix `server/src/index.ts` — fix the CORS `else` branch (reject unknown origins)
- [ ] Create `client/.env.production` with `VITE_API_BASE_URL=https://wenclims-api.azurewebsites.net/api/v1`
- [ ] Create `admin/.env.production` with `VITE_API_BASE_URL=https://wenclims-api.azurewebsites.net/api/v1`
- [ ] Add `staticwebapp.config.json` to `client/public/` and `admin/public/`
- [ ] Generate 3 strong random secrets for JWT and cookie

### Azure Setup:
- [ ] Azure account created and credits verified
- [ ] Azure CLI installed and logged in (`az login`)
- [ ] Resource group created (`wenclims-rg`)
- [ ] PostgreSQL Flexible Server created (`wenclims-db-server`)
- [ ] Database created (`wenclims_db`)
- [ ] Firewall rule added (allow Azure services)
- [ ] Schema SQL executed on Azure PostgreSQL

### Server Deployment:
- [ ] App Service Plan created (`B1`)
- [ ] Web App created (`wenclims-api`)
- [ ] All environment variables set via `az webapp config appsettings set`
- [ ] Server code built (`npm run build` in server/)
- [ ] Code deployed to Azure (`az webapp deploy`)
- [ ] Health check passes: `https://wenclims-api.azurewebsites.net/api/health`

### Client Deployment:
- [ ] Static Web App created (`wenclims-client`)
- [ ] Client built locally with `client/.env.production` in place
- [ ] Client deployed to Azure Static Web Apps
- [ ] Website loads at Azure URL

### Admin Deployment:
- [ ] Static Web App created (`wenclims-admin`)
- [ ] Admin built locally with `admin/.env.production` in place
- [ ] Admin deployed to Azure Static Web Apps
- [ ] Admin login works at Azure URL

### Verification:
- [ ] No CORS errors in browser DevTools console
- [ ] Team/projects/tools data loads from real database
- [ ] Admin login with real credentials works
- [ ] Cost alert set up in Azure Cost Management

---

## 🗂️ Summary of Azure URLs After Deployment

| App | Azure URL |
|-----|----------|
| Public Website | `https://wenclims-client.azurestaticapps.net` |
| Admin Panel | `https://wenclims-admin.azurestaticapps.net` |
| API Server | `https://wenclims-api.azurewebsites.net` |
| API Health Check | `https://wenclims-api.azurewebsites.net/api/health` |
| Database | `wenclims-db-server.postgres.database.azure.com` (internal only) |

---

*This guide is specific to your WenClims 3-app architecture. No code was changed — all items are steps you perform.*
*For production deployment, use the Hostinger VPS guide instead.*
