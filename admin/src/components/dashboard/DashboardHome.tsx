import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  BarChart3,
  PieChart,
  UserCheck,
} from 'lucide-react';
import gsap from 'gsap';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

import { OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const xyChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-card', {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
      });
      gsap.from('.dashboard-widget', {
        opacity: 0,
        y: 25,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // amCharts 5 Setup: Monthly Reader & Attribution Analytics Chart
  useEffect(() => {
    if (!xyChartRef.current) return;

    const root = am5.Root.new(xyChartRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      })
    );

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'month',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const data = [
      { month: 'Jan', readers: 1200, publications: 400 },
      { month: 'Feb', readers: 1900, publications: 650 },
      { month: 'Mar', readers: 2400, publications: 900 },
      { month: 'Apr', readers: 3100, publications: 1200 },
      { month: 'May', readers: 4800, publications: 1800 },
      { month: 'Jun', readers: 5200, publications: 2200 },
      { month: 'Jul', readers: 6900, publications: 2850 },
    ];

    xAxis.data.setAll(data);

    const series1 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'Website Readers',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'readers',
        categoryXField: 'month',
        stroke: am5.color('#00C8C8'),
        tooltip: am5.Tooltip.new(root, {
          labelText: '[bold]{name}[/]: {valueY}',
        }),
      })
    );

    series1.strokes.template.setAll({ strokeWidth: 3 });
    series1.fills.template.setAll({
      fillOpacity: 0.25,
      visible: true,
      fill: am5.color('#00C8C8'),
    });
    series1.data.setAll(data);

    const series2 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'Research Downloads',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'publications',
        categoryXField: 'month',
        stroke: am5.color('#1A3461'),
        tooltip: am5.Tooltip.new(root, {
          labelText: '[bold]{name}[/]: {valueY}',
        }),
      })
    );

    series2.strokes.template.setAll({ strokeWidth: 3 });
    series2.data.setAll(data);

    const legend = chart.children.push(am5.Legend.new(root, { centerX: am5.p50, x: am5.p50 }));
    legend.data.setAll(chart.series.values);

    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  // amCharts 5 Setup: Content Distribution Donut Chart
  useEffect(() => {
    if (!pieChartRef.current) return;

    const root = am5.Root.new(pieChartRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(55),
        layout: root.verticalLayout,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
      })
    );

    series.get('colors')?.set('colors', [
      am5.color('#00C8C8'),
      am5.color('#1A3461'),
      am5.color('#E8C547'),
      am5.color('#22c55e'),
      am5.color('#8b5cf6'),
    ]);

    const pieData = [
      { category: 'Blogs & Articles', value: 45 },
      { category: 'Research Reports', value: 24 },
      { category: 'Talkshow Videos', value: 18 },
      { category: 'Podcasts', value: 12 },
      { category: 'Documentaries', value: 10 },
    ];

    series.data.setAll(pieData);
    series.labels.template.set('forceHidden', true);
    series.ticks.template.set('forceHidden', true);

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
        marginBottom: 15,
      })
    );

    legend.data.setAll(series.slices.values);
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  const stats = [
    {
      label: 'Published Blogs & Media',
      value: '48',
      change: '+12% this month',
      isUp: true,
      icon: FileText,
      iconBg: 'linear-gradient(135deg, #00C8C8 0%, #48b302 100%)',
      iconColor: '#FFFFFF',
      accentColor: '#00C8C8',
      badgeBg: 'rgba(0,200,200,0.12)',
      badgeColor: '#48b302',
      link: `${OBFUSCATED_ADMIN_PATH}/media`,
    },
    {
      label: 'Publications & Reports',
      value: '24',
      change: '+4 new research',
      isUp: true,
      icon: BookOpen,
      iconBg: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      iconColor: '#FFFFFF',
      accentColor: '#3B82F6',
      badgeBg: 'rgba(59,130,246,0.12)',
      badgeColor: '#1D4ED8',
      link: `${OBFUSCATED_ADMIN_PATH}/publications`,
    },
    {
      label: 'Active Projects & Grants',
      value: '14',
      change: '2 ongoing regional',
      isUp: true,
      icon: FolderKanban,
      iconBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      iconColor: '#FFFFFF',
      accentColor: '#F59E0B',
      badgeBg: 'rgba(245,158,11,0.15)',
      badgeColor: '#D97706',
      link: `${OBFUSCATED_ADMIN_PATH}/projects`,
    },
    {
      label: 'Sector Tools Active',
      value: '8',
      change: '100% operational',
      isUp: true,
      icon: Wrench,
      iconBg: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      iconColor: '#FFFFFF',
      accentColor: '#10B981',
      badgeBg: 'rgba(16,185,129,0.12)',
      badgeColor: '#047857',
      link: `${OBFUSCATED_ADMIN_PATH}/tools`,
    },
  ];

  const recentActivities = [
    { title: 'New Peer-Reviewed Paper Published', category: 'Publications', time: '10 mins ago', user: 'Dr. Rashid', status: 'published', link: `${OBFUSCATED_ADMIN_PATH}/publications` },
    { title: 'Updated ADB Regional Climate Project', category: 'Projects', time: '1 hour ago', user: 'Editor User', status: 'updated', link: `${OBFUSCATED_ADMIN_PATH}/projects` },
    { title: 'Drafted "Heatwave Vulnerability in Sindh"', category: 'Blogs', time: '3 hours ago', user: 'Dr. Rashid', status: 'draft', link: `${OBFUSCATED_ADMIN_PATH}/media` },
    { title: 'Added Meteorological Sector Tool', category: 'Tools', time: 'Yesterday', user: 'Dr. Rashid', status: 'published', link: `${OBFUSCATED_ADMIN_PATH}/tools` },
    { title: 'Team Member Profile Updated', category: 'Team', time: '2 days ago', user: 'Super Admin', status: 'updated', link: `${OBFUSCATED_ADMIN_PATH}/team` },
  ];

  const quickActions = [
    { name: 'My Profile & Bio', icon: UserCheck, desc: 'Edit bio, qualification, specialization & photo', link: `${OBFUSCATED_ADMIN_PATH}/team` },
    { name: 'New Blog Post', icon: FileText, desc: 'Rich text article for Media Hub', link: `${OBFUSCATED_ADMIN_PATH}/media` },
    { name: 'Add Publication', icon: BookOpen, desc: 'Peer-reviewed research or policy report', link: `${OBFUSCATED_ADMIN_PATH}/publications` },
    { name: 'Create Project', icon: FolderKanban, desc: 'Funder grant or climate initiative', link: `${OBFUSCATED_ADMIN_PATH}/projects` },
    { name: 'Update Sector Tool', icon: Wrench, desc: 'Interactive climate model tool link', link: `${OBFUSCATED_ADMIN_PATH}/tools` },
  ];

  return (
    <div ref={containerRef} className="admin-content" style={{ maxWidth: '100%', width: '100%' }}>
      {/* Top Welcome Banner */}
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
          borderRadius: '16px',
        }}
      >
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(0,200,200,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#00C8C8', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
              <Sparkles size={14} /> Control Dashboard
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Welcome back, Mr. Rashid
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '600px' }}>
              All climate research feeds, media publications, and sector tools are currently synced and operational.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => navigate(`${OBFUSCATED_ADMIN_PATH}/media`)}
              className="btn-teal"
              style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <Plus size={16} /> Quick Publish
            </button>
          </div>
        </div>
      </div>

      {/* Responsive 4-Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="stat-card"
              onClick={() => navigate(stat.link)}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '1.35rem',
                border: '1px solid #E2E8F4',
                boxShadow: '0 4px 12px rgba(11,30,61,0.06)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(11,30,61,0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(11,30,61,0.06)';
              }}
            >
              <div style={{ height: '4px', position: 'absolute', top: 0, left: 0, right: 0, background: stat.accentColor }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}>
                  <Icon size={22} color={stat.iconColor} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', background: stat.badgeBg, color: stat.badgeColor, letterSpacing: '0.05em' }}>
                  LIVE
                </span>
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.35rem', fontWeight: 800, color: '#0B1E3D', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: stat.badgeColor, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <TrendingUp size={14} /> {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* amCharts 5 Interactive Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="dashboard-widget" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F4', padding: '1.5rem', boxShadow: '0 2px 8px rgba(11,30,61,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#0B1E3D', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} color="#00C8C8" /> Monthly Reader &amp; Attribution Analytics
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>Interactive amCharts 5 growth trends</p>
            </div>
          </div>
          <div ref={xyChartRef} style={{ width: '100%', height: '280px' }} />
        </div>

        <div className="dashboard-widget" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F4', padding: '1.5rem', boxShadow: '0 2px 8px rgba(11,30,61,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#0B1E3D', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PieChart size={18} color="#00C8C8" /> Content Distribution Breakdown
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>Media types breakdown across portal</p>
            </div>
          </div>
          <div ref={pieChartRef} style={{ width: '100%', height: '280px' }} />
        </div>
      </div>

      {/* 2-Column Main Grid: Quick Actions & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Quick Actions Panel */}
        <div className="dashboard-widget" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F4', padding: '1.5rem', boxShadow: '0 2px 8px rgba(11,30,61,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>
                Content Management
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>Create or update website sections</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {quickActions.map((action, i) => {
              const ActionIcon = action.icon;
              return (
                <div
                  key={i}
                  onClick={() => navigate(action.link)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F4',
                    background: '#F9FBFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00C8C8';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,200,200,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F4';
                    e.currentTarget.style.background = '#F9FBFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(11,30,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem', color: '#0B1E3D' }}>
                    <ActionIcon size={20} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E3D' }}>{action.name}</div>
                  <div style={{ fontSize: '0.725rem', color: '#6B7A95', marginTop: '0.2rem', lineHeight: 1.3 }}>{action.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit & Activity Log */}
        <div className="dashboard-widget" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F4', padding: '1.5rem', boxShadow: '0 2px 8px rgba(11,30,61,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>
                Recent Platform Activity
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6B7A95', margin: 0 }}>Audit trail &amp; content status updates</p>
            </div>
            <button
              onClick={() => navigate(`${OBFUSCATED_ADMIN_PATH}/audit`)}
              className="btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
            >
              View All Log <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivities.map((act, i) => (
              <div
                key={i}
                onClick={() => navigate(act.link)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px solid #E8ECF2',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#00C8C8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E8ECF2';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C8C8', flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {act.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7A95', display: 'flex', gap: '0.5rem', marginTop: '0.1rem' }}>
                      <span>{act.category}</span>
                      <span>•</span>
                      <span>{act.user}</span>
                      <span>•</span>
                      <span><Clock size={10} style={{ display: 'inline', marginRight: '2px' }} />{act.time}</span>
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '999px',
                    background: act.status === 'published' ? 'rgba(0,200,200,0.12)' : 'rgba(232,197,71,0.2)',
                    color: act.status === 'published' ? '#48b302' : '#B58D00',
                    flexShrink: 0,
                  }}
                >
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
