# Security & Testing Implementation Guide
### Weather/Climate Website + Admin Dashboard (Blogs, Papers, Media, Projects)

This guide walks through each security area **one by one**, with concrete steps you can follow while building or auditing your platform. Check items off as you implement them.

---

## 1. Authentication & Access Control

**Steps to implement:**
1. Create separate login endpoints/flows for **Admin**, **Employee**, and **Public** (if public accounts exist). Do not share one generic `/login` that decides role only on the frontend.
2. Store roles in the database (e.g. `role: admin | editor | employee | viewer`) and check the role **on every backend route/controller**, not just to show/hide UI buttons.
3. Hash passwords with **bcrypt** (cost factor 10–12) or **argon2**. Never store plain text or use MD5/SHA1.
4. Add **MFA (2FA)** for admin logins — use TOTP (Google Authenticator/Authy) via a library like `speakeasy` (Node) or `pyotp` (Python).
5. Use short-lived **JWT access tokens** (15 min) + **refresh tokens** (httpOnly, secure cookie), or server-side sessions with secure cookies.
6. On logout, invalidate the session/token server-side (maintain a token blacklist or session store like Redis).
7. For every object-fetching route (e.g. `/admin/blog/:id/edit`), verify the requesting user actually has permission for that specific object — don't just check "is logged in as admin."

**How to test:**
- Log in as an Employee, then manually call Admin-only API endpoints (via Postman) — should get `403`.
- Try accessing `/admin/blog/edit/5` after changing the ID to another blog you don't own — should be blocked if permissions are object-level.
- Try using an expired/invalidated token — should be rejected.
- Automate this as integration tests: one test per role × per protected route.

---

## 2. Input Validation & Injection Protection

**Steps to implement:**
1. Validate all form inputs server-side (length, type, format) using a schema library: `zod`/`joi` (Node) or `pydantic` (Python).
2. Use an ORM or parameterized queries (e.g. `Prisma`, `Sequelize`, `SQLAlchemy`) — never concatenate raw SQL strings with user input.
3. For blog/article content (rich text), sanitize HTML **on save** with a library like `DOMPurify` (can run server-side via `jsdom`) or `sanitize-html`.
4. Escape all user-generated content when rendering on the frontend (React/Vue auto-escape by default — just avoid `dangerouslySetInnerHTML` / `v-html` unless content is sanitized first).
5. If using MongoDB, disable operator injection by sanitizing keys (e.g. `express-mongo-sanitize`).

**How to test:**
- Submit `' OR '1'='1' --` in login and search fields — should fail safely, not log you in or break the query.
- Submit `<script>alert(1)</script>` and `<img src=x onerror=alert(1)>` in blog title/body/comment fields — should render as plain text or be stripped, not execute.
- Run **OWASP ZAP** automated scan against your forms for injection payloads.

---

## 3. File Upload Security (Media, Papers, Images)

**Steps to implement:**
1. Whitelist allowed file types by **checking file signature/magic bytes** (not just `.pdf`/`.jpg` extension) — use a library like `file-type` (Node).
2. Set a max file size limit (e.g. 10–20MB for papers, smaller for images) at both frontend and backend/server (e.g. Nginx `client_max_body_size`).
3. Store uploaded files **outside the public web root**, or in cloud storage (S3, GCS, Azure Blob) — never in a folder that can execute scripts.
4. Rename files on upload to a random UUID + safe extension; never trust the original filename (prevents path traversal like `../../etc/passwd`).
5. Serve files via signed URLs or through your backend with permission checks, not direct static links, if papers/media are meant to be access-controlled.
6. Optional: run uploaded files through a malware scanner (e.g. ClamAV) before making them public.

**How to test:**
- Rename a `.php` or `.exe` file to `.jpg` and try uploading — should be rejected (magic byte check).
- Try filename `../../../etc/passwd.jpg` — should be sanitized/renamed.
- Upload a file just over the size limit — should be rejected with a clean error.

---

## 4. CSRF Protection

**Steps to implement:**
1. If using cookie-based sessions, generate a CSRF token per session and require it on all state-changing requests (POST/PUT/DELETE) — libraries: `csurf` (Node), Django/Rails have this built in.
2. Set cookies with `SameSite=Strict` or `Lax`, and `Secure` (HTTPS only), `HttpOnly`.
3. If using JWT in an `Authorization` header (not cookies), CSRF risk is lower — but still validate `Origin`/`Referer` headers on sensitive admin actions.

**How to test:**
- Build a simple external HTML page with a form pointing to your "delete blog" endpoint and submit it while logged into the admin panel in another tab — it should fail.

---

## 5. Secure HTTP Headers & Transport

**Steps to implement:**
1. Force HTTPS everywhere — redirect all HTTP to HTTPS, get a valid TLS cert (Let's Encrypt is free).
2. Add `Strict-Transport-Security` (HSTS) header.
3. Add `Content-Security-Policy` header restricting script/style sources (critical since you render rich blog content).
4. Add `X-Frame-Options: DENY` on the admin panel (prevents clickjacking).
5. Add `X-Content-Type-Options: nosniff`.
6. Add `Referrer-Policy: strict-origin-when-cross-origin`.
7. Use a library to set these easily: `helmet` (Node/Express).
8. Turn off directory listing on your web server (Nginx/Apache config) and hide version banners (`server_tokens off;` in Nginx).

**How to test:**
- Run your live domain through **securityheaders.com** and **Mozilla Observatory** — aim for an A rating.

---

## 6. Rate Limiting & Brute Force Protection

**Steps to implement:**
1. Rate-limit login, signup, and password-reset endpoints (e.g. 5 attempts per 15 min per IP) using `express-rate-limit` (Node) or `django-ratelimit` (Python), or at the reverse proxy (Nginx/Cloudflare).
2. Add temporary account lockout or exponential backoff after repeated failed logins.
3. Add CAPTCHA (Google reCAPTCHA or hCaptcha) on public-facing forms: contact forms, comments, newsletter signup.

**How to test:**
- Script 10+ rapid login attempts with wrong passwords — you should get throttled/blocked after the threshold.

---

## 7. API Security

**Steps to implement:**
1. Require authentication tokens on every API call — never assume "only my frontend calls this."
2. Re-check permissions server-side per endpoint, even if the frontend already hides the button/link.
3. Return generic error messages to clients (`"Invalid request"`) — log the detailed stack trace server-side only, never send it to the browser.
4. Version your API (`/api/v1/...`) so you can patch security issues without breaking existing integrations.

**How to test:**
- Call every admin API endpoint directly with Postman without a token — should get `401`.
- Trigger a server error deliberately (bad input) and confirm the response doesn't leak stack traces or file paths.

---

## 8. Secrets & Config Management

**Steps to implement:**
1. Store all credentials (DB password, API keys, JWT secret) in environment variables via a `.env` file.
2. Add `.env` to `.gitignore` immediately — check it's not already committed (`git log --all --full-history -- .env`).
3. In production, use a secrets manager: AWS Secrets Manager, HashiCorp Vault, or your hosting provider's environment variable settings (Vercel/Netlify/Render/Heroku config vars).
4. Rotate secrets (DB passwords, API keys) periodically, and immediately if a leak is suspected.

**How to test:**
- Search your entire git history for accidentally committed secrets using a tool like `truffleHog` or `gitleaks`.

---

## 9. Logging & Monitoring

**Steps to implement:**
1. Log all admin actions with timestamp, user, and action (e.g. "User X published Blog #12 at 14:32") — store in a dedicated `audit_logs` table.
2. Monitor failed login attempts and flag unusual patterns (many failures from one IP, logins from new locations).
3. Never log passwords, tokens, or full card/payment data in plaintext logs.
4. Centralize logs with a tool like **Sentry** (errors) and **LogRocket** or **ELK stack** (activity), so you can review incidents later.

**How to test:**
- Perform a test action (publish/delete a blog) and confirm it appears correctly in the audit log with the right user and timestamp.

---

## 10. Dependency & Infrastructure Security

**Steps to implement:**
1. Run `npm audit` / `pip-audit` regularly, and enable **Dependabot** or **Snyk** on your GitHub repo for automatic vulnerability alerts.
2. Keep your server OS, database, Node/Python runtime, and web server patched and updated.
3. Set up automated backups (daily) for your database and uploaded files, stored in a separate location from the primary server.
4. Periodically **test your backup restore process** — a backup you've never restored is not a guaranteed backup.

**How to test:**
- Run `npm audit` or `pip-audit` now and fix any high/critical vulnerabilities.
- Do a practice restore of your latest backup to a staging environment and confirm the site comes back up correctly.

---

## Testing Strategy Summary

| Test Type | Purpose | Suggested Tools |
|---|---|---|
| Unit tests | Validate individual functions (permission checks, input validators) | Jest, PyTest, Mocha |
| Integration tests | Test API endpoints + database behavior together | Supertest, Postman/Newman |
| E2E tests | Full flows: login → publish blog → logout, per role | Cypress, Playwright |
| SAST (static analysis) | Scan source code for vulnerable patterns | SonarQube, Semgrep |
| DAST (dynamic analysis) | Scan the running app for live vulnerabilities | OWASP ZAP, Burp Suite |
| Dependency scanning | Detect known CVEs in libraries | npm audit, Snyk, Dependabot |
| Manual pen-testing | Simulate real attacker behavior (auth, uploads, RBAC) | Burp Suite (manual) |
| Load/stress testing | Confirm the app holds up under traffic | k6, Apache JMeter |

**Practical habit:** For each of the OWASP Top 10 categories, write at least one automated test case attempting to exploit it in your specific app (login bypass, XSS in blog fields, IDOR on blog IDs, file upload bypass, etc.) and run these tests in your CI pipeline before every deploy.

---

## Suggested Order of Implementation

1. Authentication & RBAC (foundation — everything else depends on this)
2. Input validation + injection protection
3. File upload security
4. HTTPS + security headers
5. CSRF protection
6. Rate limiting
7. Secrets management
8. Logging & audit trail
9. Dependency scanning + automated backups
10. Set up test suite (unit → integration → E2E → security scans) alongside/after the above
