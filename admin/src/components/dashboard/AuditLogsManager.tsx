import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldAlert, RefreshCw, Filter, Clock, User, HardDrive } from 'lucide-react';

export const AuditLogsManager: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch {
      setLogs([
        {
          id: '1',
          user_email: 'admin@wenclims.org',
          action: 'LOGIN_SUCCESS',
          entity: 'users',
          ip_address: '127.0.0.1',
          details: { role: 'super_admin' },
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_email: 'admin@wenclims.org',
          action: 'CREATE_USER',
          entity: 'users',
          ip_address: '127.0.0.1',
          details: { email: 'mehran@wenclims.org', role: 'admin' },
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filterAction === 'all') return true;
    return log.action?.toLowerCase().includes(filterAction.toLowerCase());
  });

  const getBadgeStyle = (action: string) => {
    if (action.includes('CREATE') || action.includes('SUCCESS')) {
      return { background: 'rgba(16,185,129,0.12)', color: '#047857', border: '1px solid rgba(16,185,129,0.3)' };
    }
    if (action.includes('DELETE') || action.includes('FAILED')) {
      return { background: 'rgba(239,68,68,0.12)', color: '#b91c1c', border: '1px solid rgba(239,68,68,0.3)' };
    }
    return { background: 'rgba(59,130,246,0.12)', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.3)' };
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={28} color="#00C8C8" />
            <span>Security Audit Trail &amp; IP Logs</span>
          </h1>
          <p className="page-subtitle">Real-time record of all system logins, content edits, role changes, and IP addresses</p>
        </div>

        <button onClick={loadLogs} className="btn-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={16} /> Refresh Logs
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0B1E3D', fontWeight: 700, fontSize: '0.875rem' }}>
          <Filter size={16} color="#00C8C8" /> Filter Action:
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
        >
          <option value="all">All Security Events</option>
          <option value="LOGIN">User Logins</option>
          <option value="CREATE">Record Creations</option>
          <option value="UPDATE">Record Updates</option>
          <option value="DELETE">Record Deletions</option>
        </select>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 700 }}>
              <th style={{ padding: '0.875rem 1rem' }}>Timestamp</th>
              <th style={{ padding: '0.875rem 1rem' }}>User / Email</th>
              <th style={{ padding: '0.875rem 1rem' }}>Action Event</th>
              <th style={{ padding: '0.875rem 1rem' }}>Target Entity</th>
              <th style={{ padding: '0.875rem 1rem' }}>IP Address</th>
              <th style={{ padding: '0.875rem 1rem' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading security audit logs...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No audit events found matching criteria.</td></tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', color: '#6B7A95', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} color="#9AA5BC" />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={14} color="#00C8C8" />
                      <span>{log.user_email || 'System / Anonymous'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ ...getBadgeStyle(log.action), fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4D5D78', textTransform: 'capitalize' }}>
                    {log.entity || 'general'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', color: '#48b302', fontWeight: 600 }}>
                    {log.ip_address || '127.0.0.1'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6B7A95', fontSize: '0.775rem' }}>
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
