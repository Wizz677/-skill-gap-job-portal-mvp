const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

export const api = {
  signup(payload) {
    return request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
  },
  login(payload) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },
  logout() {
    return request('/auth/logout', { method: 'POST' });
  },
  me() {
    return request('/auth/me');
  },
  updateProfile(payload) {
    return request('/profile', { method: 'PUT', body: JSON.stringify(payload) });
  },
  async uploadResume(file) {
    const API_BASE = API_BASE_URL;
    const formData = new FormData();
    formData.append('resume', file);
    const res = await fetch(`${API_BASE}/profile/resume`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Upload failed');
    }
    return data;
  },
  getJobs(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.search && params.search.trim() !== '') {
      searchParams.append('search', params.search.trim());
    }
    if (params.skills && params.skills.trim() !== '') {
      searchParams.append('skills', params.skills.trim());
    }
    if (params.location && params.location.trim() !== '') {
      searchParams.append('location', params.location.trim());
    }
    const qs = searchParams.toString();
    return request(`/jobs${qs ? `?${qs}` : ''}`);
  },
  getJob(id) {
    return request(`/jobs/${id}`);
  },
  createJob(payload) {
    return request('/jobs', { method: 'POST', body: JSON.stringify(payload) });
  },
  applyToJob(id) {
    return request(`/jobs/${id}/apply`, { method: 'POST' });
  },
  jobSeekerApplications() {
    return request('/job-seeker/applications');
  },
  employerJobs() {
    return request('/jobs/employer/mine');
  },
  employerApplicants(jobId) {
    return request(`/employer/jobs/${jobId}/applicants`);
  },
};
