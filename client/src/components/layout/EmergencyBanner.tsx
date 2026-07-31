import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmergencyBanner: React.FC = () => {
  const [banner, setBanner] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/v1/system/banner')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.is_active) {
          setBanner(data);
        } else {
          setBanner(null);
        }
      })
      .catch(() => {
        // If API unreachable, default banner off
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

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '38px',
        zIndex: 60,
        background: 'linear-gradient(90deg, #DC2626 0%, #991B1B 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        boxShadow: '0 2px 10px rgba(220, 38, 38, 0.4)',
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
          <AlertCircle size={16} className="animate-pulse" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{banner.message}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {banner.url && (
            <Link
              to={banner.url}
              style={{
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.15rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              <span>Read Full Report</span>
              <ChevronRight size={12} />
            </Link>
          )}

          <button
            onClick={() => setDismissed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
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
