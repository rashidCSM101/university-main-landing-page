import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Wrench, Upload, Image as ImageIcon } from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useToast } from '../../context/ToastContext';
import { compressImage, formatBytes } from '../../utils/imageCompressor';

export const ToolsManager: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    title: '',
    sector: 'Climate',
    description: '',
    external_url: 'https://pakclimtool.com',
    thumbnail: '',
    sort_order: 1,
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminTools();
      setItems(data);
    } catch {
      setItems([
        { id: '1', title: 'PakClim Weather Tool', sector: 'Meteo', description: 'Weather visualization platform', external_url: 'https://pakclimtool.com', is_active: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.updateTool(formData.id, formData);
        toast.success('Tool updated successfully!');
      } else {
        await api.createTool(formData);
        toast.success('Tool created successfully!');
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      toast.error('Failed to save tool', err?.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteTool(deleteTarget.id);
      toast.success('Tool deleted successfully.');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error('Failed to delete tool', err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreate = () => {
    setFormData({
      id: null,
      title: '',
      sector: 'Climate',
      description: '',
      external_url: 'https://pakclimtool.com',
      thumbnail: '',
      sort_order: 1,
      is_active: true,
    });
    setIsEditing(true);
  };

  const openEdit = (item: any) => {
    setFormData({ ...item });
    setIsEditing(true);
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Sector Tools Manager</h1>
          <p className="page-subtitle">Manage climate, meteo, energy, and water tool links on /tools page</p>
        </div>
        <button onClick={openCreate} className="btn-teal">
          <Plus size={18} /> New Tool Link
        </button>
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#0B1E3D', marginBottom: '1.25rem' }}>
            {formData.id ? 'Edit Tool' : 'Add Tool Link'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Tool Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Sector</label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="Climate">Climate</option>
                <option value="Meteo">Meteorological</option>
                <option value="Energy">Energy</option>
                <option value="Water">Water & Hydrology</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>External Tool URL</label>
              <input
                type="url"
                required
                value={formData.external_url}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F4' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E3D', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <ImageIcon size={16} color="#00C8C8" /> Tool Thumbnail / Icon
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <label className="btn-teal" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={15} /> Upload Tool Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const result = await compressImage(file, {
                          maxWidth: 600,
                          maxHeight: 600,
                          quality: 0.85,
                          format: 'image/webp',
                        });
                        setFormData({ ...formData, thumbnail: result.dataUrl });
                        const savedPercent = Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100);
                        if (savedPercent > 20) {
                          toast.success(`Tool icon auto-optimized: ${formatBytes(result.originalSize)} ➔ ${formatBytes(result.compressedSize)} (${savedPercent}% saved)`);
                        } else {
                          toast.success('Tool icon loaded successfully!');
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
                placeholder="https://... or upload tool image from device"
              />

              {formData.thumbnail && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #00C8C8' }}>
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: '#0B1E3D', fontWeight: 700, display: 'block' }}>
                      {formData.thumbnail.startsWith('data:image') ? '✓ Local Tool Image Loaded' : '✓ Web Image URL Set'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#6B7A95' }}>Auto-optimized WebP</span>
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
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Description</label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem', height: 'auto' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-teal">Save Tool</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 600 }}>
              <th style={{ padding: '0.875rem 1rem' }}>Tool Title</th>
              <th style={{ padding: '0.875rem 1rem' }}>Sector</th>
              <th style={{ padding: '0.875rem 1rem' }}>External Link</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading tools...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No tools registered.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>{item.title}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className="badge badge-teal">{item.sector}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#009A9A' }}>
                    <a href={item.external_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                      {item.external_url}
                    </a>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <button onClick={() => openEdit(item)} className="topbar-btn" style={{ display: 'inline-flex', marginRight: '0.4rem' }}>
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: item.id, title: item.title })} className="topbar-btn" style={{ display: 'inline-flex', color: '#dc2626' }}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Climate Tool"
        itemTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
