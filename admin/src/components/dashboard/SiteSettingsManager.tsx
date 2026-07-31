import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  Lock,
  Radio,
} from 'lucide-react';

export const SiteSettingsManager: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'WenClims — Weather & Climate Services',
    tagline: 'Attribution Science & Climate Forecasting in South Asia',
    contactEmail: 'wenclims@gmail.com',
    contactPhone: '+92-333-5672483',
    address: ' Islamabad / Quaid-i-Azam University',
    requireTotp: true,
    rateLimitMax: 5,
    sessionTimeoutMins: 15,
    enableMaintenanceMode: false,
    metaDescription: 'WenClims produces peer-reviewed climate attribution studies, flood forecasts, and meteorological sector tools.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title">Site Settings &amp; Security Policy</h1>
          <p className="page-subtitle">Manage platform defaults, contact info, security parameters, and SEO</p>
        </div>

        <button onClick={handleSave} className="btn-teal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(0,200,200,0.12)', border: '1px solid #00C8C8', color: '#008B8B', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} /> Settings successfully updated and applied!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Panel 1: General Info */}
        <div className="card" style={{ padding: '1.75rem', background: '#fff' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#0B1E3D', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="#00C8C8" /> General Platform Identity
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Website Title</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Platform Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Contact Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9AA5BC" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Contact Phone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#9AA5BC" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Headquarters Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#9AA5BC" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Security & Authentication Policy */}
        <div className="card" style={{ padding: '1.75rem', background: '#fff' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#0B1E3D', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#00C8C8" /> Security &amp; Access Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B1E3D' }}>Require TOTP 2FA for Super Admin</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7A95', marginTop: '0.1rem' }}>Enforces Google Authenticator 2FA at login</div>
              </div>
              <input
                type="checkbox"
                checked={settings.requireTotp}
                onChange={(e) => setSettings({ ...settings, requireTotp: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#00C8C8', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Max Failed Login Attempts Limit</label>
              <input
                type="number"
                value={settings.rateLimitMax}
                onChange={(e) => setSettings({ ...settings, rateLimitMax: parseInt(e.target.value) || 5 })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
              <span style={{ fontSize: '0.725rem', color: '#6B7A95', marginTop: '0.2rem', display: 'block' }}>Rate limits login requests per 15-minute window</span>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>JWT Access Token Expiry (Minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeoutMins}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMins: parseInt(e.target.value) || 15 })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div style={{ padding: '1rem', background: '#FFF5F5', borderRadius: '12px', border: '1px solid #FECDD3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Radio size={15} color="#dc2626" /> Public Website Maintenance Mode
                </div>
                <div style={{ fontSize: '0.75rem', color: '#B91C1C', marginTop: '0.1rem' }}>Displays maintenance banner on public site</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableMaintenanceMode}
                onChange={(e) => setSettings({ ...settings, enableMaintenanceMode: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#dc2626', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Panel 3: SEO & Search Engines */}
        <div className="card" style={{ padding: '1.75rem', background: '#fff', gridColumn: '1 / -1' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#0B1E3D', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="#00C8C8" /> Default SEO &amp; Search Engine Meta
          </h3>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Default Meta Description</label>
            <textarea
              rows={3}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem', height: 'auto' }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
