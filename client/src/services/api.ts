// Centralized API Service for WenClims REST API endpoints

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // In development (Vite proxy mode), try relative path first; in production go direct.
  // This avoids a double-fetch (failed proxy + retry) for every production user.
  const url = import.meta.env.DEV
    ? `/api/v1${cleanEndpoint}`
    : `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      // In dev, fall back to absolute URL if proxy is not configured
      if (import.meta.env.DEV && url.startsWith('/api/v1')) {
        const absoluteRes = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
          headers: { 'Content-Type': 'application/json' },
          ...options,
        });
        if (!absoluteRes.ok) throw new Error(`API ${cleanEndpoint} responded with ${absoluteRes.status}`);
        return await absoluteRes.json();
      }
      throw new Error(`API ${cleanEndpoint} responded with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`API call failed for ${cleanEndpoint}:`, error);
    return null;
  }
}


// Media & Publications API
export async function fetchMediaItems(type?: string) {
  const query = type ? `?type=${type}` : '';
  return fetchFromAPI<any[]>(`/media${query}`);
}

export async function fetchMediaItemBySlug(slug: string) {
  return fetchFromAPI<any>(`/media/${slug}`);
}

export async function fetchPublications() {
  return fetchFromAPI<any[]>('/publications');
}

// Team API
export async function fetchTeamMembers(forHome?: boolean) {
  return fetchFromAPI<any[]>(forHome ? '/team?home=true' : '/team');
}

export async function fetchTeamMemberBySlug(slug: string) {
  return fetchFromAPI<any>(`/team/${slug}`);
}

// Projects API
export async function fetchProjects() {
  return fetchFromAPI<any[]>('/projects');
}

export async function fetchProjectBySlug(slug: string) {
  return fetchFromAPI<any>(`/projects/${slug}`);
}

// Tools API
export async function fetchTools() {
  return fetchFromAPI<any[]>('/tools');
}
