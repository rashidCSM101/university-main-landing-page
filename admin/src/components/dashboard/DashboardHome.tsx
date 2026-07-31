import React, { useEffect, useRef } from 'react';
import {
  FileText,
  BookOpen,
  FolderKanban,
  Wrench,
  TrendingUp,
  Plus,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import gsap from 'gsap';

export const DashboardHome: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-card', {
        opacity: 0,
        y: 25,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
      });
      gsap.from('.dashboard-widget', {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: 'Published Blogs & Media', value: '48', change: '+12% this month', isUp: true, icon: FileText, colorClass: 'stat-card-teal', iconBg: 'rgba(0,200,200,0.12)', iconColor: '#009A9A' },
    { label: 'Publications & Reports', value: '24', change: '+4 new research', isUp: true, icon: BookOpen, colorClass: 'stat-card-sky', iconBg: 'rgba(184,216,240,0.3)', iconColor: '#1A3461' },
    { label: 'Active Projects & Grants', value: '14', change: '2 ongoing regional', isUp: true, icon: FolderKanban, colorClass: 'stat-card-gold', iconBg: 'rgba(232,197,71,0.2)', iconColor: '#92700A' },
    { label: 'Sector Tools Active', value: '8', change: '100% operational', isUp: true, icon: Wrench, colorClass: 'stat-card-green', iconBg: 'rgba(34,197,94,0.12)', iconColor: '#16a34a' },
  ];

  const recentActivities = [
    { title: 'New Peer-Reviewed Paper Published', category: 'Publications', time: '10 mins ago', user: 'Dr. Rashid', status: 'published' },
    { title: 'Updated ADB Regional Climate Project', category: 'Projects', time: '1 hour ago', user: 'Editor User', status: 'updated' },
    { title: 'Drafted "Heatwave Vulnerability in Sindh"', category: 'Blogs', time: '3 hours ago', user: 'Dr. Rashid', status: 'draft' },
    { title: 'Added Meteorological Sector Tool', category: 'Tools', time: 'Yesterday', user: 'Dr. Rashid', status: 'published' },
    { title: 'Team Member Profile Updated', category: 'Team', time: '2 days ago', user: 'Super Admin', status: 'updated' },
  ];

  const quickActions = [
    { name: 'New Blog Post', icon: FileText, desc: 'Rich text article for Media Hub' },
    { name: 'Add Publication', icon: BookOpen, desc: 'Peer-reviewed research or policy report' },
    { name: 'Create Project', icon: FolderKanban, desc: 'Funder grant or climate initiative' },
    { name: 'Update Sector Tool', icon: Wrench, desc: 'Interactive climate model tool link' },
  ];

  return (
    <div ref={containerRef} className="admin-content">
      {/* Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #0B1E3D 0%, #1A3461 100%)',
          color: '#fff',
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(0,200,200,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#00C8C8', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
              <Sparkles size={14} /> Control Dashboard
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Welcome back, Dr. Rashid 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '600px' }}>
              All climate research feeds, media publications, and sector tools are currently synced and operational.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-teal" style={{ padding: '0.6rem 1.1rem' }}>
              <Plus size={16} /> Quick Publish
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`stat-card ${stat.colorClass}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stat-icon-wrap" style={{ background: stat.iconBg }}>
                  <Icon size={24} color={stat.iconColor} />
                </div>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>Live</span>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.isUp ? 'up' : 'down'}`}>
                <TrendingUp size={13} /> {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Quick Actions & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Quick Actions Panel */}
        <div className="card dashboard-widget" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#0B1E3D', margin: 0 }}>
                Content Management
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>Create or update website sections</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {quickActions.map((action, i) => {
              const ActionIcon = action.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F4',
                    background: '#F9FBFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00C8C8';
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F4';
                    e.currentTarget.style.background = '#F9FBFF';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(11,30,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', color: '#0B1E3D' }}>
                    <ActionIcon size={20} />
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B1E3D' }}>{action.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7A95', marginTop: '0.2rem' }}>{action.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit & Activity Log */}
        <div className="card dashboard-widget" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', color: '#0B1E3D', margin: 0 }}>
                Recent Platform Activity
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>Audit trail & content status updates</p>
            </div>
            <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              View All Log <ArrowUpRight size={13} />
            </button>
          </div>

          <div>
            {recentActivities.map((act, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E2A3B' }}>{act.title}</span>
                    <span className={`badge ${act.status === 'published' ? 'badge-teal' : act.status === 'draft' ? 'badge-gold' : 'badge-navy'}`}>
                      {act.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#6B7A95', marginTop: '0.25rem' }}>
                    <span>{act.category}</span>
                    <span>•</span>
                    <span>{act.user}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {act.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
