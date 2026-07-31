import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, BookOpen, Search } from 'lucide-react';

export const PublicationsManager: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    type: 'peer-reviewed',
    title: '',
    author_name: 'Dr. Rashid',
    outlet_name: '',
    external_url: '',
    published_date: new Date().toISOString().split('T')[0],
    abstract: '',
    status: 'published',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminPublications();
      setItems(data);
    } catch {
      setItems([
        { id: '1', type: 'peer-reviewed', title: 'Extreme Precipitation Attribution over the Indus Basin', author_name: 'Dr. Rashid', outlet_name: 'Journal of Climate Dynamics', published_date: '2025-04-15', status: 'published' },
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
        await api.updatePublication(formData.id, formData);
      } else {
        await api.createPublication(formData);
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save publication');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this publication?')) return;
    try {
      await api.deletePublication(id);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    }
  };

  const openCreate = () => {
    setFormData({
      id: null,
      type: 'peer-reviewed',
      title: '',
      author_name: 'Dr. Rashid',
      outlet_name: '',
      external_url: '',
      published_date: new Date().toISOString().split('T')[0],
      abstract: '',
      status: 'published',
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
          <h1 className="page-title">Publications & Reports Manager</h1>
          <p className="page-subtitle">Manage peer-reviewed climate research and technical policy reports</p>
        </div>
        <button onClick={openCreate} className="btn-teal">
          <Plus size={18} /> New Publication
        </button>
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#0B1E3D', marginBottom: '1.25rem' }}>
            {formData.id ? 'Edit Publication' : 'Add New Publication'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Publication Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="peer-reviewed">Peer-Reviewed Paper</option>
                <option value="report">Policy & Technical Report</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Published Date</label>
              <input
                type="date"
                value={formData.published_date || ''}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
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
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Lead Author</label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Journal / Outlet Name</label>
              <input
                type="text"
                value={formData.outlet_name}
                onChange={(e) => setFormData({ ...formData, outlet_name: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Journal of Climate Dynamics"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>DOI or External URL</label>
              <input
                type="url"
                value={formData.external_url || ''}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="https://doi.org/10.1007/..."
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Abstract / Executive Summary</label>
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
              <th style={{ padding: '0.875rem 1rem' }}>Outlet / Journal</th>
              <th style={{ padding: '0.875rem 1rem' }}>Date</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading publications...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No publications registered.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>{item.title}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>{item.type}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4D5D78' }}>{item.outlet_name || 'N/A'}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6B7A95' }}>{item.published_date || 'N/A'}</td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <button onClick={() => openEdit(item)} className="topbar-btn" style={{ display: 'inline-flex', marginRight: '0.4rem' }}>
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="topbar-btn" style={{ display: 'inline-flex', color: '#dc2626' }}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
