import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { query } from '../db/index';
import { loginSchema } from '../utils/validation';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticateToken, logAudit, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'wenclims_super_secret_jwt_access_key_2026_x9k2';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'wenclims_super_secret_jwt_refresh_key_2026_p4m8';

/**
 * POST /api/v1/auth/login
 * Admin & Editor Authentication Endpoint
 */
router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation failed', details: parseResult.error.issues });
    }

    const { email, password, totp } = parseResult.data;

    // Fetch user with parameterized query (case-insensitive email)
    const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND is_active = TRUE', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Verify bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await logAudit(undefined, 'LOGIN_FAILED', 'users', user.id, req.ip || '127.0.0.1', { email });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify TOTP 2FA if user has totp_secret configured
    if (user.totp_secret && totp) {
      const verified = speakeasy.totp.verify({
        secret: user.totp_secret,
        encoding: 'base32',
        token: totp,
      });
      if (!verified) {
        return res.status(401).json({ error: 'Invalid 2FA code.' });
      }
    }

    // Update last_login timestamp
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Long-lived Access Token (7 days)
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    // Long-lived Refresh Token (7 days)
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Set refresh token in httpOnly Secure Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await logAudit(tokenPayload, 'LOGIN_SUCCESS', 'users', user.id, req.ip || '127.0.0.1');

    return res.json({
      message: 'Login successful',
      token: accessToken,
      user: tokenPayload,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh Access Token using httpOnly Refresh Cookie
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing.' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
    const result = await query('SELECT id, name, email, role FROM users WHERE id = $1 AND is_active = TRUE', [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found or inactive.' });
    }

    const user = result.rows[0];
    const newAccessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ token: newAccessToken, user });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token.' });
  }
});

/**
 * POST /api/v1/auth/logout
 * Invalidate session & clear refresh cookie
 */
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    await logAudit(req.user, 'LOGOUT', 'users', req.user.id, req.ip || '127.0.0.1');
  }
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully.' });
});

/**
 * GET /api/v1/auth/me
 * Get Current User Profile
 */
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

export default router;
