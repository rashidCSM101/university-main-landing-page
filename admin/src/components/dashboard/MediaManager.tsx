import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Upload,
  CheckCheck,
  Clock,
  CheckCircle2,
  Users,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { MarkdownEditor } from '../common/MarkdownEditor';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const MediaManager: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isPowerUser = user?.role === 'super_admin' || user?.role === 'admin';
  const [items, setItems] = useState<any[]>([]);
  const [registeredMembers, setRegisteredMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [customAuthorInput, setCustomAuthorInput] = useState('');
  const [formData, setFormData] = useState<any>({
    id: null,
    type: 'blog',
    title: '',
    slug: '',
    body: '',
    excerpt: '',
    external_url: '',
    embed_url: '',
    cover_image: '',
    author_name: 'Dr. Rashid',
    co_authors: [],
    tags: 'Climate, South Asia',
    status: 'published',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, team] = await Promise.all([
        api.getAdminMedia(selectedType !== 'all' ? { type: selectedType } : undefined),
        api.getAdminTeam().catch(() => []),
      ]);
      setItems(data);
      setRegisteredMembers(team);
    } catch {
      setItems([
        { id: '1', type: 'blog', title: 'Heatwave Attribution in South Asia 2025', slug: 'heatwave-attribution-2025', status: 'published', author_name: 'Dr. Rashid Hussain', co_authors: ['Aqsa Sarfraz'], created_at: new Date().toISOString() },
        { id: '2', type: 'talkshow', title: 'Climate Resilience & Flood Warning Talkshow', slug: 'talkshow-climate-resilience', embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', status: 'published', author_name: 'Dr. Rashid Hussain', created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedType]);

  const toggleRegisteredMember = (name: string) => {
    if (selectedAuthors.includes(name)) {
      setSelectedAuthors(selectedAuthors.filter((a) => a !== name));
    } else {
      setSelectedAuthors([...selectedAuthors, name]);
    }
  };

  const handleAddCustomAuthor = () => {
    if (!customAuthorInput.trim()) return;
    const name = customAuthorInput.trim();
    if (!selectedAuthors.includes(name)) {
      setSelectedAuthors([...selectedAuthors, name]);
    }
    setCustomAuthorInput('');
  };

  const removeAuthor = (name: string) => {
    setSelectedAuthors(selectedAuthors.filter((a) => a !== name));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = typeof formData.tags === 'string'
      ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : formData.tags;

    const leadAuthor = selectedAuthors[0] || formData.author_name || user?.name || 'Dr. Rashid';
    const coAuthors = selectedAuthors.slice(1);

    const payload = {
      ...formData,
      author_name: leadAuthor,
      co_authors: coAuthors,
      tags: tagArray,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };

    try {
      if (formData.id) {
        await api.updateMedia(formData.id, payload);
        toast.success('Media item updated successfully!');
      } else {
        await api.createMedia(payload);
        toast.success(isPowerUser ? 'Media item published successfully!' : 'Media item submitted for review!');
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      toast.error('Failed to save media item', err?.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMedia(deleteTarget.id);
      toast.success('Media item deleted successfully.');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error('Failed to delete media item', err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.approveMedia(id);
      toast.success('Post approved and published live!');
      loadData();
    } catch (err: any) {
      toast.error('Failed to approve media post', err?.message);
    }
  };

  const openCreate = () => {
    setFormData({
      id: null,
      type: 'blog',
      title: '',
      slug: '',
      body: '',
      excerpt: '',
      external_url: '',
      embed_url: '',
      cover_image: '',
      author_name: user?.name || 'Dr. Rashid',
      co_authors: [],
      tags: 'Climate Change, South Asia',
      status: 'published',
    });
    setSelectedAuthors([user?.name || 'Dr. Rashid']);
    setCustomAuthorInput('');
    setIsEditing(true);
  };

  const openEdit = (item: any) => {
    const allAuthors = [item.author_name, ...(Array.isArray(item.co_authors) ? item.co_authors : [])].filter(Boolean);
    setSelectedAuthors(allAuthors.length > 0 ? allAuthors : [item.author_name || user?.name || 'Dr. Rashid']);
    setCustomAuthorInput('');
    setFormData({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
    });
    setIsEditing(true);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedType === 'pending') {
      return item.status === 'pending';
    }
    if (selectedType !== 'all') {
      return item.type === selectedType;
    }
    return true;
  });

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Blogs &amp; Media Manager</h1>
          <p className="page-subtitle">Publish articles, documentaries, podcasts, talkshows, and print media</p>
        </div>
        <button onClick={openCreate} className="btn-teal">
          <Plus size={18} /> New Media Item
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem', alignItems: 'center' }}>
        {['all', 'blog', 'documentary', 'podcast', 'talkshow', 'print'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`btn-ghost ${selectedType === t ? 'active' : ''}`}
            style={{
              fontSize: '0.8rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              textTransform: 'capitalize',
              background: selectedType === t ? '#0B1E3D' : '#fff',
              color: selectedType === t ? '#00C8C8' : '#4D5D78',
              borderColor: selectedType === t ? '#0B1E3D' : '#E2E8F4',
            }}
          >
            {t}
          </button>
        ))}

        {/* Pending Review Filter */}
        <button
          onClick={() => setSelectedType(selectedType === 'pending' ? 'all' : 'pending')}
          className={`btn-ghost ${selectedType === 'pending' ? 'active' : ''}`}
          style={{
            fontSize: '0.8rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            background: selectedType === 'pending' ? '#D97706' : '#FEF3C7',
            color: selectedType === 'pending' ? '#ffffff' : '#B45309',
            borderColor: '#FCD34D',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Clock size={13} />
          <span>Pending Review ({items.filter(i => i.status === 'pending').length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '1.5rem' }}>
        <Search size={16} color="#9AA5BC" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Filter by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#0B1E3D', marginBottom: '1.25rem' }}>
            {formData.id ? 'Edit Media Item' : 'Create New Media Item'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Media Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="blog">Blog Article</option>
                <option value="documentary">Documentary</option>
                <option value="talkshow">Talkshow Video</option>
                <option value="podcast">Podcast &amp; Radio</option>
                <option value="print">Print Media Excerpt</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Extreme Weather Attribution Talkshow"
              />
            </div>

            {/* Talkshow / Documentary Video Embed URL */}
            {(formData.type === 'talkshow' || formData.type === 'documentary') && (
              <div style={{ gridColumn: '1 / -1', background: '#F0F7FF', padding: '1rem', borderRadius: '10px', border: '1px solid #B8D8F0' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E3D', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Video size={16} color="#00C8C8" /> Talkshow / Video Embed URL (YouTube or Vimeo)
                </label>
                <input
                  type="url"
                  value={formData.embed_url || ''}
                  onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '1rem', marginTop: '0.4rem', background: '#fff' }}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID or https://player.vimeo.com/video/..."
                />
                <span style={{ fontSize: '0.75rem', color: '#6B7A95', marginTop: '0.2rem', display: 'block' }}>
                  Paste YouTube Embed URL to allow instant video playback on the website.
                </span>
              </div>
            )}

            {/* External URL (For Talkshows, Podcasts, or Print Outlets) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <LinkIcon size={14} color="#009A9A" /> External Link / Original Source URL (Optional)
              </label>
              <input
                type="url"
                value={formData.external_url || ''}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="https://youtube.com/watch?v=... or https://dawn.com/..."
              />
            </div>

            {/* Cover Image / Thumbnail URL & Device File Upload */}
            <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F4' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E3D', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <ImageIcon size={16} color="#00C8C8" /> Cover Image / Thumbnail
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                {/* Device File Input */}
                <label className="btn-teal" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={15} /> Upload Image from Device
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          setFormData({ ...formData, cover_image: uploadEvent.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <span style={{ fontSize: '0.8rem', color: '#9AA5BC', fontStyle: 'italic' }}>or paste web image link:</span>
              </div>

              <input
                type="text"
                value={
                  formData.cover_image && formData.cover_image.startsWith('data:image')
                    ? '[Device Image File Loaded Successfully]'
                    : formData.cover_image || ''
                }
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem', marginTop: '0.6rem', background: '#fff' }}
                placeholder="https://images.unsplash.com/... or upload from device above"
              />

              {/* Image Live Preview */}
              {formData.cover_image && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #00C8C8' }}>
                  <img
                    src={formData.cover_image}
                    alt="Preview"
                    style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: '#0B1E3D', fontWeight: 700, display: 'block' }}>
                      {formData.cover_image.startsWith('data:image') ? '✓ Local Device Image Loaded' : '✓ Web Image URL Set'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#6B7A95' }}>Ready to save and display on website</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image: '' })}
                    style={{ fontSize: '0.75rem', color: '#dc2626', background: '#FEE2E2', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* ── DYNAMIC REGISTERED & CUSTOM AUTHORS SECTION ── */}
            <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0B1E3D', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={18} color="#00C8C8" />
                  <span>Authors &amp; Co-Authors (Registered Faculty Members + Custom)</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  First author is assigned as <strong>Lead Author</strong>
                </span>
              </div>

              {/* 1. Quick Member Selector Pills from Backend */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                  Select from Registered Team Members:
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
                  placeholder="Type custom external author/speaker name (e.g. Dr. Jane Smith, Oxford)..."
                  value={customAuthorInput}
                  onChange={(e) => setCustomAuthorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAuthor();
                    }
                  }}
                  className="input-field"
                  style={{ paddingLeft: '1rem', flex: 1, background: '#fff' }}
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
                    * Please select at least one author or click a member pill above.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedAuthors.map((author, index) => (
                      <div
                        key={author + index}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: index === 0 ? 'linear-gradient(135deg, #0B1E3D, #1A3461)' : '#E2E8F0',
                          color: index === 0 ? '#00C8C8' : '#1E293B',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          boxShadow: index === 0 ? '0 2px 8px rgba(11, 30, 61, 0.2)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', opacity: 0.85, background: index === 0 ? 'rgba(0, 200, 200, 0.2)' : 'rgba(0,0,0,0.06)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                          {index === 0 ? 'Lead Author' : `Co-Author #${index}`}
                        </span>
                        <span>{author}</span>
                        <button
                          type="button"
                          onClick={() => removeAuthor(author)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: index === 0 ? '#FF6B6B' : '#64748B',
                            fontWeight: 900,
                            padding: '0 0.2rem',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Remove author"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="Talkshow, Climate Change, Attribution"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Excerpt / Summary</label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem', height: 'auto' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B', marginBottom: '0.4rem', display: 'block' }}>
                Body Content (Markdown Supported with Live Preview)
              </label>
              <MarkdownEditor
                value={formData.body || ''}
                onChange={(val) => setFormData({ ...formData, body: val })}
                placeholder="Write article or media notes in markdown (e.g. ## Overview, **key findings**, bullet points)..."
                rows={8}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn-teal">
                Save &amp; Publish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List */}
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 600 }}>
              <th style={{ padding: '0.875rem 1rem' }}>Title</th>
              <th style={{ padding: '0.875rem 1rem' }}>Type</th>
              <th style={{ padding: '0.875rem 1rem' }}>Author / Source</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading media items...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No media items found.</td></tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>
                    {item.title}
                    {item.embed_url && (
                      <div style={{ fontSize: '0.725rem', color: '#009A9A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Video size={12} />
                        <span>Video Embed Configured</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className="badge badge-navy" style={{ textTransform: 'capitalize' }}>{item.type}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4D5D78' }}>{item.author_name || 'Dr. Rashid'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {item.status === 'pending' ? (
                      <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> Pending Approval
                      </span>
                    ) : (
                      <span className={`badge ${item.status === 'published' ? 'badge-teal' : 'badge-gold'}`}>
                        {item.status}
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
                        title="Approve and Publish Immediately"
                      >
                        <CheckCheck size={13} /> Approve
                      </button>
                    )}

                    {(isPowerUser || item.author_name?.toLowerCase().trim() === user?.name?.toLowerCase().trim()) && (
                      <button onClick={() => openEdit(item)} className="topbar-btn" style={{ display: 'inline-flex', marginRight: '0.4rem' }} title="Edit">
                        <Edit2 size={15} />
                      </button>
                    )}

                    {isPowerUser && (
                      <button onClick={() => setDeleteTarget({ id: item.id, title: item.title })} className="topbar-btn" style={{ display: 'inline-flex', color: '#dc2626' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Media Item"
        itemTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
