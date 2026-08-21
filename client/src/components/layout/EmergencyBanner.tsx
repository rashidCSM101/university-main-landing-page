import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, Sparkles, Megaphone, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchFromAPI } from '../../services/api';

export const EmergencyBanner: React.FC = () => {
  const [banner, setBanner] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchFromAPI<any>('/system/banner')
      .then((data) => {
        if (data && data.is_active) {
          setBanner(data);
        } else {
          setBanner(null);
        }
      })
      .catch(() => {
        setBanner(null);
      });
  }, []);

  useEffect(() => {
    if (banner && banner.is_active && !dismissed) {
      document.documentElement.style.setProperty('--banner-height', '38px');
    } else {
      document.documentElement.style.setProperty('--banner-height', '0px');
    }
  }, [banner, dismissed]);

  if (!banner || !banner.is_active || dismissed) return null;

  // Theme style presets
  const themes: Record<string, { bg: string; shadow: string; Icon: any }> = {
    red: {
      bg: 'linear-gradient(90deg, #DC2626 0%, #991B1B 100%)',
      shadow: '0 2px 10px rgba(220, 38, 38, 0.4)',
      Icon: AlertCircle,
    },
    amber: {
      bg: 'linear-gradient(90deg, #D97706 0%, #B45309 100%)',
      shadow: '0 2px 10px rgba(217, 119, 6, 0.4)',
      Icon: AlertTriangle,
    },
    teal: {
      bg: 'linear-gradient(90deg, #0D9488 0%, #0F766E 100%)',
      shadow: '0 2px 10px rgba(13, 148, 136, 0.4)',
      Icon: Sparkles,
    },
    blue: {
      bg: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)',
      shadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
      Icon: Megaphone,
    },
    green: {
      bg: 'linear-gradient(90deg, #16A34A 0%, #15803D 100%)',
      shadow: '0 2px 10px rgba(22, 163, 74, 0.4)',
      Icon: CheckCircle2,
    },
  };

  const currentTheme = themes[banner.theme_color || 'red'] || themes.red;
  const BannerIcon = currentTheme.Icon;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '38px',
        zIndex: 60,
        background: currentTheme.bg,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        boxShadow: currentTheme.shadow,
        transition: 'background 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <BannerIcon size={16} className="animate-pulse" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{banner.message}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {banner.url && (
            <Link
              to={banner.url}
              style={{
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.22)',
                padding: '0.15rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              <span>{banner.button_text || 'Read Full Report'}</span>
              <ChevronRight size={12} />
            </Link>
          )}

          <button
            onClick={() => setDismissed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.85)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
            }}
            title="Dismiss Announcement"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
