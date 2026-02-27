import { API_BASE_URL, API_KEY } from '../config';
import { NimroboProject, NimroboLink, NimroboSessionStatus } from '../types';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

export const nimroboApi = {
  // User Profile
  getUserProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/v1/user/profile`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Projects
  listProjects: async (): Promise<NimroboProject[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/projects`, { headers });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.projects;
  },

  createProject: async (project: Partial<NimroboProject>): Promise<NimroboProject> => {
    const res = await fetch(`${API_BASE_URL}/v1/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.project;
  },

  getProject: async (projectId: string): Promise<NimroboProject> => {
    const res = await fetch(`${API_BASE_URL}/v1/projects/${projectId}`, { headers });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.project;
  },

  updateProject: async (projectId: string, project: Partial<NimroboProject>): Promise<NimroboProject> => {
    const res = await fetch(`${API_BASE_URL}/v1/projects/${projectId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.project;
  },

  // Project Links
  listProjectLinks: async (projectId: string): Promise<NimroboLink[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/projects/${projectId}/links`, { headers });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.links;
  },

  createProjectLinks: async (projectId: string, labels: string[], expiryPreset: string): Promise<NimroboLink[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/projects/${projectId}/links`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ labels, expiryPreset }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.links;
  },

  cancelProjectLink: async (linkId: string, projectId: string) => {
    const res = await fetch(`${API_BASE_URL}/v1/projects/links/${linkId}/cancel?projectId=${projectId}`, {
      method: 'POST',
      headers,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Instant Links
  listInstantLinks: async (): Promise<NimroboLink[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/instant-voice-links`, { headers });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.links;
  },

  createInstantLinks: async (params: any): Promise<NimroboLink[]> => {
    const res = await fetch(`${API_BASE_URL}/v1/instant-voice-links`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.links;
  },

  // Sessions
  getSessionStatus: async (sessionId: string, type: 'project' | 'instant', projectId?: string): Promise<NimroboSessionStatus> => {
    const url = new URL(`${API_BASE_URL}/v1/session/status`);
    url.searchParams.append('sessionId', sessionId);
    url.searchParams.append('type', type);
    if (projectId) url.searchParams.append('projectId', projectId);

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getSessionTranscript: async (sessionId: string, type: 'project' | 'instant', projectId?: string) => {
    const url = new URL(`${API_BASE_URL}/v1/session/transcript`);
    url.searchParams.append('sessionId', sessionId);
    url.searchParams.append('type', type);
    if (projectId) url.searchParams.append('projectId', projectId);

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getSessionSummary: async (sessionId: string, projectId?: string, instantVoiceLinks?: boolean) => {
    const url = new URL(`${API_BASE_URL}/v1/sessions/summary`);
    url.searchParams.append('sessionId', sessionId);
    if (projectId) url.searchParams.append('projectId', projectId);
    if (instantVoiceLinks) url.searchParams.append('instant_voice_links', 'true');

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
