import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Wrench } from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

export const ToolsManager: React.FC = () => {
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
      } else {
        await api.createTool(formData);
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save tool');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteTool(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete tool');
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
