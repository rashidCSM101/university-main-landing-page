import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'super_admin' | 'admin' | 'member' | 'editor'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#64748B' }}>
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`${OBFUSCATED_ADMIN_PATH}/login`} replace />;
  }

  // Check role authorization
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role as any)) {
    return (
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div
          className="card"
          style={{
            maxWidth: '520px',
            textAlign: 'center',
            padding: '3rem 2rem',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(11, 30, 61, 0.08)',
            border: '1.5px solid #FECACA',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#0B1E3D', marginBottom: '0.5rem' }}>
            Access Restricted
          </h2>

          <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            You are logged in as <strong>{user.name}</strong> (Role: <span style={{ textTransform: 'capitalize', color: '#00C8C8', fontWeight: 700 }}>{user.role}</span>).
            This module requires <strong>Executive Admin</strong> or <strong>Super Admin</strong> authorization.
          </p>

          <a
            href={`/admin${OBFUSCATED_ADMIN_PATH}/my-profile`}
            className="btn-teal"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontWeight: 700 }}
          >
            <ArrowLeft size={16} /> Return to My Profile
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
