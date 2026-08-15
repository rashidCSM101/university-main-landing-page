// Centralized API Service for WenClims REST API endpoints

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Try relative endpoint first if running in Vite proxy dev mode
  try {
    const res = await fetch(`/api/v1${cleanEndpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (_e) {
    // Silently proceed to absolute fallback
  }

  // Fallback to absolute API_BASE_URL
  try {
    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
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
