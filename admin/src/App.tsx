import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, OBFUSCATED_ADMIN_PATH } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { MediaManager } from './components/dashboard/MediaManager';
import { PublicationsManager } from './components/dashboard/PublicationsManager';
import { ProjectsManager } from './components/dashboard/ProjectsManager';
import { TeamManager } from './components/dashboard/TeamManager';
import { ToolsManager } from './components/dashboard/ToolsManager';
import { UsersManager } from './components/dashboard/UsersManager';
import { AuditLogsManager } from './components/dashboard/AuditLogsManager';
import { SystemHealthManager } from './components/dashboard/SystemHealthManager';
import { GlobalBannerManager } from './components/dashboard/GlobalBannerManager';
import { SiteSettingsManager } from './components/dashboard/SiteSettingsManager';

const AdminLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const [collapsed, setCollapsed] = React.useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className="admin-main">
        <TopBar title={title} />
        {children}
      </div>
    </div>
  );
};

export function App() {
  const loginPath = `${OBFUSCATED_ADMIN_PATH}/login`;

  return (
    <AuthProvider>
      <Router basename="/admin">
        <Routes>
        {/* Obfuscated Login Route */}
        <Route path={loginPath} element={<LoginPage />} />

        {/* Protected Dashboard Overview */}
        <Route
          path={OBFUSCATED_ADMIN_PATH || '/'}
          element={
            <ProtectedRoute>
              <AdminLayout title="System Overview">
                <DashboardHome />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Blogs & Media Manager */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/media`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Blogs & Media Manager">
                <MediaManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Publications & Research Manager */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/publications`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Publications & Research">
                <PublicationsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Climate Projects Manager */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/projects`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Projects & Grants">
                <ProjectsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Team Members Manager */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/team`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Team Members Manager">
                <TeamManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Sector Tools Manager */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/tools`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Sector Tools Manager">
                <ToolsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Super Admin User Roles */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/users`}
          element={
            <ProtectedRoute>
              <AdminLayout title="User Roles & Access">
                <UsersManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Super Admin Audit Logs */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/audit`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Security Audit Trail">
                <AuditLogsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Super Admin System Health & DB Backup */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/health`}
          element={
            <ProtectedRoute>
              <AdminLayout title="System Health & DB Backup">
                <SystemHealthManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Super Admin Global Emergency Banner */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/banner`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Emergency Website Banner">
                <GlobalBannerManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Site Settings Manager */}
        <Route
          path={`${OBFUSCATED_ADMIN_PATH}/settings`}
          element={
            <ProtectedRoute>
              <AdminLayout title="Site Settings & Policy">
                <SiteSettingsManager />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to obfuscated login page */}
        <Route path="*" element={<Navigate to={loginPath} replace />} />
      </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
