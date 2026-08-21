import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  ShieldAlert,
  KeyRound,
  Megaphone,
  UserPlus,
  FileText,
  CheckCheck,
  Clock,
  ChevronRight,
  ChevronDown,
  X,
  Sliders,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react';
import { useAuth, OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';
import { api } from '../../services/api';

interface TopBarProps {
  title?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'security' | 'user' | 'system' | 'content';
  read: boolean;
  link?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard Overview' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Hero Stats Updated',
      desc: 'Publications & media counts updated from Site Settings',
      time: 'Just now',
      type: 'system',
      read: false,
      link: `${OBFUSCATED_ADMIN_PATH}/settings`,
    },
    {
      id: '2',
      title: 'Emergency Banner Active',
      desc: 'Header alert broadcast is currently live on website',
      time: '15m ago',
      type: 'system',
      read: false,
      link: `${OBFUSCATED_ADMIN_PATH}/banner`,
    },
    {
      id: '3',
      title: 'Secure Session Authenticated',
      desc: `Logged in as ${user?.role === 'super_admin' ? 'Super Admin' : 'Admin'} (${user?.name || 'Administrator'})`,
      time: '1h ago',
      type: 'security',
      read: false,
      link: `${OBFUSCATED_ADMIN_PATH}/audit`,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real audit logs & pending member posts for Admins
  useEffect(() => {
    const isPowerUser = user?.role === 'super_admin' || user?.role === 'admin';
    if (isPowerUser) {
      Promise.allSettled([
        api.getAdminMedia({ status: 'pending' }),
        api.getAdminPublications(),
        api.getAuditLogs({ action: '' }),
      ]).then(([mediaRes, pubsRes, logsRes]) => {
        const list: NotificationItem[] = [];

        // 1. Pending Media Submissions from members
        if (mediaRes.status === 'fulfilled' && Array.isArray(mediaRes.value)) {
          const pendingMedia = mediaRes.value.filter((m: any) => m.status === 'pending');
          pendingMedia.forEach((pm: any) => {
            list.push({
              id: `pending-media-${pm.id}`,
              title: `Pending Post Approval`,
              desc: `"${pm.title}" submitted by ${pm.author_name || 'Member'}. Click to review.`,
              time: 'Requires Review',
              type: 'content',
              read: false,
              link: `${OBFUSCATED_ADMIN_PATH}/media`,
            });
          });
        }

        // 2. Pending Publications Submissions from members
        if (pubsRes.status === 'fulfilled' && Array.isArray(pubsRes.value)) {
          const pendingPubs = pubsRes.value.filter((p: any) => p.status === 'pending');
          pendingPubs.forEach((pp: any) => {
            list.push({
              id: `pending-pub-${pp.id}`,
              title: `Pending Paper Approval`,
              desc: `"${pp.title}" submitted by ${pp.author_name || 'Author'}. Click to review.`,
              time: 'Requires Review',
              type: 'content',
              read: false,
              link: `${OBFUSCATED_ADMIN_PATH}/publications`,
            });
          });
        }

        // 3. System Audit Logs
        if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value) && logsRes.value.length > 0) {
          const mapped: NotificationItem[] = logsRes.value.slice(0, 5).map((log, idx) => ({
            id: log.id?.toString() || `audit-${idx}`,
            title: (log.action || 'System Event').replace(/_/g, ' '),
            desc: `${log.user_name || 'Admin'} performed ${log.action} on ${log.target_type || 'system'}`,
            time: log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
            type: log.action.includes('PASSWORD') || log.action.includes('ROLE') ? 'security' : log.action.includes('USER') ? 'user' : 'system',
            read: true,
            link: `${OBFUSCATED_ADMIN_PATH}/audit`,
          }));
          list.push(...mapped);
        }

        if (list.length > 0) {
          setNotifications(list);
        }
      });
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <ShieldAlert size={16} color="#7C3AED" />;
      case 'user':
        return <UserPlus size={16} color="#00C8C8" />;
      case 'content':
        return <FileText size={16} color="#F59E0B" />;
      default:
        return <Sliders size={16} color="#00A3A3" />;
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <header className="topbar">
      {/* ── LEFT: PAGE TITLE & BREADCRUMB ── */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <h1 className="topbar-title" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
          {title}
        </h1>

        <div className="topbar-status-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0,200,200,0.1)', border: '1px solid rgba(0,200,200,0.25)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', color: '#00A3A3', fontWeight: 700, letterSpacing: '0.04em' }}>
          <Sparkles size={11} color="#00C8C8" />
          <span>SECURE NODE</span>
        </div>
      </div>

      {/* ── RIGHT: SEARCH, NOTIFICATIONS & USER PROFILE DROPDOWN ── */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        
        {/* Global Search Bar */}
        <div className="topbar-search" style={{ position: 'relative' }}>
          <Search size={15} className="topbar-search-icon" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search papers, blogs..."
            className="topbar-search-input"
            style={{
              paddingLeft: '2.25rem',
              paddingRight: '1rem',
              height: '38px',
              borderRadius: '999px',
              border: '1.5px solid #E2E8F0',
              background: '#F8FAFC',
              fontSize: '0.825rem',
              color: '#0B1E3D',
              width: '220px',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
          />
        </div>

        {/* ── NOTIFICATION BELL DROPDOWN ── */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="topbar-btn"
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: showNotifications ? 'rgba(0,200,200,0.15)' : '#F8FAFC',
              border: showNotifications ? '1.5px solid #00C8C8' : '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: showNotifications ? '#00A3A3' : '#64748B',
              transition: 'all 0.2s ease',
            }}
            title="Notifications & System Alerts"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Modal */}
          {showNotifications && (
            <div
              className="notifications-dropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 0.6rem)',
                width: '360px',
                background: '#ffffff',
                borderRadius: '18px',
                boxShadow: '0 20px 50px rgba(11,30,61,0.18), 0 0 0 1px rgba(0,200,200,0.12)',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'topbarFadeIn 0.2s ease-out',
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FAFCFE',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0B1E3D' }}>
                    Notifications
                  </div>
                  {unreadCount > 0 && (
                    <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#00A3A3',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                    No recent notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notification-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => {
                        if (n.link) navigate(n.link);
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '0.875rem 1.25rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        borderBottom: '1px solid #f8fafc',
                        cursor: 'pointer',
                        background: !n.read ? 'rgba(0, 200, 200, 0.04)' : '#fff',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {getNotificationIcon(n.type)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0B1E3D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {n.title}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Clock size={10} />
                            <span>{n.time}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {n.desc}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div
                onClick={() => {
                  navigate(`${OBFUSCATED_ADMIN_PATH}/audit`);
                  setShowNotifications(false);
                }}
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  background: '#F8FAFC',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#00A3A3',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>View Full System Audit Trail</span>
                <ChevronRight size={13} />
              </div>
            </div>
          )}
        </div>

        {/* ── USER PROFILE & LOGOUT DROPDOWN ── */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <div
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="topbar-user-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              paddingLeft: '0.85rem',
              paddingRight: '0.6rem',
              paddingTop: '0.35rem',
              paddingBottom: '0.35rem',
              borderRadius: '999px',
              cursor: 'pointer',
              background: showUserMenu ? 'rgba(0,200,200,0.12)' : 'rgba(0,200,200,0.06)',
              border: showUserMenu ? '1.5px solid #00C8C8' : '1px solid rgba(0,200,200,0.22)',
              transition: 'all 0.2s ease',
              userSelect: 'none',
            }}
            title="Click to view Profile & Sign Out options"
          >
            <div style={{ textAlign: 'right' }}>
              <div className="topbar-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{user?.name || 'Dr. Rashid'}</span>
                <UserCheck size={13} color="#00C8C8" />
              </div>
              <div className="topbar-user-role" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                <ShieldCheck size={12} color="#009A9A" />
                {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Executive Admin' : 'Member'}
              </div>
            </div>

            {/* Avatar Pill */}
            <div className="topbar-avatar" style={{ background: 'linear-gradient(135deg, #00C8C8, #0B1E3D)', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>
              {user?.name?.charAt(0) || 'R'}
            </div>

            <ChevronDown size={14} color="#64748B" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
          </div>

          {/* User Account Dropdown Modal */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 0.6rem)',
                width: '280px',
                background: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(11,30,61,0.18), 0 0 0 1px rgba(0,200,200,0.12)',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'topbarFadeIn 0.2s ease-out',
              }}
            >
              {/* User Identity Header */}
              <div
                style={{
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00C8C8 0%, #0B1E3D 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,200,200,0.3)',
                    flexShrink: 0,
                  }}
                >
                  {user?.name?.charAt(0) || 'R'}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0B1E3D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name || 'Administrator'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email || 'admin@wenclims.org'}
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00A3A3', background: 'rgba(0,200,200,0.12)', padding: '0.15rem 0.55rem', borderRadius: '999px', textTransform: 'uppercase' }}>
                      {user?.role?.replace('_', ' ') || 'Admin'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div style={{ padding: '0.5rem' }}>
                <div
                  onClick={() => {
                    navigate(`${OBFUSCATED_ADMIN_PATH}/my-profile`);
                    setShowUserMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.875rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#1E293B',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <User size={16} color="#00C8C8" />
                  <span>My Profile &amp; Bio</span>
                </div>

                <div
                  onClick={() => {
                    navigate(`${OBFUSCATED_ADMIN_PATH}/my-profile`);
                    setShowUserMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.875rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#1E293B',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <KeyRound size={16} color="#F59E0B" />
                  <span>Password &amp; Security</span>
                </div>

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.875rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#1E293B',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <ExternalLink size={16} color="#64748B" />
                  <span>View Public Website</span>
                </a>
              </div>

              {/* Divider & Sign Out Button */}
              <div style={{ borderTop: '1px solid #E2E8F0', padding: '0.5rem' }}>
                <div
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.875rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#DC2626',
                    cursor: 'pointer',
                    background: 'rgba(239, 68, 68, 0.05)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)')}
                >
                  <LogOut size={16} color="#DC2626" />
                  <span>Sign Out of Console</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
