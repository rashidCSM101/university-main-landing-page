import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useAuth, OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard Overview' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

        {/* Notifications Icon */}
        <button className="topbar-btn" title="Audit Notifications">
          <Bell size={18} />
        </button>

        {/* User Status & Bio Shortcut Badge */}
        <div
          onClick={() => navigate(`${OBFUSCATED_ADMIN_PATH}/team`)}
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
          title="Click to edit My Profile & Bio Settings"
        >
          <div style={{ textAlign: 'right' }}>
            <div className="topbar-user-name" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{user?.name || 'Dr. Rashid'}</span>
              <UserCheck size={13} color="#00C8C8" />
            </div>
            <div className="topbar-user-role" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
              <ShieldCheck size={12} color="#009A9A" />
              {user?.role === 'super_admin' ? 'Super Admin' : 'Editor'}
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
