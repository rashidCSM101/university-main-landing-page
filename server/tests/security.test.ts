import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';

const JWT_SECRET = process.env.JWT_SECRET || 'wenclims_super_secret_jwt_access_key_2026_x9k2';

describe('Security & Access Control Tests', () => {

  describe('1. Unauthenticated Access Protection', () => {
    it('should return 401 Unauthorized when requesting protected admin media without a token', async () => {
      const res = await request(app).get('/api/v1/admin/media');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Authentication required');
    });

    it('should return 401 Unauthorized when requesting super admin audit logs without a token', async () => {
      const res = await request(app).get('/api/v1/admin/audit-logs');
      expect(res.status).toBe(401);
    });
  });

  describe('2. Role-Based Access Control (RBAC)', () => {
    it('should return 403 Forbidden when an Editor attempts to access Super Admin user management', async () => {
      // Generate token for Editor role
      const editorToken = jwt.sign(
        { id: 'usr_editor_123', name: 'Editor User', email: 'editor@wenclims.org', role: 'editor' },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Super Admin permissions required');
    });
  });

  describe('3. Token Tampering & Invalid JWT Protection', () => {
    it('should reject tampered or invalid JWT access tokens', async () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.signature';

      const res = await request(app)
        .get('/api/v1/admin/media')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Invalid or expired authentication token');
    });
  });

  describe('4. Input Validation & Injection Protection', () => {
    it('should return 400 Validation Error for malformed email on login', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should safely handle SQL injection payload without blowing up the query', async () => {
      const sqlPayload = "' OR '1'='1' --";

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: sqlPayload, password: 'password' });

      // Should return 400 validation error (invalid email format) rather than SQL syntax error or 500
      expect(res.status).toBe(400);
    });
  });
});
