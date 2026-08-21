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
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  Megaphone,
  UserCircle,
  KeyRound,
  Sliders,
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

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin      = user?.role === 'admin';
  const isMember     = user?.role === 'member' || user?.role === 'editor';
  const isPowerUser  = isSuperAdmin || isAdmin;

  // ── Navigation items visible to ALL logged-in users ──────────────────────
  const commonItems = [
    { label: 'Overview',       path: OBFUSCATED_ADMIN_PATH,             icon: LayoutDashboard, exact: true },
    { label: 'My Profile',     path: `${OBFUSCATED_ADMIN_PATH}/my-profile`, icon: UserCircle },
    { label: 'Blogs & Media',  path: `${OBFUSCATED_ADMIN_PATH}/media`,  icon: FileText },
    { label: 'Publications',   path: `${OBFUSCATED_ADMIN_PATH}/publications`, icon: BookOpen },
  ];

  // ── Extra items visible only to Super Admin / Admin ───────────────────────
  const powerItems = [
    { label: 'Projects',       path: `${OBFUSCATED_ADMIN_PATH}/projects`, icon: FolderKanban },
    { label: 'Our Team',       path: `${OBFUSCATED_ADMIN_PATH}/team`,   icon: Users },
    { label: 'Sector Tools',   path: `${OBFUSCATED_ADMIN_PATH}/tools`,  icon: Wrench },
  ];

  // ── System Admin items (Super Admin / Admin only) ─────────────────────────
  const adminOnlyItems = [
    { label: 'Hero & Site Settings', path: `${OBFUSCATED_ADMIN_PATH}/settings`, icon: Sliders },
    { label: 'User Roles',          path: `${OBFUSCATED_ADMIN_PATH}/users`,   icon: UserCheck },
    { label: 'Audit Logs',          path: `${OBFUSCATED_ADMIN_PATH}/audit`,   icon: ShieldAlert },
    { label: 'System Health',       path: `${OBFUSCATED_ADMIN_PATH}/health`,  icon: Activity },
    { label: 'Emergency Banner',    path: `${OBFUSCATED_ADMIN_PATH}/banner`,  icon: Megaphone },
  ];

  const renderLink = (item: { label: string; path: string; icon: any; exact?: boolean; badge?: string }) => {
    const Icon = item.icon;
    const isActive = item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path) && item.path !== OBFUSCATED_ADMIN_PATH;

    const exactActive = item.exact && location.pathname === item.path;
    const active = item.exact ? exactActive : isActive;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={`sidebar-link ${active ? 'active' : ''}`}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="sidebar-link-icon" />
        {!collapsed && <span>{item.label}</span>}
        {!collapsed && item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
      </NavLink>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <img src={logoImg} alt="WenClims" style={{ height: '34px', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          {!collapsed && (
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-name">WenClims</div>
              <div className="sidebar-brand-sub">Admin Console</div>
            </div>
          )}
        </div>
        <button onClick={onToggle} className="sidebar-toggle-btn" title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-section-label">Main Management</div>}

        {/* Common items (all users) */}
        {commonItems.map(renderLink)}

        {/* Power users also see Projects, Our Team, Tools */}
        {isPowerUser && powerItems.map(renderLink)}

        {/* System Admin section */}
        {isPowerUser && (
          <>
            {!collapsed && <div className="sidebar-section-label">System Admin</div>}
            {adminOnlyItems.map(renderLink)}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <div
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C8C8, #1A3461)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}
            title={user?.name || 'User'}
          >
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#00C8C8', fontWeight: 700, textTransform: 'uppercase' }}>
                {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Member'}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={async () => { await logout(); window.location.href = '/admin/login'; }}
          className="sidebar-link sidebar-logout"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="sidebar-link-icon" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
