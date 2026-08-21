import React, { useState, useEffect } from 'react';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  Lock,
  BarChart2,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

export const SiteSettingsManager: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hero Stat Bar Overrides & Defaults
  const [heroStats, setHeroStats] = useState({
    papers: '13+',
    projects: '8+',
    team: '19',
    funders: 'ADB · EU',
  });

  // General Settings
  const [settings, setSettings] = useState({
    siteName: 'WenClims — Weather & Climate Services',
    tagline: 'Attribution Science & Climate Forecasting in South Asia',
    contactEmail: 'wenclims@gmail.com',
    contactPhone: '+92-333-5672483',
    address: 'Islamabad / Quaid-i-Azam University',
    requireTotp: true,
    rateLimitMax: 5,
    sessionTimeoutMins: 15,
    enableMaintenanceMode: false,
    metaDescription: 'WenClims produces peer-reviewed climate attribution studies, flood forecasts, and meteorological sector tools.',
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api.getSiteSettings();
        if (data?.hero_stats) {
          setHeroStats((prev) => ({ ...prev, ...data.hero_stats }));
        }
        if (data?.general_settings) {
          setSettings((prev) => ({ ...prev, ...data.general_settings }));
        }
      } catch {
        // Fallback to default
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSiteSettings({
        hero_stats: heroStats,
        general_settings: settings,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      alert(err?.message || 'Failed to save settings');
    }
  };

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title">Site Settings &amp; Homepage Hero Control</h1>
          <p className="page-subtitle">Manage homepage hero statistics, major funders, platform contact info, and SEO</p>
        </div>

        <button onClick={handleSave} className="btn-teal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(0,200,200,0.12)', border: '1px solid #00C8C8', color: '#48b302', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} /> Settings &amp; Homepage Hero stats updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* ── PANEL 1: HOMEPAGE HERO STATS & MAJOR FUNDERS ── */}
        <div className="card" style={{ padding: '1.75rem', background: '#fff', border: '2px solid #00C8C8', borderRadius: '16px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#00C8C8,#1A3461)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>
                Homepage Hero Bottom Stat Bar &amp; Major Funders
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>
                Customize the live stats and major funder names displayed on the main homepage banner.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>
                Peer-Reviewed Papers Count
              </label>
              <input
                type="text"
                value={heroStats.papers}
                onChange={(e) => setHeroStats({ ...heroStats, papers: e.target.value })}
                className="input-field"
                placeholder="e.g. 13+"
                style={{ paddingLeft: '1rem', fontWeight: 700, color: '#00C8C8' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>
                Funded Projects Count
              </label>
              <input
                type="text"
                value={heroStats.projects}
                onChange={(e) => setHeroStats({ ...heroStats, projects: e.target.value })}
                className="input-field"
                placeholder="e.g. 8+"
                style={{ paddingLeft: '1rem', fontWeight: 700, color: '#00C8C8' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>
                Expert Team Members Count
              </label>
              <input
                type="text"
                value={heroStats.team}
                onChange={(e) => setHeroStats({ ...heroStats, team: e.target.value })}
                className="input-field"
                placeholder="e.g. 19"
                style={{ paddingLeft: '1rem', fontWeight: 700, color: '#00C8C8' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>
                Major Funders List (Text)
              </label>
              <input
                type="text"
                value={heroStats.funders}
                onChange={(e) => setHeroStats({ ...heroStats, funders: e.target.value })}
                className="input-field"
                placeholder="e.g. ADB · EU · World Bank"
                style={{ paddingLeft: '1rem', fontWeight: 700, color: '#1A3461' }}
              />
            </div>
          </div>
        </div>

        {/* ── PANEL 2: GENERAL PLATFORM IDENTITY ── */}
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

        {/* ── PANEL 3: SEO META ── */}
        <div className="card" style={{ padding: '1.75rem', background: '#fff' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#0B1E3D', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="#00C8C8" /> Default SEO &amp; Search Engine Meta
          </h3>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Default Meta Description</label>
            <textarea
              rows={5}
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
