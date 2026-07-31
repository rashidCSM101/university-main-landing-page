const API_BASE_URL = 'http://localhost:5000/api/v1';

/**
 * Custom Fetch API Client with JWT Bearer Interceptor & Error Handling
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('wenclims_admin_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Send httpOnly refresh cookies
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (data.error && data.error.toLowerCase().includes('token')) {
        localStorage.removeItem('wenclims_admin_user');
        localStorage.removeItem('wenclims_admin_token');
        alert('Your admin session has expired. Please log in again to continue.');
        window.location.href = '/admin--wensclims-xk9f2m/login';
      }
    }
    throw new Error(data.error || 'API Request failed');
  }

  return data as T;
}

// =============================================================================
// API Service Methods
// =============================================================================

export const api = {
  // Auth
  login: (credentials: { email: string; password: string; totp?: string }) =>
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),

  getMe: () =>
    apiFetch<{ user: any }>('/auth/me'),

  // Media / Blogs
  getAdminMedia: (params?: { type?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any[]>(`/admin/media${query ? `?${query}` : ''}`);
  },
  createMedia: (item: any) =>
    apiFetch<any>('/admin/media', { method: 'POST', body: JSON.stringify(item) }),
  updateMedia: (id: string, item: any) =>
    apiFetch<any>(`/admin/media/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteMedia: (id: string) =>
    apiFetch<{ message: string }>(`/admin/media/${id}`, { method: 'DELETE' }),

  // Publications
  getAdminPublications: () =>
    apiFetch<any[]>('/admin/publications'),
  createPublication: (pub: any) =>
    apiFetch<any>('/admin/publications', { method: 'POST', body: JSON.stringify(pub) }),
  updatePublication: (id: string, pub: any) =>
    apiFetch<any>(`/admin/publications/${id}`, { method: 'PUT', body: JSON.stringify(pub) }),
  deletePublication: (id: string) =>
    apiFetch<{ message: string }>(`/admin/publications/${id}`, { method: 'DELETE' }),

  // Projects
  getAdminProjects: () =>
    apiFetch<any[]>('/admin/projects'),
  createProject: (proj: any) =>
    apiFetch<any>('/admin/projects', { method: 'POST', body: JSON.stringify(proj) }),
  updateProject: (id: string, proj: any) =>
    apiFetch<any>(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(proj) }),
  deleteProject: (id: string) =>
    apiFetch<{ message: string }>(`/admin/projects/${id}`, { method: 'DELETE' }),

  // Team
  getAdminTeam: () =>
    apiFetch<any[]>('/admin/team'),
  createTeamMember: (member: any) =>
    apiFetch<any>('/admin/team', { method: 'POST', body: JSON.stringify(member) }),
  updateTeamMember: (id: string, member: any) =>
    apiFetch<any>(`/admin/team/${id}`, { method: 'PUT', body: JSON.stringify(member) }),
  deleteTeamMember: (id: string) =>
    apiFetch<{ message: string }>(`/admin/team/${id}`, { method: 'DELETE' }),

  // Tools
  getAdminTools: () =>
    apiFetch<any[]>('/admin/tools'),
  createTool: (tool: any) =>
    apiFetch<any>('/admin/tools', { method: 'POST', body: JSON.stringify(tool) }),
  updateTool: (id: string, tool: any) =>
    apiFetch<any>(`/admin/tools/${id}`, { method: 'PUT', body: JSON.stringify(tool) }),
  deleteTool: (id: string) =>
    apiFetch<{ message: string }>(`/admin/tools/${id}`, { method: 'DELETE' }),

  // Users (Super Admin Only)
  getAdminUsers: () =>
    apiFetch<any[]>('/admin/users'),
  createUser: (user: any) =>
    apiFetch<any>('/admin/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUserRole: (id: string, role: string) =>
    apiFetch<any>(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  toggleUserStatus: (id: string) =>
    apiFetch<any>(`/admin/users/${id}/toggle-status`, { method: 'PUT' }),

  // Audit Logs (Super Admin Only)
  getAuditLogs: (params?: { action?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<any[]>(`/admin/system/audit${query ? `?${query}` : ''}`);
  },

  // System Health & DB Backup (Super Admin Only)
  getSystemHealth: () =>
    apiFetch<any>('/admin/system/health'),
  getEmergencyBanner: () =>
    apiFetch<any>('/system/banner'),
  updateEmergencyBanner: (banner: any) =>
    apiFetch<any>('/admin/system/banner', { method: 'PUT', body: JSON.stringify(banner) }),
  downloadDbBackupUrl: () => `${API_BASE_URL}/admin/system/backup`,
};
