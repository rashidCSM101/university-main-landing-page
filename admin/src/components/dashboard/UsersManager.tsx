import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, KeyRound, Copy, CheckCheck, RefreshCw, Trash2 } from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';

// ─── Credentials Modal ────────────────────────────────────────────────────────
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
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,30,61,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '2px solid #00C8C8' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #00C8C8, #1A3461)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <KeyRound size={24} color="#fff" />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#0B1E3D', margin: 0 }}>
            Account Created!
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6B7A95', marginTop: '0.4rem' }}>
            Share these login credentials with <strong>{name}</strong>
          </p>
        </div>

        <div style={{ background: '#F0F9F9', border: '1.5px solid #00C8C8', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Login URL</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0B1E3D' }}>https://hex-byte.tech/admin/</div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Email</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0B1E3D', fontFamily: 'monospace' }}>{email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Temporary Password</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00C8C8', fontFamily: 'monospace', letterSpacing: '1px' }}>{password}</div>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.6rem 0.875rem', marginBottom: '1.25rem' }}>
          ⚠️ Save this password now — it won't be shown again. The member should change their password after first login.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCopy} className="btn-teal" style={{ flex: 1 }}>
            {copied ? <><CheckCheck size={16} /> Copied!</> : <><Copy size={16} /> Copy Credentials</>}
          </button>
          <button onClick={onClose} className="btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const UsersManager: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState<string | null>(null);

  // Credentials modal state
  const [credModal, setCredModal] = useState<{ open: boolean; name: string; email: string; password: string }>({
    open: false, name: '', email: '', password: '',
  });

  const [formData, setFormData] = useState({ name: '', email: '', role: 'member' });

  const loadData = async () => {
    setLoading(true);
    try { setUsers(await api.getAdminUsers()); }
    catch { setUsers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // ── Create User ──
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin && (formData.role === 'admin' || formData.role === 'super_admin')) {
      alert('Permission Denied: You can only create Member accounts.');
      return;
    }
    try {
      const result = await api.createUser(formData);
      setFormData({ name: '', email: '', role: 'member' });
      setIsEditing(false);
      loadData();
      // Show credentials modal with the auto-generated password
      setCredModal({ open: true, name: result.name, email: result.email, password: result.temp_password });
    } catch (err: any) {
      alert(err?.message || 'Failed to create user account');
    }
  };

  // ── Reset Password ──
  const handleResetPassword = async (userId: string) => {
    if (!isSuperAdmin) return;
    if (!window.confirm('Reset this user\'s password and generate a new temporary password?')) return;
    setIsResetting(userId);
    try {
      const result = await api.resetUserPassword(userId);
      setCredModal({ open: true, name: result.name, email: result.email, password: result.temp_password });
    } catch (err: any) {
      alert(err?.message || 'Failed to reset password');
    } finally {
      setIsResetting(null);
    }
  };

  const handleRoleChange = async (id: string, nextRole: string) => {
    if (!isSuperAdmin) { alert('Permission Denied.'); return; }
    try { await api.updateUserRole(id, nextRole); loadData(); }
    catch (err: any) { alert(err?.message || 'Failed to update role'); }
  };

  const handleStatusToggle = async (id: string) => {
    try { await api.toggleUserStatus(id); loadData(); }
    catch (err: any) { alert(err?.message || 'Failed to toggle status'); }
  };

  const confirmDeleteUser = async () => {
    if (!deleteTarget || !isSuperAdmin) return;
    setIsDeleting(true);
    try {
      await api.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete user account');
    } finally {
      setIsDeleting(false);
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
              : 'Admin Console: Create new Member accounts'}
          </p>
        </div>
        <button onClick={() => setIsEditing(true)} className="btn-teal">
          <Plus size={18} /> Add New User Account
        </button>
      </div>

      {/* ── Create User Form ── */}
      {isEditing && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#fff', border: '2px solid #00C8C8', borderRadius: '16px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', color: '#0B1E3D', marginBottom: '0.5rem' }}>Create New Account</h2>
          <p style={{ fontSize: '0.8rem', color: '#6B7A95', marginBottom: '1.25rem' }}>
            A secure temporary password will be auto-generated and shown to you after account creation.
          </p>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Full Name *</label>
              <input
                type="text" required placeholder="e.g. Ayesha Khan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field" style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Email Address *</label>
              <input
                type="email" required placeholder="ayesha@wenclims.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field" style={{ paddingLeft: '1rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Assign Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-field" style={{ paddingLeft: '1rem' }}
              >
                <option value="member">Member Scientist – Can edit own bio + submit blogs/publications</option>
                {isSuperAdmin && <option value="admin">Executive Admin – Manages all content &amp; adds members</option>}
                {isSuperAdmin && <option value="super_admin">Super Admin – Full system access</option>}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-teal">
                <Plus size={16} /> Create Account &amp; Generate Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Users Table ── */}
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
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6B7A95' }}>No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #E8ECF2' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#1E2A3B' }}>{u.name}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4D5D78', fontSize: '0.82rem' }}>{u.email}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {isSuperAdmin && u.id !== user?.id ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', border: '1px solid #CBD5E1', background: '#F8FAFC', fontWeight: 600 }}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Executive Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    ) : (
                      <span className={`badge ${u.role === 'super_admin' ? 'badge-teal' : u.role === 'admin' ? 'badge-gold' : 'badge-navy'}`}>
                        {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Executive Admin' : 'Member'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`badge ${u.is_active ? 'badge-teal' : 'badge-gold'}`}>
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right', display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {/* Reset Password — Super Admin only, not on own account */}
                    {isSuperAdmin && u.id !== user?.id && (
                      <button
                        onClick={() => handleResetPassword(u.id)}
                        disabled={isResetting === u.id}
                        className="btn-ghost"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        title="Reset Password"
                      >
                        <RefreshCw size={13} />
                        {isResetting === u.id ? 'Resetting…' : 'Reset Pwd'}
                      </button>
                    )}

                    <button
                      onClick={() => handleStatusToggle(u.id)}
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: u.is_active ? '#d97706' : '#16a34a' }}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>

                    {isSuperAdmin && u.id !== user?.id && (
                      <button
                        onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                        className="btn-ghost"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#dc2626' }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
        title="Delete User Account"
        itemTitle={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteUser}
        loading={isDeleting}
      />
    </div>
  );
};
