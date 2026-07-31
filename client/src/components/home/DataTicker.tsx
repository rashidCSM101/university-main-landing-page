import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Thermometer, CloudRain } from 'lucide-react';

export const DataTicker: React.FC = () => {
  const highlights = [
    { label: 'Indus Basin Monsoon 2025 Study', val: '+28% Rainfall Intensity Attributed to Warming', icon: CloudRain, color: '#00C8C8' },
    { label: 'Sindh Heatwave Attribution', val: '5.2x Higher Probability Under Current Climate', icon: Thermometer, color: '#F59E0B' },
    { label: 'Glacial Lake Outburst Risk (GLOF)', val: '3,044 Glacial Lakes Monitored Across Northern Basins', icon: ShieldAlert, color: '#3B82F6' },
    { label: 'IPCC AR6 Region Sync', val: '100% Data Ensemble Verified for South Asia', icon: TrendingUp, color: '#10B981' },
  ];

  return (
    <div style={{ background: '#07152B', borderBottom: '1px solid rgba(0,200,200,0.15)', padding: '0.6rem 0', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,200,200,0.15)', color: '#00C8C8', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
            <Sparkles size={13} /> Live Attribution Feed
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  <Icon size={14} color={h.color} />
                  <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{h.label}:</span>
                  <span style={{ color: h.color, fontWeight: 700 }}>{h.val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
