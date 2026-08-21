import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon, UserCheck, CheckCircle, Save, ShieldCheck, KeyRound, Copy, CheckCheck, AlertTriangle } from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';

// ─── Credentials Popup Modal ──────────────────────────────────────────────────
interface CredentialsModalProps {
  isOpen: boolean;
  name: string;
  email: string;
  password: string;
  onClose: () => void;
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, name, email, password, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Team Member Account Created!\n\nName: ${name}\nLogin URL: https://hex-byte.tech/admin/\nEmail: ${email}\nTemporary Password: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,30,61,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '460px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '2px solid #00C8C8' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C8C8, #1A3461)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <KeyRound size={26} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
            Member Account &amp; Login Credentials
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6B7A95', marginTop: '0.4rem' }}>
            A login account has been created for <strong>{name}</strong>! Share these credentials with them.
          </p>
        </div>

        <div style={{ background: '#F0F9F9', border: '1.5px solid #00C8C8', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Admin Portal URL</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E3D' }}>https://hex-byte.tech/admin/</div>
          </div>
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Login Email</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1E3D', fontFamily: 'monospace' }}>{email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Auto-Generated Password</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00C8C8', fontFamily: 'monospace', letterSpacing: '1px' }}>{password}</div>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.6rem 0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center' }}>
          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginRight: '8px' }} />
          <span>Copy and send this password to the member. They can change their password anytime after logging in via <strong>My Profile Settings</strong>.</span>
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCopy} className="btn-teal" style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800 }}>
            {copied ? <><CheckCheck size={18} /> Copied to Clipboard!</> : <><Copy size={18} /> Copy Credentials</>}
          </button>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.75rem 1.25rem' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

// ─── Main Component ───────────────────────────────────────────────────────────
export const TeamManager: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isSuperAdmin = user?.role === 'super_admin';

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Credentials Modal State
  const [credModal, setCredModal] = useState<{ open: boolean; name: string; email: string; password: string }>({
    open: false, name: '', email: '', password: '',
  });

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('File size exceeds 5MB limit. Please choose a smaller image.');
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
      email: formData.email,
      social_links,
      show_on_home: formData.show_on_home ?? false,
      is_active: formData.is_active,
    };

    try {
      if (formData.id) {
        await api.updateTeamMember(formData.id, payload);
        toast.success('Team member profile updated successfully!');
      } else {
        const created = await api.createTeamMember(payload);
        if (created?.id) {
          setFormData((prev: any) => ({ ...prev, id: created.id }));
        }

        // If backend auto-generated a password and user email for new member, pop up credentials modal!
        if (created?.temp_password && created?.user_email) {
          setCredModal({
            open: true,
            name: created.name,
            email: created.user_email,
            password: created.temp_password,
          });
        }
        toast.success('Team member registered successfully!');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      loadData();
    } catch (err: any) {
      toast.error('Failed to save profile bio', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !isSuperAdmin) return;
    setIsDeleting(true);
    try {
      await api.deleteTeamMember(deleteTarget.id);
      toast.success('Team member deleted successfully.');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error('Failed to delete team member', err?.message);
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
            <span>Our Team &amp; Faculty Manager</span>
          </h1>
          <p className="page-subtitle">
            {isSuperAdmin
              ? 'Super Admin Mode: Add new scientists/members — auto-generates login account and temporary password!'
              : 'Editor Profile Mode: Update your scientist biography and credentials'}
          </p>
        </div>

        {isSuperAdmin && (
          <button onClick={openNewBlankMember} className="btn-teal">
            <Plus size={18} /> Add New Team Member
          </button>
        )}
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10B981', borderRadius: '12px', color: '#065F46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={22} color="#10B981" />
          <span>Profile &amp; Bio settings saved successfully! Changes are live on the website.</span>
        </div>
      )}

      {/* FORM */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', background: '#ffffff', border: '2px solid #00C8C8', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,200,200,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F4', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
              {formData.id ? `Edit Member: ${formData.name}` : 'Add New Team Member'}
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
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Full Name *</label>
            <input type="text" required placeholder="e.g. Dr. Ayesha Khan" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" style={{ paddingLeft: '1rem' }} />
          </div>

          {/* Official Email (Triggers auto-login creation) */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>
              Official Email Address * <span style={{ color: '#00C8C8', fontWeight: 600 }}>(Creates Login Account)</span>
            </label>
            <input type="email" required placeholder="ayesha@wenclims.org" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" style={{ paddingLeft: '1rem' }} />
          </div>

          {/* Post Designation */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Post / Designation *</label>
            <select value={formData.role || 'Research Associate'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-field" style={{ paddingLeft: '1rem' }}>
              <option value="Chief Executive Officer">Chief Executive Officer</option>
              <option value="Chief Operating Officer">Chief Operating Officer</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Co-Lead">Co-Lead</option>
              <option value="Research Associate">Research Associate</option>
              <option value="Research Assistant">Research Assistant</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          {/* Division */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Division / Department</label>
            <select value={formData.team} onChange={(e) => setFormData({ ...formData, team: e.target.value })} className="input-field" style={{ paddingLeft: '1rem' }}>
              <option value="Leadership">Leadership &amp; Directorate</option>
              <option value="Atmospheric & Attribution Science">Atmospheric &amp; Attribution Science</option>
              <option value="Hydrology & Indus Basin Risk">Hydrology &amp; Indus Basin Risk</option>
              <option value="Climate Policy & Advisory">Climate Policy &amp; Advisory</option>
              <option value="Satellite Telemetry & Remote Sensing">Satellite Telemetry &amp; Remote Sensing</option>
            </select>
          </div>

          {/* Academic Qualification */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Academic Qualification &amp; Degrees (Optional)</label>
            <input type="text" placeholder="e.g. Ph.D. Atmospheric Physics & Attribution Science" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className="input-field" style={{ paddingLeft: '1rem' }} />
          </div>

          {/* Image Upload */}
          <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F4' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0B1E3D', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={18} color="#00C8C8" />
              <span>Profile Photo (Device Upload or Image Link)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '1rem', overflow: 'hidden', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #00C8C8' }}>
                {formData.photo ? <img src={formData.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={28} color="#94A3B8" />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #00C8C8, #1A3461)', color: '#fff', fontWeight: 700, padding: '0.55rem 1.1rem', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.825rem', width: 'fit-content' }}>
                  <Upload size={15} />
                  <span>Choose Photo from Device</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                <input type="text" placeholder="Or paste web image URL (https://...)" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} className="input-field" style={{ paddingLeft: '0.75rem', fontSize: '0.8rem' }} />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>LinkedIn URL (Optional)</label>
            <input type="text" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="input-field" style={{ paddingLeft: '1rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Google Scholar URL (Optional)</label>
            <input type="text" placeholder="https://scholar.google.com/..." value={formData.google_scholar} onChange={(e) => setFormData({ ...formData, google_scholar: e.target.value })} className="input-field" style={{ paddingLeft: '1rem' }} />
          </div>

          {/* Bio Text */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0B1E3D', marginBottom: '0.35rem', display: 'block' }}>Scientific Biography (Bio Text)</label>
            <textarea rows={3} placeholder="Write academic background and research summary..." value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="input-field" style={{ paddingLeft: '1rem', height: 'auto' }} />
          </div>

          {/* Home Page Card Feature */}
          {isSuperAdmin && (
            <div style={{ gridColumn: '1 / -1', padding: '1rem', background: '#F0FDFA', border: '2px dashed #00C8C8', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="checkbox" id="show_on_home" checked={formData.show_on_home || false} onChange={(e) => setFormData({ ...formData, show_on_home: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#00C8C8' }} />
              <div>
                <label htmlFor="show_on_home" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F766E', cursor: 'pointer', display: 'block' }}>
                  ⭐ Feature Card on Home Page ("Meet Our Lead Climate Scientists")
                </label>
                <span style={{ fontSize: '0.75rem', color: '#6B7A95' }}>Check this box to include this scientist on the featured home page cards.</span>
              </div>
            </div>
          )}

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" disabled={saving} className="btn-teal" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} />
              <span>{saving ? 'Saving...' : formData.id ? 'Update Team Member' : 'Add Team Member & Auto-Generate Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SUPER ADMIN TABLE */}
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
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading directory...</td></tr>
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
                      <button onClick={() => populateForm(item)} className="topbar-btn" style={{ display: 'inline-flex', marginRight: '0.4rem' }} title="Load into Form">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget({ id: item.id, title: item.name })} className="topbar-btn" style={{ display: 'inline-flex', color: '#dc2626' }} title="Delete Member">
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

      {/* Credentials Modal */}
      <CredentialsModal
        isOpen={credModal.open}
        name={credModal.name}
        email={credModal.email}
        password={credModal.password}
        onClose={() => setCredModal({ open: false, name: '', email: '', password: '' })}
      />

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
