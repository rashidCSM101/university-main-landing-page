import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit2, Trash2, FolderKanban } from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useToast } from '../../context/ToastContext';

export const ProjectsManager: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    title: '',
    slug: '',
    funder_name: 'ADB',
    funder_code: 'ADB-55236-001',
    region: 'South Asia / Pakistan',
    objectives: 'Climate Resilience, Weather Early Warning',
    activities: 'Attribution Modeling, Capacity Building',
    status: 'active',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminProjects();
      setItems(data);
    } catch {
      setItems([
        { id: '1', title: 'Asian Development Bank Regional Climate Risk Assessment', slug: 'adb-regional-climate-risk', funder_name: 'ADB', region: 'Indus Basin', status: 'active' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const objArray = typeof formData.objectives === 'string'
      ? formData.objectives.split(',').map((o: string) => o.trim()).filter(Boolean)
      : formData.objectives;

    const actArray = typeof formData.activities === 'string'
      ? formData.activities.split(',').map((a: string) => a.trim()).filter(Boolean)
      : formData.activities;

    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      objectives: objArray,
      activities: actArray,
    };

    try {
      if (formData.id) {
        await api.updateProject(formData.id, payload);
        toast.success('Project updated successfully!');
      } else {
        await api.createProject(payload);
        toast.success('Project created successfully!');
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      toast.error('Failed to save project', err?.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteProject(deleteTarget.id);
      toast.success('Project deleted successfully.');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error('Failed to delete project', err?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreate = () => {
    setFormData({
      id: null,
      title: '',
      slug: '',
      funder_name: '',
      funder_code: '',
      region: '',
      objectives: '',
      activities: '',
      status: 'active',
    });
    setIsEditing(true);
  };

  const openEdit = (item: any) => {
    setFormData({
      ...item,
      objectives: Array.isArray(item.objectives) ? item.objectives.join(', ') : item.objectives || '',
      activities: Array.isArray(item.activities) ? item.activities.join(', ') : item.activities || '',
    });
    setIsEditing(true);
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Projects & Grants Manager</h1>
          <p className="page-subtitle">Manage climate initiatives, funder codes, and regional activities</p>
        </div>
        <button onClick={openCreate} className="btn-teal">
          <Plus size={18} /> New Project
        </button>
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#0B1E3D', marginBottom: '1.25rem' }}>
            {formData.id ? 'Edit Project' : 'Add New Project'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Project Title</label>
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
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Funder / Partner Organization</label>
              <input
                type="text"
                value={formData.funder_name}
                onChange={(e) => setFormData({ ...formData, funder_name: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Asian Development Bank"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Funder Grant Code</label>
              <input
                type="text"
                value={formData.funder_code}
                onChange={(e) => setFormData({ ...formData, funder_code: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. ADB-55236-001"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Target Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="Indus Basin, Pakistan, South Asia"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="active">Active (Ongoing)</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Key Objectives (comma-separated)</label>
              <textarea
                rows={2}
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem', height: 'auto' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-teal">Save Project</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 600 }}>
              <th style={{ padding: '0.875rem 1rem' }}>Project Title</th>
              <th style={{ padding: '0.875rem 1rem' }}>Funder</th>
              <th style={{ padding: '0.875rem 1rem' }}>Region</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading projects...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No projects registered.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>
                    {item.title}
                    {item.funder_code && <div style={{ fontSize: '0.75rem', color: '#9AA5BC' }}>Code: {item.funder_code}</div>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4D5D78' }}>{item.funder_name || 'N/A'}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6B7A95' }}>{item.region || 'N/A'}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`badge ${item.status === 'active' ? 'badge-teal' : 'badge-navy'}`}>
                      {item.status}
                    </span>
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
        title="Delete Project Record"
        itemTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};
