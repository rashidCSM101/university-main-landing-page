# 🌐 WenClims — Temporary Frontend Deployment on GitHub Pages
### Step-by-Step Guide for Deploying the Public Client (`client/`) Only
### Date: 2026-08-05

---

> [!NOTE]
> This guide is for deploying **ONLY the React frontend (`client/`)** to GitHub Pages for temporary preview, testing, or static showcase.
> 
> Your `client/package.json` already has the `gh-pages` package installed!

---

## 📋 Table of Contents
1. [Understanding Temporary GitHub Pages Deployment](#1-understanding-temporary-github-pages-deployment)
2. [Prerequisites & Repository Checklist](#2-prerequisites--repository-checklist)
3. [Step-by-Step Deployment Procedure](#3-step-by-step-deployment-procedure)
4. [Fixing SPA Routing (404 Error on Direct Page Refresh)](#4-fixing-spa-routing-404-error-on-direct-page-refresh)
5. [Connecting a Custom Domain (Optional)](#5-connecting-a-custom-domain-optional)
6. [Handling Backend API Calls During Temporary Deployment](#6-handling-backend-api-calls-during-temporary-deployment)
7. [Comparing GitHub Pages vs Full Hostinger VPS](#7-comparing-github-pages-vs-full-hostinger-vps)

---

## 1. Understanding Temporary GitHub Pages Deployment

When you deploy only the frontend to GitHub Pages:

- **What gets deployed**: The compiled static assets (`HTML`, `CSS`, `JS`, `images`) inside `client/dist/`.
- **What is NOT deployed**: The Node.js Express backend (`server/`) and PostgreSQL database (`wenclims_db`).
- **Cost**: 100% Free.
- **Hosting URL**:
  - Without custom domain: `https://<your-username>.github.io/<repository-name>/`
  - With custom domain: `https://wenclims.org`

---

## 2. Prerequisites & Repository Checklist

Before deploying, ensure:
1. You have pushed your latest code to a **GitHub repository**.
2. Node.js is installed on your local computer.
3. You are running commands inside the `client/` folder.

---

## 3. Step-by-Step Deployment Procedure

### Step 3.1: Check `client/vite.config.ts` Base Path

Open `client/vite.config.ts` and set the `base` property according to your target URL:

**Scenario A: Deploying to GitHub URL (`https://username.github.io/repository-name/`)**
```typescript
// client/vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/repository-name/', // Replace 'repository-name' with your exact GitHub repository name
  // ... rest of config
})
```

**Scenario B: Deploying with Custom Domain (`https://wenclims.org`)**
```typescript
// client/vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/', // Keep root slash when using a custom domain
  // ... rest of config
})
```

---

### Step 3.2: Run the Deployment Command

Open PowerShell or Command Prompt on your local machine and run:

```powershell
# 1. Navigate to the client directory
cd "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\client"

# 2. Run the deploy script
npm run deploy
```

What `npm run deploy` does under the hood:
1. Runs `predeploy`: `npm run build` (compiles TypeScript & Vite into `client/dist/`).
2. Runs `deploy`: `gh-pages -d dist` (creates/updates a secret `gh-pages` branch on GitHub with the build files).

---

### Step 3.3: Configure GitHub Pages in Your Repository Settings

1. Go to your GitHub repository in your browser (`https://github.com/username/repository-name`).
2. Click **Settings** (top menu bar).
3. Scroll down the left sidebar to **Pages** (under Code and automation).
4. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select `gh-pages` branch and `/ (root)` folder.
   - Click **Save**.
5. Wait 2–3 minutes for GitHub to finish building the site.
6. Refresh the settings page — you will see a banner:
   > *"Your site is live at https://username.github.io/repository-name/"*

---

## 4. Fixing SPA Routing (404 Error on Direct Page Refresh)

### The Problem:
GitHub Pages is a static server. When a user visits `https://username.github.io/repository-name/team` or refreshes `/projects` directly, GitHub looks for a file named `team/index.html` which does not exist, resulting in a **GitHub 404 Error**.

### The Solution: 404 Redirect Trick (`client/public/404.html`)

Create a `404.html` file inside `client/public/` that catches 404s and redirects them back to `index.html` with the path preserved in the query string.

#### File 1: Create `client/public/404.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>WenClims Telemetry</title>
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 1;

      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

#### File 2: Add Script Handler in `client/index.html`

Add this script tag inside the `<head>` of `client/index.html`:

```html
<script type="text/javascript">
  // Single Page Apps for GitHub Pages
  // MIT License https://github.com/rafgraph/spa-github-pages
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location));
</script>
```

After adding these two scripts, re-deploy:
```powershell
cd client
npm run deploy
```

Now direct links like `/team`, `/projects`, `/tools` will reload seamlessly without 404 errors!

---

## 5. Connecting a Custom Domain (Optional)

If you want your GitHub Pages temporary frontend to run on `wenclims.org`:

1. Create a `CNAME` file inside `client/public/CNAME` with your domain:
   ```
   wenclims.org
   ```
2. Go to **GitHub Repository Settings → Pages → Custom domain**:
   - Type `wenclims.org` and click **Save**.
   - Check the box for **Enforce HTTPS**.
3. In your Domain Registrar / DNS Manager (e.g. Hostinger / Cloudflare):
   - Add **A Records** pointing `@` to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add **CNAME Record** for `www` pointing to `<username>.github.io`.

---

## 6. Handling Backend API Calls During Temporary Deployment

Since GitHub Pages only hosts static files:

1. **If Backend Server (`server/`) is running on Hostinger VPS:**
   Set `VITE_API_BASE_URL` in `client/.env.production`:
   ```
   VITE_API_BASE_URL=https://api.wenclims.org/api/v1
   ```
2. **If Backend is NOT deployed yet:**
   The client application has built-in fallbacks and static JSON fallbacks for home sections, publications, and tools, so the site will still render smoothly for visitors.

---

## 7. Comparing GitHub Pages vs Full Hostinger VPS

| Feature | GitHub Pages (Frontend Only) | Hostinger VPS (Full Stack) |
|---|---|---|
| **Purpose** | Temporary preview, static site showcase | Full production release |
| **Cost** | Free | Paid VPS plan |
| **Backend Support** | ❌ No (Node.js/Express cannot run) | ✅ Yes (Node.js/Express active) |
| **Database** | ❌ No (PostgreSQL cannot run) | ✅ Yes (PostgreSQL active) |
| **Admin Control Panel** | ❌ Cannot process login/DB updates | ✅ Fully functional |
| **Deploy Speed** | ~1 Minute (`npm run deploy`) | Built via Nginx & PM2 |

---

## ⚡ Summary Quick Start Commands

```powershell
# Navigate to client directory
cd "c:\Users\Rashid\OneDrive - Quaid-i-Azam University\LMS\client"

# Build and publish frontend to gh-pages branch
npm run deploy
```
