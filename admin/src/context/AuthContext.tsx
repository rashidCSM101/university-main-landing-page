import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'member' | 'editor';
}

export const OBFUSCATED_ADMIN_PATH = '';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, totp?: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('wenclims_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Listen for token expiry events dispatched by the API client
  useEffect(() => {
    const handleSessionExpired = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setUser(null);
      localStorage.removeItem('wenclims_admin_user');
      localStorage.removeItem('wenclims_admin_token');
      // Redirect to login — use replace so back-button doesn't return to expired session
      window.location.replace(`${OBFUSCATED_ADMIN_PATH}/login`);
      console.warn('Session expired:', detail?.message);
    };
    window.addEventListener('sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('sessionExpired', handleSessionExpired);
  }, []);

  const login = async (email: string, password?: string, totp?: string): Promise<User> => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    // Call live Express API endpoint
    try {
      const response = await api.login({ email, password, totp });
      setUser(response.user);
      localStorage.setItem('wenclims_admin_user', JSON.stringify(response.user));
      localStorage.setItem('wenclims_admin_token', response.token);
      return response.user;
    } catch (err: any) {
      // Clear any previous token/user on login failure
      setUser(null);
      localStorage.removeItem('wenclims_admin_user');
      localStorage.removeItem('wenclims_admin_token');
      throw new Error(err?.message || 'Invalid email or password.');
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network error on logout
    }
    setUser(null);
    localStorage.removeItem('wenclims_admin_user');
    localStorage.removeItem('wenclims_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
