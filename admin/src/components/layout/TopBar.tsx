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
  X,
  Sliders,
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real audit logs if Super Admin
  useEffect(() => {
    if (user?.role === 'super_admin') {
      api.getAuditLogs({ action: '' })
        .then((logs: any[]) => {
          if (Array.isArray(logs) && logs.length > 0) {
            const mapped: NotificationItem[] = logs.slice(0, 5).map((log, idx) => ({
              id: log.id?.toString() || idx.toString(),
              title: (log.action || 'System Event').replace(/_/g, ' '),
              desc: `${log.user_name || 'Admin'} performed ${log.action} on ${log.target_type || 'system'}`,
              time: log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
              type: log.action.includes('PASSWORD') || log.action.includes('ROLE') ? 'security' : log.action.includes('USER') ? 'user' : 'system',
              read: idx > 1,
              link: `${OBFUSCATED_ADMIN_PATH}/audit`,
            }));
            setNotifications(mapped);
          }
        })
        .catch(() => {});
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
        return <FileText size={16} color="#2563EB" />;
      default:
        return <Sliders size={16} color="#00A3A3" />;
    }
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 className="topbar-title">{title}</h2>
        <span className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <Sparkles size={11} /> Secure Node
        </span>
      </div>

      <div className="topbar-right">
        {/* Global Admin Search Input */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={15} color="#9AA5BC" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search papers, blogs..."
            style={{
              width: '100%',
              padding: '0.4rem 0.75rem 0.4rem 2.2rem',
              fontSize: '0.8rem',
              borderRadius: '999px',
              background: '#F0F4FA',
              border: '1px solid #E2E8F4',
              outline: 'none',
            }}
          />
        </div>

        {/* ── NOTIFICATIONS BELL & DROPDOWN ── */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-btn"
            title="System &amp; Audit Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#00C8C8',
                  boxShadow: '0 0 8px #00C8C8',
                  border: '1.5px solid #ffffff',
                }}
              />
            )}
          </button>

          {/* Floating Dropdown Modal */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <div
                style={{
                  padding: '1.1rem 1.25rem',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={16} color="#00C8C8" />
                  <span style={{ fontWeight: 800, color: '#0B1E3D', fontSize: '0.925rem' }}>
                    Notifications &amp; Activity
                  </span>
                  {unreadCount > 0 && (
                    <span style={{ background: '#00C8C8', color: '#0B1E3D', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: '999px' }}>
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

                      {!n.read && <div className="notification-dot" />}
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

        {/* ── USER INFO BADGE SHORTCUT ── */}
        <div
          onClick={() => navigate(`${OBFUSCATED_ADMIN_PATH}/my-profile`)}
          className="topbar-user-info"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            paddingLeft: '0.75rem',
            paddingRight: '0.5rem',
            paddingTop: '0.35rem',
            paddingBottom: '0.35rem',
            borderRadius: '999px',
            cursor: 'pointer',
            background: 'rgba(0,200,200,0.06)',
            border: '1px solid rgba(0,200,200,0.2)',
            transition: 'all 0.2s ease',
          }}
          title="Click to edit My Profile &amp; Bio Settings"
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
          <div className="topbar-avatar" style={{ background: 'linear-gradient(135deg, #00C8C8, #0B1E3D)', color: '#fff', fontWeight: 700 }}>
            {user?.name?.charAt(0) || 'R'}
          </div>
        </div>
      </div>
    </header>
  );
};
