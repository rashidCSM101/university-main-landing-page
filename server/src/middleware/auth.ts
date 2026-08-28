import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/index';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'member' | 'editor';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start in production without a secure secret.');
  } else {
    console.warn('⚠️  WARNING: JWT_SECRET is not set. Using an insecure default — do NOT use in production.');
  }
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev_only_insecure_fallback_jwt_secret_do_not_use';

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
 * Role Hierarchy — higher number = more permissions
 */
const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  member: 1,
};

/**
 * Server-Side Role Enforcement Middleware
 * Ensures user has the minimum required role level before accessing route.
 */
export function requireRole(minimumRole: 'super_admin' | 'admin' | 'member' | 'editor') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] ?? 99;

    if (userLevel < requiredLevel) {
      return res.status(403).json({ error: `Forbidden. ${minimumRole.replace('_', ' ')} permissions or higher required.` });
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
