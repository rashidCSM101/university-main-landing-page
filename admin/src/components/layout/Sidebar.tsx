import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  FolderKanban,
  Users,
  Wrench,
  UserCheck,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Activity,
  Megaphone,
} from 'lucide-react';
import { useAuth, OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';
import logoImg from '../../assets/logo.png';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: OBFUSCATED_ADMIN_PATH, icon: LayoutDashboard, exact: true },
    { label: 'My Bio Settings', path: `${OBFUSCATED_ADMIN_PATH}/team`, icon: UserCheck },
    { label: 'Blogs & Media', path: `${OBFUSCATED_ADMIN_PATH}/media`, icon: FileText, badge: '12' },
    { label: 'Publications', path: `${OBFUSCATED_ADMIN_PATH}/publications`, icon: BookOpen },
    { label: 'Projects', path: `${OBFUSCATED_ADMIN_PATH}/projects`, icon: FolderKanban },
    { label: 'Our Team', path: `${OBFUSCATED_ADMIN_PATH}/team`, icon: Users },
    { label: 'Sector Tools', path: `${OBFUSCATED_ADMIN_PATH}/tools`, icon: Wrench },
  ];

  const adminOnlyItems = [
    { label: 'User Roles', path: `${OBFUSCATED_ADMIN_PATH}/users`, icon: UserCheck },
    { label: 'Audit Logs', path: `${OBFUSCATED_ADMIN_PATH}/audit`, icon: ShieldAlert },
    { label: 'System Health & Backup', path: `${OBFUSCATED_ADMIN_PATH}/health`, icon: Activity },
    { label: 'Emergency Banner', path: `${OBFUSCATED_ADMIN_PATH}/banner`, icon: Megaphone },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <img
            src={logoImg}
            alt="WenClims Logo"
            style={{ height: '34px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
          />
          {!collapsed && (
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-name">WenClims</div>
              <div className="sidebar-brand-sub">Admin Console</div>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggle}
          className="sidebar-toggle-btn"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-section-label">Main Management</div>}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="sidebar-link-icon" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
            </NavLink>
          );
        })}

        {(user?.role === 'super_admin' || user?.role === 'admin') && (
          <>
            {!collapsed && <div className="sidebar-section-label">System Admin</div>}
            {adminOnlyItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="sidebar-link-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </>
        )}

        {!collapsed && <div className="sidebar-section-label">Quick Links</div>}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          title={collapsed ? 'Live Site Preview' : undefined}
        >
          <ExternalLink className="sidebar-link-icon" />
          {!collapsed && <span>Live Site Preview</span>}
        </a>
      </nav>

      {/* Footer / User Profile Card */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00C8C8, #1A3461)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0B1E3D',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
            title={user?.name || 'Administrator'}
          >
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#00C8C8', fontWeight: 700, textTransform: 'uppercase' }}>
                {user?.role === 'super_admin' ? 'Super Admin' : 'Editor'}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={async () => {
            await logout();
            window.location.href = `${OBFUSCATED_ADMIN_PATH}/login`;
          }}
          className="sidebar-link"
          style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="sidebar-link-icon" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
