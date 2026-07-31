import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`${OBFUSCATED_ADMIN_PATH}/login`} replace />;
  }

  return <>{children}</>;
};
