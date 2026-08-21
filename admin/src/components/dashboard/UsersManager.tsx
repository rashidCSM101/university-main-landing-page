import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, KeyRound, Copy, CheckCheck, RefreshCw, Trash2, ShieldAlert, Sparkles, X, User } from 'lucide-react';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';

// ─── Reset Password Confirmation Modal ───────────────────────────────────────
interface ResetConfirmModalProps {
  isOpen: boolean;
  targetUser: { id: string; name: string; email: string } | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  targetUser,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !targetUser) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 30, 61, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 30px 70px rgba(11, 30, 61, 0.35)',
          border: '1.5px solid rgba(124, 58, 237, 0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            transition: 'all 0.2s',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
            }}
          >
            <KeyRound size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
            Reset User Password
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6B7A95', marginTop: '0.4rem', lineHeight: 1.4 }}>
            Generate a fresh, secure temporary password for this member account.
          </p>
        </div>

        {/* Target Member Card */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00C8C8, #1A3461)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            {targetUser.name.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#0B1E3D', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {targetUser.name}
            </div>
            <div style={{ color: '#64748B', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              {targetUser.email}
            </div>
          </div>
        </div>

        {/* Notice Box */}
        <div
          style={{
            background: '#FAF5FF',
            border: '1px solid #E9D5FF',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
          }}
        >
          <Sparkles size={18} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.78rem', color: '#6B21A8', lineHeight: 1.45, fontWeight: 500 }}>
            A new random temporary password will be created immediately. You will get a popup with a <strong>one-click copy button</strong> to share with the user.
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1.5,
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Generating...' : 'Generate New Password'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Credentials Output Modal ────────────────────────────────────────────────
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
    navigator.clipboard.writeText(`WenClims Login Details:\n\nName: ${name}\nLogin URL: https://hex-byte.tech/admin/\nEmail: ${email}\nTemporary Password: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 30, 61, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.25rem',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 30px 80px rgba(0, 200, 200, 0.25)',
          border: '2px solid #00C8C8',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00C8C8 0%, #1A3461 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(0, 200, 200, 0.35)',
            }}
          >
            <KeyRound size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 800, color: '#0B1E3D', margin: 0 }}>
            Login Credentials Ready!
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6B7A95', marginTop: '0.4rem' }}>
            Share these login credentials with <strong>{name}</strong>
          </p>
        </div>

        {/* Credentials Box */}
        <div
          style={{
            background: '#F0FDFA',
            border: '1.5px solid #00C8C8',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>
              Portal URL
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1E3D' }}>
              https://hex-byte.tech/admin/
            </div>
          </div>
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>
              Email Address
            </div>
            <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0B1E3D', fontFamily: 'monospace' }}>
              {email}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6B7A95', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>
              Generated Password
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00A3A3', fontFamily: 'monospace', letterSpacing: '1.5px' }}>
              {password}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#B45309', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', padding: '0.65rem 0.85rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
          ⚠️ Copy and share this password with the member. They can change their password anytime after logging in via <strong>My Profile Settings</strong>.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              flex: 1,
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #00C8C8 0%, #1A3461 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0, 200, 200, 0.3)',
            }}
          >
            {copied ? <><CheckCheck size={18} /> Copied to Clipboard!</> : <><Copy size={18} /> Copy Credentials</>}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
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

  // Custom UI Reset Confirmation Modal State
  const [resetTarget, setResetTarget] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Credentials modal state
  const [credModal, setCredModal] = useState<{ open: boolean; name: string; email: string; password: string }>({
    open: false,
    name: '',
    email: '',
    password: '',
  });

  const [formData, setFormData] = useState({ name: '', email: '', role: 'member' });

  const loadData = async () => {
    setLoading(true);
    try {
      setUsers(await api.getAdminUsers());
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      setCredModal({ open: true, name: result.name, email: result.email, password: result.temp_password });
    } catch (err: any) {
      alert(err?.message || 'Failed to create user account');
    }
  };

  // ── Open Custom UI Reset Modal ──
  const handleOpenResetModal = (u: any) => {
    if (!isSuperAdmin) return;
    setResetTarget({ id: u.id, name: u.name, email: u.email });
  };

  // ── Execute Password Reset ──
  const confirmResetPassword = async () => {
    if (!resetTarget || !isSuperAdmin) return;
    setIsResetting(true);
    try {
      const result = await api.resetUserPassword(resetTarget.id);
      const targetCopy = { ...resetTarget };
      setResetTarget(null);
      setCredModal({
        open: true,
        name: result.name || targetCopy.name,
        email: result.email || targetCopy.email,
        password: result.temp_password,
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  const handleRoleChange = async (id: string, nextRole: string) => {
    if (!isSuperAdmin) {
      alert('Permission Denied.');
      return;
    }
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
                type="text"
                required
                placeholder="e.g. Ayesha Khan"
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

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E2A3B' }}>Assign Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="input-field"
                style={{ paddingLeft: '1rem' }}
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
                    {/* Modern UI Reset Password Button */}
                    {isSuperAdmin && u.id !== user?.id && (
                      <button
                        onClick={() => handleOpenResetModal(u)}
                        className="btn-ghost"
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.35rem 0.75rem',
                          color: '#7c3aed',
                          background: 'rgba(124, 58, 237, 0.08)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontWeight: 700,
                          border: '1px solid rgba(124, 58, 237, 0.2)',
                          cursor: 'pointer',
                        }}
                        title="Reset Password"
                      >
                        <RefreshCw size={13} />
                        Reset Pwd
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

      {/* ── Custom UI Reset Password Modal ── */}
      <ResetConfirmModal
        isOpen={!!resetTarget}
        targetUser={resetTarget}
        loading={isResetting}
        onClose={() => setResetTarget(null)}
        onConfirm={confirmResetPassword}
      />

      {/* ── Credentials Output Modal ── */}
      <CredentialsModal
        isOpen={credModal.open}
        name={credModal.name}
        email={credModal.email}
        password={credModal.password}
        onClose={() => setCredModal({ open: false, name: '', email: '', password: '' })}
      />

      {/* ── Delete Confirmation Modal ── */}
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
