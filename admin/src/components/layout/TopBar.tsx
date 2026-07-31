import React from 'react';
import { Bell, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title = 'Dashboard Overview' }) => {
  const { user } = useAuth();

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

        {/* User Status Badge */}
        <div className="topbar-user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="topbar-user-name">{user?.name || 'Dr. Rashid'}</div>
            <div className="topbar-user-role" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
              <ShieldCheck size={12} color="#009A9A" />
              {user?.role === 'super_admin' ? 'Super Admin' : 'Editor'}
            </div>
          </div>
          <div className="topbar-avatar">
            {user?.name?.charAt(0) || 'R'}
          </div>
        </div>
      </div>
    </header>
  );
};
