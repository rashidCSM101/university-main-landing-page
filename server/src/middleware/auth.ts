import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/index';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'editor';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'wenclims_super_secret_jwt_access_key_2026_x9k2';

/**
 * Verify JWT Access Token Middleware
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token.' });
    }

    req.user = decoded as AuthenticatedUser;
    next();
  });
}

/**
 * Server-Side Role Enforcement Middleware
 * Ensures user has required role (e.g. 'super_admin') before accessing route.
 */
export function requireRole(allowedRole: 'super_admin' | 'editor') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (allowedRole === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden. Super Admin permissions required.' });
    }

    next();
  };
}

/**
 * Audit Logging Utility Function
 * Auto-logs state-changing admin actions to database audit_logs table
 */
export async function logAudit(
  user: AuthenticatedUser | undefined,
  action: string,
  entity: string,
  entityId: string | null,
  ipAddress: string,
  details: Record<string, any> = {}
) {
  try {
    const text = `
      INSERT INTO audit_logs (user_id, user_email, action, entity, entity_id, ip_address, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const params = [
      user?.id || null,
      user?.email || 'system',
      action,
      entity,
      entityId,
      ipAddress,
      JSON.stringify(details),
    ];
    await query(text, params);
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}
