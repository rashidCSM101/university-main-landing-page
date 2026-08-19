import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun, Lock, Mail, KeyRound, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth, OBFUSCATED_ADMIN_PATH } from '../../hooks/useAuth';
import gsap from 'gsap';

import logoImg from '../../assets/logo.png';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
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
        await login(email, password, totp);
        setIsLoading(false);
        navigate(OBFUSCATED_ADMIN_PATH || '/', { replace: true });
      } else {
        setIsLoading(false);
        setError('Please enter valid credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="login-page">
      {/* Left Branding Side */}
      <div ref={leftRef} className="login-left">
        <div className="dot-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div style={{ position: 'relative', zIndex: 10, padding: '3rem', maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2.5rem' }}>
            <img
              src={logoImg}
              alt="WenClims Logo"
              style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
            />
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                WenClims
              </h1>
              <span style={{ fontSize: '0.7rem', color: '#00C8C8', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Weather & Climate Services
              </span>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,200,200,0.12)', border: '1px solid rgba(0,200,200,0.25)', padding: '0.4rem 0.9rem', borderRadius: '999px', marginBottom: '1.5rem' }}>
            <ShieldCheck size={16} color="#00C8C8" />
            <span style={{ fontSize: '0.75rem', color: '#00C8C8', fontWeight: 700, letterSpacing: '0.05em' }}>
              RESTRICTED ACCESS PORTAL
            </span>
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.25rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Administrative Control Panel
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Manage publications, research data, climate media, sector tools, and platform team configurations across South Asia.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00C8C8' }}>256-bit</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>Encrypted Sessions</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E8C547' }}>2FA Secured</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}>TOTP Verification</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Side */}
      <div className="login-right">
        <div ref={cardRef} className="login-card">
          <div className="login-card-inner">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#0B1E3D', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(11,30,61,0.06)', padding: '0.35rem 0.8rem', borderRadius: '999px', marginBottom: '0.75rem' }}>
                <Sparkles size={14} color="#00C8C8" /> Admin Authentication
              </div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>
                Sign In
              </h2>
              <p style={{ color: '#6B7A95', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                Enter your authorized credentials to proceed
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.4rem' }}>
                  Admin Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#9AA5BC" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="admin@wenclims.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#9AA5BC" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.4rem' }}>
                  2FA Authenticator Code (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} color="#9AA5BC" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="6-digit code e.g. 849204"
                    maxLength={6}
                    value={totp}
                    onChange={(e) => setTotp(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-teal"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E8ECF2', textAlign: 'center', fontSize: '0.75rem', color: '#9AA5BC' }}>
              🔒 Hardened Session Route · Security Protocol Level 4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
