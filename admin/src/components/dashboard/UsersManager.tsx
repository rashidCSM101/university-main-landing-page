import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, UserCheck, ShieldCheck, UserX, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UsersManager: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    password: '',
    role: 'member',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch {
      setUsers([
        { id: '1', name: 'Dr. Rashid', email: 'admin@wenclims.org', role: 'super_admin', is_active: true, created_at: new Date().toISOString() },
        { id: '2', name: 'Mehran', email: 'mehran@wenclims.org', role: 'admin', is_active: true, created_at: new Date().toISOString() },
        { id: '3', name: 'Dr. Ayesha Malik', email: 'ayesha@wenclims.org', role: 'member', is_active: true, created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent non-super_admin from selecting admin/super_admin role
    if (!isSuperAdmin && (formData.role === 'admin' || formData.role === 'super_admin')) {
      alert('Permission Denied: Admin accounts can only create Member user accounts.');
      return;
    }

    try {
      await api.createUser(formData);
      setFormData({ name: '', email: '', password: '', role: 'member' });
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to create user account');
    }
  };

  const handleRoleToggle = async (id: string, currentRole: string) => {
    if (!isSuperAdmin) {
      alert('Permission Denied: Only Super Admin can modify user roles.');
      return;
    }

    const nextRole = currentRole === 'super_admin' ? 'admin' : currentRole === 'admin' ? 'member' : 'admin';
    try {
      await api.updateUserRole(id, nextRole);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async (id: string) => {
    try {
      await api.toggleUserStatus(id);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">User Roles &amp; Account Controls</h1>
          <p className="page-subtitle">
            {isSuperAdmin
              ? 'Super Admin Console: Create Super Admin, Executive Admin, and Member accounts'
              : 'Admin Console: Create new Member accounts (Admins can only add Members)'}
          </p>
        </div>
        <button onClick={() => setIsEditing(true)} className="btn-teal">
          <Plus size={18} /> Add New User Account
        </button>
      </div>

      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8', borderRadius: '16px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', color: '#0B1E3D', marginBottom: '1.25rem' }}>
            Create New Account
          </h2>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Ayesha Malik"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Email Address *</label>
              <input
                type="email"
                required
                placeholder="ayesha@wenclims.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Initial Password (min 6 chars) *</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Assign Account Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
              >
                <option value="member">Member Scientist (Submits Own Posts &amp; Bio)</option>
                {isSuperAdmin && <option value="admin">Executive Admin (Manages All Content &amp; Adds Members)</option>}
                {isSuperAdmin && <option value="super_admin">Super Admin (Full System Access)</option>}
              </select>
              {!isSuperAdmin && (
                <span style={{ fontSize: '0.725rem', color: '#6B7A95', marginTop: '0.25rem', display: 'block' }}>
                  Note: As an Admin, you can only create Member accounts. Super Admin role required for Admin promotion.
                </span>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-teal">Create Account</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F0F4FA', borderBottom: '1px solid #E2E8F4', color: '#0B1E3D', fontWeight: 600 }}>
              <th style={{ padding: '0.875rem 1rem' }}>User</th>
              <th style={{ padding: '0.875rem 1rem' }}>Email</th>
              <th style={{ padding: '0.875rem 1rem' }}>Role</th>
              <th style={{ padding: '0.875rem 1rem' }}>Status</th>
              <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading user directory...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>{u.name}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4D5D78' }}>{u.email}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`badge ${u.role === 'super_admin' ? 'badge-teal' : u.role === 'admin' ? 'badge-gold' : 'badge-navy'}`}>
                      {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Executive Admin' : 'Member'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`badge ${u.is_active ? 'badge-teal' : 'badge-gold'}`}>
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        className="btn-ghost"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', marginRight: '0.4rem' }}
                      >
                        Change Role
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusToggle(u.id)}
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: u.is_active ? '#dc2626' : '#16a34a' }}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
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
