import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { compressImage } from '../../utils/imageCompressor';
import {
  Save,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  User,
  ShieldCheck,
  Mail,
  BookOpen,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Github,
  GraduationCap,
  Sparkles,
  Camera,
  Upload,
  Layers,
  Lock,
  RefreshCw,
} from 'lucide-react';

export const MyProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'bio' | 'links' | 'security'>('bio');

  // ── Bio data ──────────────────────────────────────────────────────────────
  const [myProfile, setMyProfile] = useState<any>(null);
  const [bioLoading, setBioLoading] = useState(true);
  const [bioSaving, setBioSaving] = useState(false);
  const [bioSuccess, setBioSuccess] = useState('');
  const [bioError, setBioError] = useState('');

  // ── Password data ─────────────────────────────────────────────────────────
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });

  // Load user's profile on mount
  useEffect(() => {
    (async () => {
      setBioLoading(true);
      try {
        let mine: any = null;
        try {
          mine = await api.getOwnTeamProfile();
        } catch {
          const allMembers = await api.getAdminTeam();
          mine = allMembers.find((m: any) => {
            const sl = typeof m.social_links === 'string' ? JSON.parse(m.social_links) : m.social_links || {};
            return (
              (sl.email && user?.email && sl.email.toLowerCase() === user.email.toLowerCase()) ||
              (m.name && user?.name && m.name.toLowerCase().trim() === user.name.toLowerCase().trim())
            );
          });
        }
        if (mine) {
          const sl = typeof mine.social_links === 'string' ? JSON.parse(mine.social_links) : mine.social_links || {};
          const photoUrl = mine.photo || mine.image || mine.photo_url || '';
          setMyProfile({
            ...mine,
            photo: photoUrl,
            image: photoUrl,
            photo_url: photoUrl,
            division: mine.division || mine.team || sl.division || '',
            experience: mine.experience || sl.experience || '10+ Years',
            papers: mine.papers !== undefined ? mine.papers : (sl.papers ?? 12),
            citations: mine.citations !== undefined ? mine.citations : (sl.citations ?? 250),
            social_links: sl,
          });
        }
      } catch {
        setBioError('Could not load profile. Please contact Administrator.');
      } finally {
        setBioLoading(false);
      }
    })();
  }, [user]);

  const handleBioSave = async (e?: React.FormEvent, customPhoto?: string) => {
    if (e) e.preventDefault();
    if (!myProfile) return;
    setBioSaving(true);
    setBioError('');
    setBioSuccess('');
    try {
      const activePhoto = customPhoto !== undefined ? customPhoto : (myProfile.photo || myProfile.image || myProfile.photo_url || null);

      const updatedSocialLinks = {
        ...(myProfile.social_links || {}),
        email: myProfile.social_links?.email || user?.email || '',
        division: myProfile.division || myProfile.team || '',
        experience: myProfile.experience || '',
        papers: myProfile.papers,
        citations: myProfile.citations,
      };

      const payload = {
        name: myProfile.name || user?.name || 'Researcher',
        slug: myProfile.slug || (myProfile.name ? myProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'member'),
        role: myProfile.role || 'Associate Researcher',
        team: myProfile.division || myProfile.team || 'Atmospheric & Attribution Science',
        photo: activePhoto,
        bio: myProfile.bio || '',
        social_links: updatedSocialLinks,
        sort_order: myProfile.sort_order ?? 0,
        show_on_home: myProfile.show_on_home ?? false,
        is_active: myProfile.is_active ?? true,
      };

      const updated = await api.updateTeamMember(myProfile.id, payload);
      setMyProfile((prev: any) => ({
        ...prev,
        ...updated,
        photo: activePhoto,
        image: activePhoto,
        photo_url: activePhoto,
        social_links: updatedSocialLinks,
      }));
      setBioSuccess('Profile details & photo saved! Changes are immediately live on the main website.');
      setTimeout(() => setBioSuccess(''), 4000);
    } catch (err: any) {
      setBioError(err?.message || 'Failed to save profile.');
    } finally {
      setBioSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setBioSaving(true);
      setBioError('');
      // Auto-compress profile portrait to max 500x500 WebP (< 50 KB)
      const result = await compressImage(file, {
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.85,
        format: 'image/webp',
      });

      setMyProfile((prev: any) => ({
        ...prev,
        photo: result.dataUrl,
        image: result.dataUrl,
        photo_url: result.dataUrl,
      }));

      // Immediately save the updated photo if profile ID is known
      if (myProfile?.id) {
        await handleBioSave(undefined, result.dataUrl);
      } else {
        setBioSuccess('Photo loaded! Click "Save Profile Changes" to submit.');
      }
    } catch (err: any) {
      setBioError(err?.message || 'Failed to process image.');
    } finally {
      setBioSaving(false);
      if (e.target) e.target.value = '';
    }
  };

  const updateField = (field: string, value: any) =>
    setMyProfile((prev: any) => ({ ...prev, [field]: value }));

  const updateSocialLink = (key: string, value: string) =>
    setMyProfile((prev: any) => ({ ...prev, social_links: { ...(prev.social_links || {}), [key]: value } }));

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (pwdForm.next.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdSaving(true);
    try {
      await api.changeOwnPassword(pwdForm.current, pwdForm.next);
      setPwdSuccess('Password changed successfully! Please keep it secure.');
      setPwdForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwdSuccess(''), 4000);
    } catch (err: any) {
      setPwdError(err?.message || 'Failed to change password.');
    } finally {
      setPwdSaving(false);
    }
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="admin-content">
      {/* ── Page Header ── */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={28} color="#00C8C8" />
            <span>My Profile &amp; Account Settings</span>
          </h1>
          <p className="page-subtitle">
            Manage your personal biography, academic citations, research interests, and account security
          </p>
        </div>
      </div>

      {/* ── Alerts ── */}
      {bioSuccess && (
        <div style={{ background: 'rgba(0, 200, 200, 0.12)', border: '1.5px solid #00C8C8', borderRadius: '12px', padding: '1rem 1.25rem', color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={20} color="#00C8C8" /> {bioSuccess}
        </div>
      )}
      {bioError && (
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '12px', padding: '1rem 1.25rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <AlertTriangle size={20} color="#DC2626" /> {bioError}
        </div>
      )}

      {/* ── Main Layout Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* ── LEFT COLUMN: Profile Identity Card ── */}
        <div className="card" style={{ padding: '2rem', background: '#ffffff', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(11, 30, 61, 0.05)', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1rem' }}>
            {myProfile?.photo || myProfile?.image || myProfile?.photo_url ? (
              <img
                src={myProfile.photo || myProfile.image || myProfile.photo_url}
                alt={myProfile.name || user?.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3.5px solid #00C8C8', boxShadow: '0 6px 20px rgba(0, 200, 200, 0.25)' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0B1E3D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 800, border: '3.5px solid #00C8C8', boxShadow: '0 6px 20px rgba(11, 30, 61, 0.25)' }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload/change photo"
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#00C8C8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0B1E3D',
                border: '2px solid #fff',
                boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer',
              }}
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-ghost"
            style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem', border: '1px solid #CBD5E1', borderRadius: '10px' }}
          >
            <Upload size={14} color="#00C8C8" /> Change Profile Picture
          </button>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 800, color: '#0B1E3D', margin: '0 0 0.35rem' }}>
            {myProfile?.name || user?.name || 'Administrator'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <Mail size={14} color="#00C8C8" />
            <span>{user?.email}</span>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span className={`badge ${isSuperAdmin ? 'badge-teal' : isAdmin ? 'badge-gold' : 'badge-navy'}`}>
              <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Executive Admin' : 'Member Scientist'}
            </span>
            <span className="badge badge-teal">
              <Sparkles size={11} style={{ display: 'inline', marginRight: '4px' }} /> Active Node
            </span>
          </div>

          {/* Quick Metrics */}
          {myProfile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00A3A3', fontFamily: 'Outfit, sans-serif' }}>
                  {myProfile.papers || '10+'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Publications
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A3461', fontFamily: 'Outfit, sans-serif' }}>
                  {myProfile.citations || '250+'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Citations
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Interactive Tabs & Forms ── */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('bio')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'bio' ? '#0B1E3D' : '#F1F5F9',
                color: activeTab === 'bio' ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <User size={16} /> Public Bio
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('links')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'links' ? '#0B1E3D' : '#F1F5F9',
                color: activeTab === 'links' ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <Globe size={16} /> Social &amp; Academic
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'security' ? '#4F46E5' : '#F1F5F9',
                color: activeTab === 'security' ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <Lock size={16} /> Password &amp; Security
            </button>
          </div>

          {/* ── TAB 1: Public Bio Form ── */}
          {activeTab === 'bio' && (
            <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '20px', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
              {bioLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Loading profile details...</div>
              ) : !myProfile ? (
                <div style={{ background: '#FFF7ED', border: '1px solid #FDE68A', borderRadius: '14px', padding: '1.5rem', color: '#92400E', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertTriangle size={22} color="#D97706" style={{ flexShrink: 0 }} />
                  <span>No public team record linked to your email yet. Please contact Super Admin to add you on the <strong>Our Team</strong> page.</span>
                </div>
              ) : (
                <form onSubmit={handleBioSave} style={{ display: 'grid', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={myProfile.name || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Designation / Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Climate Modeler &amp; Researcher"
                        value={myProfile.role || ''}
                        onChange={(e) => updateField('role', e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Division / Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Atmospheric Physics &amp; AI"
                        value={myProfile.division || ''}
                        onChange={(e) => updateField('division', e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Years of Experience</label>
                      <input
                        type="text"
                        placeholder="e.g. 12+ Years"
                        value={myProfile.experience || ''}
                        onChange={(e) => updateField('experience', e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Papers Published Count</label>
                      <input
                        type="number"
                        value={myProfile.papers || 0}
                        onChange={(e) => updateField('papers', parseInt(e.target.value, 10) || 0)}
                        className="input-field"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Citations Count</label>
                      <input
                        type="number"
                        value={myProfile.citations || 0}
                        onChange={(e) => updateField('citations', parseInt(e.target.value, 10) || 0)}
                        className="input-field"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>
                  </div>

                  {/* Profile Photo Upload & Preview Card */}
                  <div style={{ background: '#F8FAFC', padding: '1.25rem 1.5rem', borderRadius: '14px', border: '1.5px solid #E2E8F4', display: 'grid', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0B1E3D', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Camera size={18} color="#00C8C8" />
                      <span>Profile Picture (Avatar)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', background: '#0B1E3D', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #00C8C8', flexShrink: 0 }}>
                        {myProfile?.photo || myProfile?.image || myProfile?.photo_url ? (
                          <img src={myProfile.photo || myProfile.image || myProfile.photo_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={28} color="#94A3B8" />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-teal"
                            style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                          >
                            <Upload size={15} /> Upload Photo from Device
                          </button>
                          {(myProfile?.photo || myProfile?.image || myProfile?.photo_url) && (
                            <button
                              type="button"
                              onClick={() => {
                                updateField('photo', '');
                                updateField('image', '');
                                updateField('photo_url', '');
                              }}
                              style={{ padding: '0.55rem 0.9rem', fontSize: '0.825rem', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#fff', color: '#64748B', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste external image URL (https://...)"
                          value={myProfile.photo || myProfile.image || myProfile.photo_url || ''}
                          onChange={(e) => {
                            updateField('photo', e.target.value);
                            updateField('image', e.target.value);
                            updateField('photo_url', e.target.value);
                          }}
                          className="input-field"
                          style={{ paddingLeft: '0.85rem', fontSize: '0.825rem' }}
                        />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                      Supports JPEG, PNG, and WebP. Automatically optimized in your browser for rapid page speed.
                    </p>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Research Biography &amp; Background</label>
                    <textarea
                      rows={5}
                      placeholder="Write your research monograph summary, academic background, and climate projects..."
                      value={myProfile.bio || ''}
                      onChange={(e) => updateField('bio', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '1rem', height: 'auto' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={bioSaving}
                      className="btn-teal"
                      style={{ padding: '0.75rem 2rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Save size={18} />
                      <span>{bioSaving ? 'Saving Bio...' : 'Save Profile Changes'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── TAB 2: Academic & Social Links ── */}
          {activeTab === 'links' && (
            <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '20px', border: '1.5px solid #E2E8F0' }}>
              <form onSubmit={handleBioSave} style={{ display: 'grid', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={16} color="#00C8C8" /> Google Scholar Profile
                    </label>
                    <input
                      type="text"
                      placeholder="https://scholar.google.com/citations?user=..."
                      value={myProfile?.social_links?.google_scholar || ''}
                      onChange={(e) => updateSocialLink('google_scholar', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={16} color="#00C8C8" /> ResearchGate URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.researchgate.net/profile/..."
                      value={myProfile?.social_links?.researchgate || ''}
                      onChange={(e) => updateSocialLink('researchgate', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Linkedin size={16} color="#0A66C2" /> LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.linkedin.com/in/..."
                      value={myProfile?.social_links?.linkedin || ''}
                      onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Twitter size={16} color="#1DA1F2" /> Twitter / X Handle
                    </label>
                    <input
                      type="text"
                      placeholder="https://twitter.com/..."
                      value={myProfile?.social_links?.twitter || ''}
                      onChange={(e) => updateSocialLink('twitter', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Github size={16} color="#0B1E3D" /> GitHub Profile
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={myProfile?.social_links?.github || ''}
                      onChange={(e) => updateSocialLink('github', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Globe size={16} color="#00C8C8" /> Personal Website / Lab Page
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={myProfile?.social_links?.website || ''}
                      onChange={(e) => updateSocialLink('website', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={bioSaving}
                    className="btn-teal"
                    style={{ padding: '0.75rem 2rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Save size={18} />
                    <span>{bioSaving ? 'Saving Links...' : 'Save Academic Links'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB 3: Change Password Form ── */}
          {activeTab === 'security' && (
            <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', borderRadius: '20px', border: '1.5px solid rgba(124, 58, 237, 0.25)', boxShadow: '0 8px 30px rgba(124, 58, 237, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)' }}>
                  <KeyRound size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
                    Change Account Password
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                    Update your login password regularly to protect your administrator permissions.
                  </p>
                </div>
              </div>

              {pwdSuccess && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '0.85rem 1.25rem', color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={18} color="#10B981" /> {pwdSuccess}
                </div>
              )}
              {pwdError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '0.85rem 1.25rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <AlertTriangle size={18} color="#DC2626" /> {pwdError}
                </div>
              )}

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Current Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPwd.current ? 'text' : 'password'}
                      required
                      value={pwdForm.current}
                      onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                      className="input-field"
                      placeholder="Enter your current password"
                      style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd({ ...showPwd, current: !showPwd.current })}
                      style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                    >
                      {showPwd.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>New Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPwd.next ? 'text' : 'password'}
                        required
                        value={pwdForm.next}
                        onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })}
                        className="input-field"
                        placeholder="At least 8 characters"
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd({ ...showPwd, next: !showPwd.next })}
                        style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                      >
                        {showPwd.next ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E2A3B', marginBottom: '0.35rem', display: 'block' }}>Confirm New Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPwd.confirm ? 'text' : 'password'}
                        required
                        value={pwdForm.confirm}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                        className="input-field"
                        placeholder="Re-enter new password"
                        style={{ paddingLeft: '1rem', paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd({ ...showPwd, confirm: !showPwd.confirm })}
                        style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                      >
                        {showPwd.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={pwdSaving}
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#4F46E5',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <KeyRound size={18} />
                    <span>{pwdSaving ? 'Updating Password...' : 'Change Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
