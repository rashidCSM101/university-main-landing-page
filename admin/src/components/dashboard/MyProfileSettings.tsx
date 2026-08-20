import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Save, KeyRound, Eye, EyeOff, CheckCircle, AlertCircle, User } from 'lucide-react';

export const MyProfileSettings: React.FC = () => {
  const { user } = useAuth();

  // ── Bio data ──────────────────────────────────────────────────────────────
  const [myProfile, setMyProfile]       = useState<any>(null);
  const [bioLoading, setBioLoading]     = useState(true);
  const [bioSaving, setBioSaving]       = useState(false);
  const [bioSuccess, setBioSuccess]     = useState('');
  const [bioError, setBioError]         = useState('');

  // ── Password data ─────────────────────────────────────────────────────────
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdSaving, setPwdSaving]   = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError]     = useState('');
  const [showPwd, setShowPwd]       = useState({ current: false, next: false, confirm: false });

  // ─────────────────────────────────────────────────────────────────────────
  // Load my linked team_member profile on mount
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setBioLoading(true);
      try {
        const allMembers = await api.getAdminTeam();
        // Match by email stored in social_links OR by name
        const mine = allMembers.find((m: any) => {
          const sl = typeof m.social_links === 'string' ? JSON.parse(m.social_links) : m.social_links || {};
          return (
            (sl.email && user?.email && sl.email.toLowerCase() === user.email.toLowerCase()) ||
            (m.name && user?.name && m.name.toLowerCase().trim() === user.name.toLowerCase().trim())
          );
        });
        if (mine) {
          const sl = typeof mine.social_links === 'string' ? JSON.parse(mine.social_links) : mine.social_links || {};
          setMyProfile({ ...mine, social_links: sl });
        }
      } catch {
        setBioError('Could not load your profile. Please contact Super Admin.');
      } finally {
        setBioLoading(false);
      }
    })();
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────────
  // Bio save handler
  // ─────────────────────────────────────────────────────────────────────────
  const handleBioSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProfile) return;
    setBioSaving(true);
    setBioError('');
    setBioSuccess('');
    try {
      await api.updateTeamMember(myProfile.id, {
        ...myProfile,
        social_links: myProfile.social_links || {},
      });
      setBioSuccess('✅ Profile saved! Your changes are now live on the website.');
      setTimeout(() => setBioSuccess(''), 4000);
    } catch (err: any) {
      setBioError(err?.message || 'Failed to save profile.');
    } finally {
      setBioSaving(false);
    }
  };

  const updateField = (field: string, value: any) =>
    setMyProfile((prev: any) => ({ ...prev, [field]: value }));

  const updateSocialLink = (key: string, value: string) =>
    setMyProfile((prev: any) => ({ ...prev, social_links: { ...(prev.social_links || {}), [key]: value } }));

  // ─────────────────────────────────────────────────────────────────────────
  // Change Password handler
  // ─────────────────────────────────────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (pwdForm.next.length < 8) {
      setPwdError('New password must be at least 8 characters.');
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdSaving(true);
    try {
      await api.changeOwnPassword(pwdForm.current, pwdForm.next);
      setPwdSuccess('✅ Password changed successfully!');
      setPwdForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwdSuccess(''), 4000);
    } catch (err: any) {
      setPwdError(err?.message || 'Failed to change password.');
    } finally {
      setPwdSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="admin-content">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">My Profile Settings</h1>
        <p className="page-subtitle">
          Edit your public bio, photo, and social links — changes appear live on the website immediately.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '860px' }}>

        {/* ── Bio Settings Panel ── */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#00C8C8,#1A3461)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>My Public Bio</h2>
              <p style={{ fontSize: '0.78rem', color: '#6B7A95', margin: 0 }}>This information appears on the Team page at hex-byte.tech/team</p>
            </div>
          </div>

          {bioLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7A95' }}>Loading your profile…</div>
          ) : !myProfile ? (
            <div style={{ background: '#FFF7ED', border: '1px solid #FDE68A', borderRadius: '10px', padding: '1.25rem', color: '#92400E', fontSize: '0.875rem' }}>
              ⚠️ No profile record found for your account. Please ask the Super Admin to add you via the <strong>Our Team</strong> page first.
            </div>
          ) : (
            <form onSubmit={handleBioSave} style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Full Name *</label>
                  <input type="text" className="input-field" value={myProfile.name || ''} onChange={(e) => updateField('name', e.target.value)} required style={{ paddingLeft: '1rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Role / Position *</label>
                  <input type="text" className="input-field" placeholder="e.g. Senior Climate Scientist" value={myProfile.role || ''} onChange={(e) => updateField('role', e.target.value)} required style={{ paddingLeft: '1rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Research Division / Team</label>
                  <input type="text" className="input-field" placeholder="e.g. Atmospheric & Attribution Science" value={myProfile.team || ''} onChange={(e) => updateField('team', e.target.value)} style={{ paddingLeft: '1rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Profile Photo URL</label>
                  <input type="url" className="input-field" placeholder="https://…/your-photo.jpg" value={myProfile.photo || ''} onChange={(e) => updateField('photo', e.target.value)} style={{ paddingLeft: '1rem' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Biography / About Me</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Write a short professional biography about your research background, expertise, and key achievements…"
                  value={myProfile.bio || ''}
                  onChange={(e) => updateField('bio', e.target.value)}
                  style={{ paddingLeft: '1rem', resize: 'vertical' }}
                />
              </div>

              {/* Social Links */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', display: 'block', marginBottom: '0.75rem' }}>🌐 Social &amp; Contact Links</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { key: 'linkedin', label: 'LinkedIn URL' },
                    { key: 'twitter',  label: 'Twitter / X URL' },
                    { key: 'scholar',  label: 'Google Scholar URL' },
                    { key: 'researchgate', label: 'ResearchGate URL' },
                    { key: 'orcid',    label: 'ORCID URL' },
                    { key: 'email',    label: 'Public Email' },
                    { key: 'qualification', label: 'Highest Qualification' },
                    { key: 'papers',   label: 'Key Research Papers / Publications' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label style={{ fontSize: '0.75rem', color: '#6B7A95', display: 'block', marginBottom: '0.25rem' }}>{label}</label>
                      <input
                        type="text" className="input-field"
                        placeholder={label}
                        value={(myProfile.social_links || {})[key] || ''}
                        onChange={(e) => updateSocialLink(key, e.target.value)}
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {bioSuccess && (
                <div style={{ background: '#F0FFF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '0.75rem 1rem', color: '#166534', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} /> {bioSuccess}
                </div>
              )}
              {bioError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', color: '#991B1B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} /> {bioError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-teal" disabled={bioSaving}>
                  <Save size={16} /> {bioSaving ? 'Saving…' : 'Save Profile & Bio'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Change Password Panel ── */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#1A3461)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyRound size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>Change Password</h2>
              <p style={{ fontSize: '0.78rem', color: '#6B7A95', margin: 0 }}>Choose a strong new password (min 8 characters)</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '1rem', maxWidth: '480px' }}>
            {/* Current Password */}
            {(['current', 'next', 'confirm'] as const).map((field) => {
              const labels = { current: 'Current Password', next: 'New Password (min 8 characters)', confirm: 'Confirm New Password' };
              return (
                <div key={field}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>{labels[field]}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPwd[field] ? 'text' : 'password'}
                      required
                      className="input-field"
                      value={pwdForm[field]}
                      onChange={(e) => setPwdForm(prev => ({ ...prev, [field]: e.target.value }))}
                      style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(prev => ({ ...prev, [field]: !prev[field] }))}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A95', padding: 0 }}
                    >
                      {showPwd[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              );
            })}

            {pwdSuccess && (
              <div style={{ background: '#F0FFF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '0.75rem 1rem', color: '#166534', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> {pwdSuccess}
              </div>
            )}
            {pwdError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', color: '#991B1B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {pwdError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-teal" disabled={pwdSaving} style={{ background: 'linear-gradient(135deg,#7c3aed,#1A3461)' }}>
                <KeyRound size={16} /> {pwdSaving ? 'Changing…' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
