import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  CheckCheck,
  Clock,
  CheckCircle2,
  Users,
  UserCheck,
  X,
  Star,
  UserPlus,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { compressImage, formatBytes } from '../../utils/imageCompressor';

export const PublicationsManager: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isPowerUser = user?.role === 'super_admin' || user?.role === 'admin';
  const [items, setItems] = useState<any[]>([]);
  const [registeredMembers, setRegisteredMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Author Multi-Select State
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [customAuthorInput, setCustomAuthorInput] = useState('');

  const [formData, setFormData] = useState<any>({
    id: null,
    type: 'peer-reviewed',
    title: '',
    author_name: '',
    outlet_name: '',
    external_url: '',
    thumbnail: '',
    published_date: new Date().toISOString().split('T')[0],
    abstract: '',
    status: 'published',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pubs, team] = await Promise.all([
        api.getAdminPublications(),
        api.getAdminTeam().catch(() => []),
      ]);
      setItems(pubs);
      setRegisteredMembers(team);
    } catch {
      setItems([
        { id: '1', type: 'peer-reviewed', title: 'Extreme Precipitation Attribution over the Indus Basin', author_name: 'Dr. Rashid Hussain', outlet_name: 'Journal of Climate Dynamics', published_date: '2025-04-15', status: 'published' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadAuthor = selectedAuthors[0] || formData.author_name || user?.name || 'Dr. Rashid Hussain';
      const coAuthors = selectedAuthors.slice(1);

      const payload = {
        ...formData,
        author_name: leadAuthor,
        co_authors: coAuthors,
      };

      if (formData.id) {
        await api.updatePublication(formData.id, payload);
        toast.success('Publication updated successfully!');
      } else {
        await api.createPublication(payload);
        toast.success(isPowerUser ? 'Publication published successfully!' : 'Publication submitted for review!');
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      toast.error('Failed to save publication', err?.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deletePublication(deleteTarget.id);
      toast.success('Publication deleted successfully.');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error('Failed to delete publication', err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.approvePublication(id);
      toast.success('Publication approved and published live!');
      loadData();
    } catch (err: any) {
      toast.error('Failed to approve publication', err?.message);
    }
  };

  const openCreate = () => {
    const defaultAuthor = user?.name || (registeredMembers[0]?.name) || 'Dr. Rashid Hussain';
    setSelectedAuthors([defaultAuthor]);
    setCustomAuthorInput('');
    setFormData({
      id: null,
      type: 'peer-reviewed',
      title: '',
      author_name: defaultAuthor,
      outlet_name: '',
      external_url: '',
      thumbnail: '',
      published_date: new Date().toISOString().split('T')[0],
      abstract: '',
      status: 'published',
    });
    setIsEditing(true);
  };

  const openEdit = (item: any) => {
    const co = Array.isArray(item.co_authors)
      ? item.co_authors
      : typeof item.co_authors === 'string'
        ? item.co_authors.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
    const all = [item.author_name, ...co].filter(Boolean);
    setSelectedAuthors(all.length > 0 ? all : [user?.name || 'Dr. Rashid Hussain']);
    setCustomAuthorInput('');
    setFormData({ ...item, thumbnail: item.thumbnail || '' });
    setIsEditing(true);
  };

  const toggleRegisteredMember = (name: string) => {
    if (selectedAuthors.includes(name)) {
      setSelectedAuthors(selectedAuthors.filter((a) => a !== name));
    } else {
      setSelectedAuthors([...selectedAuthors, name]);
    }
  };

  const handleAddCustomAuthor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customAuthorInput.trim();
    if (!trimmed) return;
    if (!selectedAuthors.includes(trimmed)) {
      setSelectedAuthors([...selectedAuthors, trimmed]);
    }
    setCustomAuthorInput('');
  };

  const removeAuthor = (name: string) => {
    setSelectedAuthors(selectedAuthors.filter((a) => a !== name));
  };

  const setAsLeadAuthor = (name: string) => {
    const rest = selectedAuthors.filter((a) => a !== name);
    setSelectedAuthors([name, ...rest]);
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Publications &amp; Reports Manager</h1>
          <p className="page-subtitle">Manage peer-reviewed climate research and technical policy reports</p>
        </div>
        <button onClick={openCreate} className="btn-teal">
          <Plus size={18} /> New Publication
        </button>
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8', borderRadius: '20px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#0B1E3D', marginBottom: '1.25rem' }}>
            {formData.id ? 'Edit Publication' : 'Add New Publication'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Publication Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="peer-reviewed">Peer-Reviewed Paper</option>
                <option value="report">Policy &amp; Technical Report</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Published Date</label>
              <input
                type="date"
                value={formData.published_date || ''}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Paper / Report Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Extreme Precipitation Attribution over the Indus Basin"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            {/* ── DYNAMIC REGISTERED & CUSTOM AUTHORS SECTION ── */}
            <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B1E3D', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={18} color="#00C8C8" />
                  <span>Authors &amp; Co-Authors (Registered Company Members + Custom)</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  First author is assigned as <strong>Lead Author</strong>
                </span>
              </div>

              {/* 1. Quick Member Selector Pills from Backend */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                  Select from Registered Company Team Members:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {registeredMembers.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>No registered team members found.</span>
                  ) : (
                    registeredMembers.map((member) => {
                      const isSelected = selectedAuthors.includes(member.name);
                      return (
                        <button
                          key={member.id || member.name}
                          type="button"
                          onClick={() => toggleRegisteredMember(member.name)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '999px',
                            border: isSelected ? '1.5px solid #00C8C8' : '1px solid #CBD5E1',
                            background: isSelected ? 'rgba(0, 200, 200, 0.15)' : '#ffffff',
                            color: isSelected ? '#007A7A' : '#334155',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isSelected ? <UserCheck size={14} color="#00C8C8" /> : <Users size={14} color="#94A3B8" />}
                          <span>{member.name}</span>
                          <span style={{ fontSize: '0.68rem', color: '#64748B', opacity: 0.85 }}>({member.role || 'Member'})</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 2. Custom Author Name Input */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Type custom external author name (e.g. Dr. Jane Smith, Oxford)..."
                  value={customAuthorInput}
                  onChange={(e) => setCustomAuthorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAuthor();
                    }
                  }}
                  className="input-field"
                  style={{ paddingLeft: '1rem', flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomAuthor()}
                  className="btn-ghost"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fff', border: '1px solid #00C8C8', color: '#00A3A3', fontWeight: 700 }}
                >
                  <UserPlus size={16} />
                  <span>Add Author</span>
                </button>
              </div>

              {/* 3. Selected Authors Ordered Chips */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                  Selected Authors ({selectedAuthors.length}):
                </div>
                {selectedAuthors.length === 0 ? (
                  <div style={{ fontSize: '0.78rem', color: '#DC2626', fontStyle: 'italic' }}>
                    * Please select at least one author.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedAuthors.map((author, index) => {
                      const isLead = index === 0;
                      return (
                        <div
                          key={author}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '12px',
                            background: isLead ? 'linear-gradient(135deg, #0B1E3D 0%, #1A3461 100%)' : '#ffffff',
                            color: isLead ? '#ffffff' : '#1E293B',
                            border: isLead ? '1.5px solid #00C8C8' : '1px solid #CBD5E1',
                            fontSize: '0.825rem',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                          }}
                        >
                          {isLead ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#00C8C8', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                              <Star size={12} fill="#00C8C8" /> Lead Author:
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                              Co-Author:
                            </span>
                          )}

                          <span style={{ fontWeight: 700 }}>{author}</span>

                          {!isLead && (
                            <button
                              type="button"
                              onClick={() => setAsLeadAuthor(author)}
                              title="Set as Lead Author"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#00A3A3',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                textDecoration: 'underline',
                                padding: 0,
                              }}
                            >
                              Make Lead
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => removeAuthor(author)}
                            title="Remove Author"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: isLead ? '#94A3B8' : '#EF4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              padding: 0,
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Journal / Outlet Name</label>
              <input
                type="text"
                value={formData.outlet_name}
                onChange={(e) => setFormData({ ...formData, outlet_name: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Journal of Climate Dynamics"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>DOI or External URL</label>
              <input
                type="url"
                value={formData.external_url || ''}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="https://doi.org/10.1007/..."
              />
            </div>

            {/* Cover / Report Thumbnail URL & Device File Upload */}
            <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F4' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E3D', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <ImageIcon size={16} color="#00C8C8" /> Report / Publication Cover Thumbnail
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <label className="btn-teal" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={15} /> Upload Cover from Device
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        // Auto-compress report thumbnail (max 800x1000 WebP < 60 KB)
                        const result = await compressImage(file, {
                          maxWidth: 800,
                          maxHeight: 1000,
                          quality: 0.82,
                          format: 'image/webp',
                        });
                        setFormData({ ...formData, thumbnail: result.dataUrl });
                        const savedPercent = Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100);
                        if (savedPercent > 20) {
                          toast.success(`Cover auto-optimized: ${formatBytes(result.originalSize)} ➔ ${formatBytes(result.compressedSize)} (${savedPercent}% saved)`);
                        } else {
                          toast.success('Cover loaded successfully!');
                        }
                      } catch (err: any) {
                        toast.error('Failed to process image', err?.message);
                      }
                    }}
                  />
                </label>
                <span style={{ fontSize: '0.8rem', color: '#9AA5BC', fontStyle: 'italic' }}>or paste web image link:</span>
              </div>

              <input
                type="text"
                value={
                  formData.thumbnail && formData.thumbnail.startsWith('data:image')
                    ? '[Device Image File Loaded Successfully]'
                    : formData.thumbnail || ''
                }
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem', marginTop: '0.5rem', background: '#fff' }}
                placeholder="https://... or upload report cover above"
              />

              {formData.thumbnail && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #00C8C8' }}>
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: '#0B1E3D', fontWeight: 700, display: 'block' }}>
                      {formData.thumbnail.startsWith('data:image') ? '✓ Local Report Cover Loaded' : '✓ Web Image URL Set'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#6B7A95' }}>Auto-optimized WebP thumbnail</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnail: '' })}
                    style={{ fontSize: '0.75rem', color: '#dc2626', background: '#FEE2E2', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'block', marginBottom: '0.35rem' }}>Abstract / Executive Summary</label>
              <textarea
                rows={4}
                value={formData.abstract || ''}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem', height: 'auto' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-teal">Save Publication</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 600 }}>
              <th style={{ padding: '0.875rem 1rem' }}>Title</th>
              <th style={{ padding: '0.875rem 1rem' }}>Type</th>
              <th style={{ padding: '0.875rem 1rem' }}>Lead &amp; Co-Authors</th>
              <th style={{ padding: '0.875rem 1rem' }}>Journal / Outlet</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading publications...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No publications registered.</td></tr>
            ) : (
              items.map((item) => {
                const co = Array.isArray(item.co_authors)
                  ? item.co_authors
                  : typeof item.co_authors === 'string'
                    ? item.co_authors.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : [];

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>{item.title}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>{item.type}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#1E293B' }}>
                      <div style={{ fontWeight: 600 }}>{item.author_name || 'Dr. Rashid'}</div>
                      {co.length > 0 && (
                        <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '2px' }}>
                          + {co.join(', ')}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#4D5D78' }}>{item.outlet_name || 'N/A'}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {item.status === 'pending' ? (
                        <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> Pending Approval
                        </span>
                      ) : (
                        <span className={`badge ${item.status === 'published' ? 'badge-teal' : 'badge-gold'}`}>
                          {item.status || 'published'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isPowerUser && item.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="btn-teal"
                          style={{
                            padding: '0.25rem 0.65rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            marginRight: '0.4rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                          title="Approve &amp; Publish Immediately"
                        >
                          <CheckCheck size={13} /> Approve
                        </button>
                      )}

                      {(isPowerUser || item.author_name?.toLowerCase().trim() === user?.name?.toLowerCase().trim()) && (
                        <button onClick={() => openEdit(item)} className="topbar-btn" style={{ display: 'inline-flex', marginRight: '0.4rem' }}>
                          <Edit2 size={15} />
                        </button>
                      )}

                      {isPowerUser && (
                        <button onClick={() => setDeleteTarget({ id: item.id, title: item.title })} className="topbar-btn" style={{ display: 'inline-flex', color: '#dc2626' }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Publication"
        itemTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
