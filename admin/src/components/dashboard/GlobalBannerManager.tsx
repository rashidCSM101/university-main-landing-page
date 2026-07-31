import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Megaphone, Save, CheckCircle, Eye, AlertTriangle } from 'lucide-react';

export const GlobalBannerManager: React.FC = () => {
  const [banner, setBanner] = useState<any>({
    is_active: false,
    message: '🔴 Emergency Alert: Indus Basin Flash Flood & Precipitation Attribution Study 2026 Released',
    url: '/publications',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadBanner = async () => {
    setLoading(true);
    try {
      const data = await api.getEmergencyBanner();
      if (data) setBanner(data);
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanner();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await api.updateEmergencyBanner(banner);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to update emergency banner settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={28} color="#00C8C8" />
            <span>Global Website Emergency Alert Banner Control</span>
          </h1>
          <p className="page-subtitle">Super Admin console for broadcasting live emergency climate alerts across the top of the main website</p>
        </div>
      </div>

      {saveSuccess && (
        <div
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10B981',
            borderRadius: '12px',
            color: '#065F46',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CheckCircle size={22} color="#10B981" />
          <span>Emergency Alert Banner settings updated! Changes are live on the main website header.</span>
        </div>
      )}

      {/* Live Preview Box */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#0F284B', color: '#fff', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00C8C8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          <Eye size={16} /> Live Website Preview
        </div>

        {banner.is_active ? (
          <div style={{ padding: '0.75rem 1.25rem', background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{banner.message}</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
              Target: {banner.url}
            </span>
          </div>
        ) : (
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#94A3B8', fontSize: '0.875rem', textAlign: 'center' }}>
            Emergency Alert Banner is currently <strong>DISABLED</strong>.
          </div>
        )}
      </div>

      {/* Form Settings Panel */}
      <div className="glass-panel" style={{ padding: '2rem', background: '#fff', border: '2px solid #00C8C8', borderRadius: '20px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="checkbox"
              id="is_active_toggle"
              checked={banner.is_active}
              onChange={(e) => setBanner({ ...banner, is_active: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#00C8C8' }}
            />
            <label htmlFor="is_active_toggle" style={{ fontWeight: 700, color: '#0B1E3D', fontSize: '0.95rem', cursor: 'pointer' }}>
              Enable Emergency Announcement Banner on Main Website Header
            </label>
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>
              Announcement Message Text *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 🔴 Emergency Alert: Indus Basin Flash Flood Attribution Report Released"
              value={banner.message}
              onChange={(e) => setBanner({ ...banner, message: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>
              Action Link URL (Target Page)
            </label>
            <input
              type="text"
              placeholder="e.g. /publications or https://..."
              value={banner.url}
              onChange={(e) => setBanner({ ...banner, url: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" disabled={saving} className="btn-teal" style={{ padding: '0.75rem 2rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} />
              <span>{saving ? 'Updating Banner...' : 'Broadcast Banner Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
