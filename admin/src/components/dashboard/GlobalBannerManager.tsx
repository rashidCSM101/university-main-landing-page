import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Megaphone,
  Save,
  CheckCircle,
  Eye,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Palette,
} from 'lucide-react';

export const GlobalBannerManager: React.FC = () => {
  const [banner, setBanner] = useState<any>({
    is_active: false,
    theme_color: 'red',
    message: '🔴 Emergency Alert: Indus Basin Flash Flood & Precipitation Attribution Study 2026 Released',
    url: '/publications',
    button_text: 'Read Full Report',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadBanner = async () => {
    setLoading(true);
    try {
      const data = await api.getEmergencyBanner();
      if (data) {
        setBanner({
          is_active: Boolean(data.is_active),
          theme_color: data.theme_color || 'red',
          message: data.message || '🔴 Emergency Alert: Climate Report Released',
          url: data.url || '/publications',
          button_text: data.button_text || 'Read Full Report',
        });
      }
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
      alert(err?.message || 'Failed to update banner settings');
    } finally {
      setSaving(false);
    }
  };

  // Color theme presets
  const themePresets = [
    {
      id: 'red',
      label: 'Critical Emergency (Red)',
      desc: 'Severe flash floods, heatwaves, extreme weather alerts',
      bg: 'linear-gradient(90deg, #DC2626 0%, #991B1B 100%)',
      border: '#DC2626',
      icon: AlertCircle,
      sampleEmoji: '🔴',
    },
    {
      id: 'amber',
      label: 'Caution / Advisory (Amber / Orange)',
      desc: 'Meteorological watch, air quality alert, monsoon advisory',
      bg: 'linear-gradient(90deg, #D97706 0%, #B45309 100%)',
      border: '#D97706',
      icon: AlertTriangle,
      sampleEmoji: '⚠️',
    },
    {
      id: 'teal',
      label: 'New Publication / Research (Teal)',
      desc: 'New peer-reviewed study, attribution report, data release',
      bg: 'linear-gradient(90deg, #0D9488 0%, #0F766E 100%)',
      border: '#0D9488',
      icon: Sparkles,
      sampleEmoji: '🔬',
    },
    {
      id: 'blue',
      label: 'General Announcement (Blue / Indigo)',
      desc: 'Conferences, upcoming webinars, grant opportunities',
      bg: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)',
      border: '#2563EB',
      icon: Megaphone,
      sampleEmoji: '📢',
    },
    {
      id: 'green',
      label: 'Climate Initiative (Emerald Green)',
      desc: 'Renewable energy milestones, clean water partnerships',
      bg: 'linear-gradient(90deg, #16A34A 0%, #15803D 100%)',
      border: '#16A34A',
      icon: CheckCircle2,
      sampleEmoji: '🌱',
    },
  ];

  const activeTheme = themePresets.find((t) => t.id === (banner.theme_color || 'red')) || themePresets[0];
  const PreviewIcon = activeTheme.icon;

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={28} color="#00C8C8" />
            <span>Global Website Announcement &amp; Alert Banner</span>
          </h1>
          <p className="page-subtitle">
            Super Admin console for broadcasting emergency alerts, caution advisories, or new publication highlights across the main website header.
          </p>
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
          <span>Banner settings updated and broadcasted! Changes are live on the main website header.</span>
        </div>
      )}

      {/* ── LIVE WEBSITE PREVIEW ── */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#0B1E3D', color: '#fff', borderRadius: '18px', border: '1px solid #1E3A8A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00C8C8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
          <Eye size={16} /> Live Website Header Preview
        </div>

        {banner.is_active ? (
          <div
            style={{
              padding: '0.65rem 1.25rem',
              background: activeTheme.bg,
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PreviewIcon size={16} />
              <span>{banner.message}</span>
            </div>
            {banner.url && (
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.25)', padding: '0.2rem 0.65rem', borderRadius: '999px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {banner.button_text || 'Read Full Report'} <ChevronRight size={12} />
              </span>
            )}
          </div>
        ) : (
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#94A3B8', fontSize: '0.875rem', textAlign: 'center' }}>
            Announcement Banner is currently <strong>DISABLED</strong>.
          </div>
        )}
      </div>

      {/* ── FORM SETTINGS PANEL ── */}
      <div className="glass-panel" style={{ padding: '2rem', background: '#fff', border: '2px solid #00C8C8', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,200,200,0.08)' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Active Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: '#F0FDFA', borderRadius: '14px', border: '1.5px solid #00C8C8' }}>
            <input
              type="checkbox"
              id="is_active_toggle"
              checked={banner.is_active}
              onChange={(e) => setBanner({ ...banner, is_active: e.target.checked })}
              style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#00C8C8' }}
            />
            <div>
              <label htmlFor="is_active_toggle" style={{ fontWeight: 800, color: '#0B1E3D', fontSize: '1rem', cursor: 'pointer', display: 'block' }}>
                Broadcast Announcement Banner on Website Header
              </label>
              <span style={{ fontSize: '0.78rem', color: '#6B7A95' }}>
                When enabled, this banner appears pinned to the top of every page on the public website.
              </span>
            </div>
          </div>

          {/* ── COLOR THEME SELECTOR ── */}
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1E3D', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Palette size={18} color="#00C8C8" />
              <span>Select Alert Color &amp; Category Theme</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              {themePresets.map((preset) => {
                const isSelected = (banner.theme_color || 'red') === preset.id;
                const PresetIcon = preset.icon;

                return (
                  <div
                    key={preset.id}
                    onClick={() => setBanner({ ...banner, theme_color: preset.id })}
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      border: isSelected ? `2.5px solid ${preset.border}` : '1.5px solid #E2E8F0',
                      background: isSelected ? '#FAF5FF' : '#F8FAFC',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected ? `0 4px 18px ${preset.border}35` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: preset.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                        }}
                      >
                        <PresetIcon size={16} />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0B1E3D' }}>
                        {preset.label.split('(')[0]}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B', lineHeight: 1.35 }}>
                      {preset.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Announcement Text */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>
              Announcement Message Text *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ⚠️ Monsoon Alert: Extreme Precipitation Forecast for Southern Sindh"
              value={banner.message}
              onChange={(e) => setBanner({ ...banner, message: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* Target URL & Button Text in 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>
                Action Link URL (Target Page)
              </label>
              <input
                type="text"
                placeholder="e.g. /publications/research or https://..."
                value={banner.url}
                onChange={(e) => setBanner({ ...banner, url: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>
                Button Label
              </label>
              <input
                type="text"
                placeholder="e.g. Read Full Report"
                value={banner.button_text}
                onChange={(e) => setBanner({ ...banner, button_text: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-teal"
              style={{ padding: '0.75rem 2rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
            >
              <Save size={18} />
              <span>{saving ? 'Updating Banner...' : 'Broadcast Banner Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
