import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon, UserCheck, CheckCircle, Save, ShieldCheck } from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';

export const TeamManager: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State (Initialized to Logged In User)
  const [formData, setFormData] = useState<any>({
    id: null,
    name: user?.name || '',
    slug: user?.name ? user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '',
    role: 'Research Associate',
    team: 'Atmospheric & Attribution Science',
    photo: '',
    bio: '',
    qualification: 'Ph.D. Atmospheric Physics & Climate Science',
    specialization: 'Convective Monsoon Modeling & Extreme Event Attribution',
    experience: '10+ Years',
    email: user?.email || '',
    phone: '+92 51 9260100',
    address: 'WenClims Research HQ, Sector H-8/4, Islamabad, Pakistan',
    linkedin: '',
    x_twitter: '',
    google_scholar: '',
    orcid: '',
    publications: '',
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminTeam();
      setItems(data);

      // Match logged in user's profile from server
      if (user && Array.isArray(data)) {
        const myProfile = data.find(
          (m: any) =>
            m.name?.toLowerCase().trim() === user.name?.toLowerCase().trim() ||
            m.social_links?.email?.toLowerCase().trim() === user.email?.toLowerCase().trim() ||
            m.email?.toLowerCase().trim() === user.email?.toLowerCase().trim()
        );

        if (myProfile) {
          populateForm(myProfile);
        } else {
          setFormData((prev: any) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            slug: user.name ? user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
          }));
        }
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const populateForm = (item: any) => {
    const sl = item.social_links || {};
    setFormData({
      id: item.id,
      name: item.name || user?.name || '',
      slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : ''),
      role: item.role || 'Associate Researcher',
      team: item.team || 'Atmospheric & Attribution Science',
      photo: item.photo || '',
      bio: item.bio || '',
      qualification: sl.qualification || item.qualification || 'Ph.D. Atmospheric Physics & Climate Science',
      specialization: sl.specialization || item.specialization || 'Convective Monsoon Modeling & Extreme Event Attribution',
      experience: sl.experience || item.experience || '10+ Years',
      email: sl.email || item.email || user?.email || '',
      phone: sl.phone || item.phone || '+92 51 9260100',
      address: sl.address || 'WenClims Research HQ, Sector H-8/4, Islamabad, Pakistan',
      linkedin: sl.linkedin || '',
      x_twitter: sl.x_twitter || '',
      google_scholar: sl.google_scholar || '',
      orcid: sl.orcid || '',
      publications: sl.publications || '',
      show_on_home: item.show_on_home ?? false,
      is_active: item.is_active ?? true,
    });
  };

  // Image upload from device -> Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev: any) => ({
        ...prev,
        photo: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const social_links = {
      qualification: formData.qualification,
      specialization: formData.specialization,
      experience: formData.experience,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      linkedin: formData.linkedin,
      x_twitter: formData.x_twitter,
      google_scholar: formData.google_scholar,
      orcid: formData.orcid,
      publications: formData.publications,
    };

    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      role: formData.role,
      team: formData.team,
      photo: formData.photo,
      bio: formData.bio,
      social_links,
      show_on_home: formData.show_on_home ?? false,
      is_active: formData.is_active,
    };

    try {
      if (formData.id) {
        await api.updateTeamMember(formData.id, payload);
      } else {
        const created = await api.createTeamMember(payload);
        if (created?.id) {
          setFormData((prev: any) => ({ ...prev, id: created.id }));
        }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save profile bio');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !isSuperAdmin) return;

    setIsDeleting(true);
    try {
      await api.deleteTeamMember(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete team member');
    } finally {
      setIsDeleting(false);
    }
  };

  const openNewBlankMember = () => {
    setFormData({
      id: null,
      name: '',
      slug: '',
      role: 'Research Associate',
      team: 'Atmospheric & Attribution Science',
      photo: '',
      bio: '',
      qualification: '',
      specialization: '',
      experience: '10+ Years',
      email: '',
      phone: '',
      address: 'WenClims Research HQ, Islamabad, Pakistan',
      linkedin: '',
      x_twitter: '',
      google_scholar: '',
      orcid: '',
      publications: '',
      show_on_home: false,
      is_active: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-content">
      {/* Top Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={28} color="#00C8C8" />
            <span>My Personal Profile &amp; Bio Settings</span>
          </h1>
          <p className="page-subtitle">
            {isSuperAdmin
              ? 'Super Admin Mode: Edit your bio settings and manage the organization faculty directory'
              : 'Editor Profile Mode: Update your personal scientist biography, credentials, photo, and contacts'}
          </p>
        </div>

        {/* ONLY Super Admin can see "Add New Team Member" button */}
        {isSuperAdmin && (
          <button onClick={openNewBlankMember} className="btn-teal">
            <Plus size={18} /> Add New Team Member
          </button>
        )}
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccess && (
        <div
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10B981',
            borderRadius: '12px',
            color: '#065F46',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CheckCircle size={22} color="#10B981" />
          <span>Your Profile &amp; Bio settings have been saved successfully! Changes are live on the website.</span>
        </div>
      )}

      {/* PERSONAL PROFILE & BIO SETTINGS FORM (ALWAYS VISIBLE FOR LOGGED IN USER) */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', background: '#ffffff', border: '2px solid #00C8C8', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,200,200,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F4', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
              Edit My Personal Bio: {formData.name || user?.name}
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#009A9A', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <ShieldCheck size={14} /> Logged in as: {user?.name} ({isSuperAdmin ? 'Super Admin' : 'Editor Profile'})
            </span>
          </div>

          <button type="button" onClick={handleSave} disabled={saving} className="btn-teal" style={{ padding: '0.65rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile & Bio'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* 1. Full Name */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ali"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* 2. Position / Post Designation (Dropdown with fixed allowed posts) */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Post / Designation *</label>
            <select
              value={formData.role || 'Research Associate'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            >
              <option value="Chief Executive Officer">Chief Executive Officer</option>
              <option value="Chief Operating Officer">Chief Operating Officer</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Co-Lead">Co-Lead</option>
              <option value="Research Associate">Research Associate</option>
              <option value="Research Assistant">Research Assistant</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          {/* 3. Division / Department */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Division / Department</label>
            <select
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            >
              <option value="Leadership">Leadership &amp; Directorate</option>
              <option value="Atmospheric & Attribution Science">Atmospheric &amp; Attribution Science</option>
              <option value="Hydrology & Indus Basin Risk">Hydrology &amp; Indus Basin Risk</option>
              <option value="Climate Policy & Advisory">Climate Policy &amp; Advisory</option>
              <option value="Satellite Telemetry & Remote Sensing">Satellite Telemetry &amp; Remote Sensing</option>
            </select>
          </div>

          {/* 4. Years of Experience */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Years of Experience (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 15+ Years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* 5. Qualification / Academic Credentials */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Academic Qualification &amp; Ph.D. Degrees (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Ph.D. Atmospheric Physics & Attribution Science"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* 6. Specialization / Expertise */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Specialization &amp; Research Focus Domain (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Extreme Event Attribution, Convective Monsoon Modeling & IPCC Assessment (or leave empty)"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* 7. Image Upload from Device / Web URL */}
          <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F4' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1E3D', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={18} color="#00C8C8" />
              <span>Profile Photo Settings (Device Upload or Web Link - Optional)</span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem', alignItems: 'center' }}>
              {/* Image Preview Box */}
              <div style={{ width: '90px', height: '90px', borderRadius: '1.25rem', overflow: 'hidden', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #00C8C8', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {formData.photo ? (
                  <img src={formData.photo} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={32} color="#94A3B8" />
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {/* Device Upload Button */}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #00C8C8, #48b302)', color: '#0B1E3D', fontWeight: 800, padding: '0.6rem 1.2rem', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.825rem', width: 'fit-content', boxShadow: '0 2px 8px rgba(0,200,200,0.3)' }}>
                  <Upload size={16} />
                  <span>Choose Image from Computer / Device</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>

                {/* Web Link Input */}
                <input
                  type="text"
                  placeholder="Or paste web image URL (https://...) - Optional"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '0.75rem', fontSize: '0.8rem' }}
                />
              </div>
            </div>
          </div>

          {/* 8. Contact Info: Email & Phone */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Official Email Address (Optional)</label>
            <input
              type="text"
              placeholder="e.g. rashid@wenclims.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Phone / Contact Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. +92 51 9260100"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* 9. Office Address */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Office Address / Location (Optional)</label>
            <input
              type="text"
              placeholder="e.g. WenClims Research HQ, Sector H-8/4, Islamabad, Pakistan"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* 10. Social & Academic URLs (All Optional) */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Google Scholar Profile URL (Optional)</label>
            <input
              type="text"
              placeholder="https://scholar.google.com/..."
              value={formData.google_scholar}
              onChange={(e) => setFormData({ ...formData, google_scholar: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>ORCID ID Link (Optional)</label>
            <input
              type="text"
              placeholder="https://orcid.org/0000-..."
              value={formData.orcid}
              onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>LinkedIn Profile URL (Optional)</label>
            <input
              type="text"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>X (Twitter) Profile URL (Optional)</label>
            <input
              type="text"
              placeholder="https://x.com/..."
              value={formData.x_twitter}
              onChange={(e) => setFormData({ ...formData, x_twitter: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          {/* 11. Scientific Biography (Bio) (Optional) */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Scientific Biography (Full Bio Text) (Optional)</label>
            <textarea
              rows={4}
              placeholder="Write your academic background, research focus, IPCC contributions, and career summary (or leave empty)..."
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem', height: 'auto', borderRadius: '1rem' }}
            />
          </div>

          {/* 12. Key Research Publications (Optional) */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Key Research Papers / Publications List (Optional)</label>
            <textarea
              rows={3}
              placeholder="List major published research papers and journal DOIs (or leave empty)..."
              value={formData.publications || ''}
              onChange={(e) => setFormData({ ...formData, publications: e.target.value })}
              className="input-field"
              style={{ paddingLeft: '1rem', height: 'auto', borderRadius: '1rem' }}
            />
          </div>

          {/* 13. Super Admin Home Page Card Access Toggle */}
          {isSuperAdmin && (
            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '1rem 1.25rem', background: '#F0FDFA', border: '2px dashed #00C8C8', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <input
                type="checkbox"
                id="show_on_home"
                checked={formData.show_on_home || false}
                onChange={(e) => setFormData({ ...formData, show_on_home: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#48b302' }}
              />
              <div>
                <label htmlFor="show_on_home" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F766E', cursor: 'pointer', display: 'block' }}>
                  ⭐ Feature Card on Home Page ("Meet Our Lead Climate Scientists")
                </label>
                <span style={{ fontSize: '0.78rem', color: '#6B7A95', display: 'block', marginTop: '2px' }}>
                  Super Admin Privilege: Check this box to include this scientist in the featured 4 cards on the main Home Page. (On the Team page, all scientists appear automatically).
                </span>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={saving} className="btn-teal" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} />
              <span>{saving ? 'Saving Settings...' : 'Save Profile & Bio Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SUPER ADMIN ONLY: Scientific Faculty Directory Table */}
      {isSuperAdmin && (
        <div className="card">
          <div style={{ padding: '1.25rem 1rem 0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>
              Scientific Faculty Directory (Super Admin View)
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#6B7A95' }}>
              {items.length} Active Member{items.length !== 1 ? 's' : ''}
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 600 }}>
                <th style={{ padding: '0.875rem 1rem' }}>Scientist</th>
                <th style={{ padding: '0.875rem 1rem' }}>Post / Role</th>
                <th style={{ padding: '0.875rem 1rem' }}>Division</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading team directory...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No team members found.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', background: '#00C8C8', flexShrink: 0 }}>
                          {item.photo ? (
                            <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                              {item.name?.substring(0, 1)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9AA5BC' }}>{item.social_links?.email || item.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#4D5D78', fontWeight: 500 }}>{item.role}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className="badge badge-teal" style={{ textTransform: 'capitalize', marginRight: '0.5rem' }}>{item.team}</span>
                      {item.show_on_home && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' }}>
                          ⭐ Home Card
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => populateForm(item)}
                        className="topbar-btn"
                        style={{ display: 'inline-flex', marginRight: '0.4rem' }}
                        title="Load into Form"
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => setDeleteTarget({ id: item.id, title: item.name })}
                        className="topbar-btn"
                        style={{ display: 'inline-flex', color: '#dc2626' }}
                        title="Delete Member"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Team Member"
        itemTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
