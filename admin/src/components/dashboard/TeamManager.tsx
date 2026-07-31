import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

export const TeamManager: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    name: '',
    slug: '',
    role: 'Climate Attribution Scientist',
    team: 'leadership',
    bio: '',
    is_active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminTeam();
      setItems(data);
    } catch {
      setItems([
        { id: '1', name: 'Dr. Rashid', slug: 'dr-rashid', role: 'Executive Director', team: 'leadership', is_active: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };

    try {
      if (formData.id) {
        await api.updateTeamMember(formData.id, payload);
      } else {
        await api.createTeamMember(payload);
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save team member');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete team member record?')) return;
    try {
      await api.deleteTeamMember(id);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete');
    }
  };

  const openCreate = () => {
    setFormData({
      id: null,
      name: '',
      slug: '',
      role: 'Climate Scientist',
      team: 'leadership',
      bio: '',
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
          <h1 className="page-title">Our Team Manager</h1>
          <p className="page-subtitle">Manage leadership, policy, and data-modelling experts on the website</p>
        </div>
        <button onClick={openCreate} className="btn-teal">
          <Plus size={18} /> New Team Member
        </button>
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#0B1E3D', marginBottom: '1.25rem' }}>
            {formData.id ? 'Edit Team Member' : 'Add Team Member'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Role / Designation</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Team Category</label>
              <select
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="leadership">Executive & Leadership</option>
                <option value="policy">Policy & Adaptation</option>
                <option value="data-modelling">Data & Climate Modelling</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Biography & Expertise</label>
              <textarea
                rows={3}
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem', height: 'auto' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-teal">Save Team Member</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 600 }}>
              <th style={{ padding: '0.875rem 1rem' }}>Name</th>
              <th style={{ padding: '0.875rem 1rem' }}>Role</th>
              <th style={{ padding: '0.875rem 1rem' }}>Category</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading team members...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No team members found.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>{item.name}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4D5D78' }}>{item.role}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>{item.team}</span>
                  </td>
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
