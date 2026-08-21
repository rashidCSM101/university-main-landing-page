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
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const SiteSettingsManager: React.FC = () => {
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // 4-Slot Customizable Homepage Hero Stat Cards
  const [heroStatsList, setHeroStatsList] = useState([
    { value: '23', label: 'Publications' },
    { value: '25+', label: 'Blogs' },
    { value: '30+', label: 'Excerpts' },
    { value: '20+', label: 'Documentaries & Talk shows' },
  ]);

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
        if (data?.hero_stats_list && Array.isArray(data.hero_stats_list) && data.hero_stats_list.length > 0) {
          setHeroStatsList(data.hero_stats_list);
        } else if (data?.hero_stats) {
          setHeroStatsList([
            { value: data.hero_stats.papers || '23', label: 'Publications' },
            { value: data.hero_stats.projects || '25+', label: 'Blogs' },
            { value: data.hero_stats.team || '30+', label: 'Excerpts' },
            { value: data.hero_stats.funders || '20+', label: 'Documentaries & Talk shows' },
          ]);
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

  const handleStatChange = (index: number, field: 'value' | 'label', val: string) => {
    const updated = [...heroStatsList];
    updated[index] = { ...updated[index], [field]: val };
    setHeroStatsList(updated);
  };

  // Helper to increment numerical values (handles numbers with or without '+')
  const handleAdjustValue = (index: number, delta: number) => {
    const updated = [...heroStatsList];
    const currentVal = updated[index].value;
    const hasPlus = currentVal.includes('+');
    const numericPart = parseInt(currentVal.replace(/[^0-9]/g, ''), 10);

    if (!isNaN(numericPart)) {
      const nextNum = Math.max(0, numericPart + delta);
      updated[index].value = hasPlus ? `${nextNum}+` : `${nextNum}`;
      setHeroStatsList(updated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSiteSettings({
        hero_stats_list: heroStatsList,
        general_settings: settings,
      });
      setSaved(true);
      toast.success('Site settings and hero stats saved successfully!');
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      toast.error('Failed to save settings', err?.message);
    }
  };

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title">Site Settings &amp; Homepage Hero Control</h1>
          <p className="page-subtitle">Manage homepage hero statistics (Publications, Blogs, Excerpts, Documentaries &amp; Talk Shows), contact info, and SEO</p>
        </div>

        <button onClick={handleSave} className="btn-teal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(0,200,200,0.12)', border: '1.5px solid #00C8C8', color: '#065F46', padding: '0.875rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <CheckCircle2 size={20} color="#00C8C8" /> Homepage Hero statistics &amp; platform settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* ── PANEL 1: HOMEPAGE HERO STATS (4-SLOT CONFIGURATOR) ── */}
        <div className="card" style={{ padding: '1.75rem', background: '#fff', border: '2px solid #00C8C8', borderRadius: '20px', gridColumn: '1 / -1', boxShadow: '0 8px 30px rgba(0,200,200,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #00C8C8 0%, #1A3461 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,200,200,0.3)' }}>
                <BarChart2 size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
                  Homepage Hero Bottom Stat Bar (4 Cards)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>
                  Customize the counts, numbers, and labels shown on the homepage slider bottom bar.
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() =>
                  setHeroStatsList([
                    { value: '23', label: 'Publications' },
                    { value: '25+', label: 'Blogs' },
                    { value: '30+', label: 'Excerpts' },
                    { value: '20+', label: 'Documentaries & Talk shows' },
                  ])
                }
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: '1px solid #00C8C8', background: '#F0FDFA', color: '#00A3A3', cursor: 'pointer' }}
              >
                Media &amp; Publications Preset
              </button>
              <button
                type="button"
                onClick={() =>
                  setHeroStatsList([
                    { value: '13+', label: 'Peer-Reviewed Papers' },
                    { value: '8+', label: 'Funded Projects' },
                    { value: '19', label: 'Expert Team Members' },
                    { value: 'ADB · EU', label: 'Major Funders' },
                  ])
                }
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#475569', cursor: 'pointer' }}
              >
                Original Impact Preset
              </button>
            </div>
          </div>

          {/* ── LIVE HERO PREVIEW STRIP ── */}
          <div style={{ background: '#0B1E3D', borderRadius: '14px', padding: '1.25rem 1.75rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-around', border: '1px solid #1E3A8A' }}>
            {heroStatsList.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: i === 3 ? '#FFD700' : '#ffffff', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                  {stat.value || '0'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: '2px' }}>
                  {stat.label || 'Label'}
                </div>
              </div>
            ))}
          </div>

          {/* ── 4 STAT CARDS EDITORS WITH INCREMENT / DECREMENT BUTTONS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {heroStatsList.map((stat, index) => (
              <div
                key={index}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#00A3A3', letterSpacing: '0.05em' }}>
                    Stat Card #{index + 1}
                  </span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue(index, -1)}
                      style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
                      title="Decrease value by 1"
                    >
                      <Minus size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustValue(index, 1)}
                      style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
                      title="Increase value by 1"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.25rem', display: 'block' }}>
                    Value / Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    className="input-field"
                    placeholder="e.g. 23 or 25+"
                    style={{ paddingLeft: '0.85rem', fontWeight: 800, color: '#0B1E3D', fontSize: '1.1rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.25rem', display: 'block' }}>
                    Card Label Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    className="input-field"
                    placeholder="e.g. Publications"
                    style={{ paddingLeft: '0.85rem', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL 2: GENERAL PLATFORM IDENTITY ── */}
        <div className="card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '18px' }}>
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
        <div className="card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '18px' }}>
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
