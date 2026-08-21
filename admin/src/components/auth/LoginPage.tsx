import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CloudRain,
  BookOpenCheck,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useAuth, OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';
import gsap from 'gsap';

import logoImg from '../../assets/logo.png';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(OBFUSCATED_ADMIN_PATH || '/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        opacity: 0,
        x: -40,
        duration: 0.9,
        ease: 'power3.out',
      });
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (email && password) {
        await login(email, password);
        setIsLoading(false);
        navigate(OBFUSCATED_ADMIN_PATH || '/', { replace: true });
      } else {
        setIsLoading(false);
        setError('Please enter your email and password.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      {/* ── Left Luxury Climate-Tech Branding Side ── */}
      <div ref={leftRef} className="login-left">
        <div className="dot-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div style={{ position: 'relative', zIndex: 10, padding: '3.5rem 3rem', maxWidth: '560px', width: '100%' }}>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                flexShrink: 0,
              }}
            >
              <img
                src={logoImg}
                alt="WenClims Logo"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                WenClims
              </h1>
              <span style={{ fontSize: '0.725rem', color: '#00C8C8', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Weather &amp; Climate Services
              </span>
            </div>
          </div>

          {/* Portal Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0, 200, 200, 0.12)',
              border: '1px solid rgba(0, 200, 200, 0.3)',
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 10px #10B981',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#00C8C8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Institutional Management Portal
            </span>
          </div>

          {/* Main Title & Description */}
          <h2
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '2.35rem',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.2,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Atmospheric Intelligence &amp; Research Platform
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '2.25rem' }}>
            Unified control suite for climate attribution modeling, meteorological datasets, peer-reviewed publications, and regional hazard tools.
          </p>

          {/* Feature Highlights Grid (Luxury Glassmorphic Cards) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.5rem' }}>
            
            {/* Card 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.9rem 1.2rem',
                borderRadius: '14px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(0, 200, 200, 0.15)',
                  color: '#00C8C8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CloudRain size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  Hydro-Climate Attribution &amp; Extreme Weather
                </div>
                <div style={{ fontSize: '0.775rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Attribution modeling and regional climate anomaly analysis.
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.9rem 1.2rem',
                borderRadius: '14px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(232, 197, 71, 0.15)',
                  color: '#E8C547',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BookOpenCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  Peer-Reviewed Research &amp; Multi-Author Vault
                </div>
                <div style={{ fontSize: '0.775rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Institutional repository for journals, media reports, and talkshows.
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.9rem 1.2rem',
                borderRadius: '14px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Cpu size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  Sector Climate &amp; Hazard Tools
                </div>
                <div style={{ fontSize: '0.775rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Interactive decision-support tools for water, energy, and agriculture.
                </div>
              </div>
            </div>

          </div>

          {/* Operational Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>Secure TLS 1.3 Verified · Production Cluster</span>
          </div>
        </div>
      </div>

      {/* ── Right Sign In Card Side ── */}
      <div className="login-right">
        <div ref={cardRef} className="login-card">
          <div className="login-card-inner">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  color: '#0B1E3D',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: 'rgba(11,30,61,0.06)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={14} color="#00C8C8" /> Institutional Access
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: '#0B1E3D', margin: 0, letterSpacing: '-0.02em' }}>
                Sign In
              </h2>
              <p style={{ color: '#6B7A95', fontSize: '0.875rem', marginTop: '0.4rem' }}>
                Enter your credentials to access your console
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: '#DC2626',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.45rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    color="#9AA5BC"
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@wenclims.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.75rem', height: '46px', fontSize: '0.9rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.45rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="#9AA5BC"
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem', height: '46px', fontSize: '0.9rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#9AA5BC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.25rem',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-teal"
                style={{
                  width: '100%',
                  height: '48px',
                  marginTop: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px rgba(0, 200, 200, 0.25)',
                }}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Console</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: '2.25rem', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9', textAlign: 'center', fontSize: '0.775rem', color: '#94A3B8' }}>
              &copy; {new Date().getFullYear()} WenClims &middot; Authorized Access Only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
