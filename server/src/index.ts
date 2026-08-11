import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { apiRateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import adminMediaRoutes from './routes/adminMedia';
import adminPubsRoutes from './routes/adminPubs';
import adminProjectsRoutes from './routes/adminProjects';
import adminTeamRoutes from './routes/adminTeam';
import adminToolsRoutes from './routes/adminTools';
import adminUsersRoutes from './routes/adminUsers';
import adminAuditRoutes from './routes/adminAudit';
import adminSystemRoutes from './routes/adminSystem';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security HTTP Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production', // Strict CSP in production
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration — allow admin & public client origins
const allowedOrigins = [
  'http://localhost:5173', // Public Vite app
  'http://localhost:5174', // Admin SPA app
  'https://hex-byte.tech', // Production custom domain
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev tools / postman
    }
  },
  credentials: true,
}));

// Cookie Parser & Body Parsers
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global Rate Limiting
app.use('/api/', apiRateLimiter);

// System Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'WenClims Weather & Climate API Server',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1', publicRoutes); // Direct shorthand fallback

// Protected Admin API Routes (v1)
app.use('/api/v1/admin/media', adminMediaRoutes);
app.use('/api/v1/admin/publications', adminPubsRoutes);
app.use('/api/v1/admin/projects', adminProjectsRoutes);
app.use('/api/v1/admin/team', adminTeamRoutes);
app.use('/api/v1/admin/tools', adminToolsRoutes);
app.use('/api/v1/admin/users', adminUsersRoutes);
app.use('/api/v1/admin/audit-logs', adminAuditRoutes);
app.use('/api/v1/admin/system', adminSystemRoutes);
app.use('/api/v1/system', adminSystemRoutes);

// Global Error Handler — prevents sensitive stack trace leaks in client response
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'An internal server error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 WenClims Express Server running on http://localhost:${PORT}`);
  });
}
