const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const profileAPI = {
  /**
   * Get user's master profile
   */
  async getProfile() {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to fetch profile' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Update personal information
   */
  async updatePersonalInfo(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    headline?: string;
    summary?: string;
    noticePeriod?: string;
  }) {
    const res = await fetch(`${API_URL}/profile/personal-info`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update personal info' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Add work experience
   */
  async addExperience(data: {
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    bulletPoints: string[];
  }) {
    const res = await fetch(`${API_URL}/profile/experience`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to add experience' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Update work experience
   */
  async updateExperience(id: string, data: {
    jobTitle?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    bulletPoints?: string[];
  }) {
    const res = await fetch(`${API_URL}/profile/experience/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update experience' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Delete work experience
   */
  async deleteExperience(id: string) {
    const res = await fetch(`${API_URL}/profile/experience/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to delete experience' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Add education entry
   */
  async addEducation(data: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
  }) {
    const res = await fetch(`${API_URL}/profile/education`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to add education' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Update education entry
   */
  async updateEducation(id: string, data: {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const res = await fetch(`${API_URL}/profile/education/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update education' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Delete education entry
   */
  async deleteEducation(id: string) {
    const res = await fetch(`${API_URL}/profile/education/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to delete education' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Add project
   */
  async addProject(data: {
    name: string;
    description?: string;
    technologies: string[];
    url?: string;
  }) {
    const res = await fetch(`${API_URL}/profile/projects`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to add project' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Update project
   */
  async updateProject(id: string, data: {
    name?: string;
    description?: string;
    technologies?: string[];
    url?: string;
  }) {
    const res = await fetch(`${API_URL}/profile/projects/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update project' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Delete project
   */
  async deleteProject(id: string) {
    const res = await fetch(`${API_URL}/profile/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to delete project' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Add certification
   */
  async addCertification(data: {
    name: string;
    issuer: string;
    issueDate?: string;
    credentialId?: string;
  }) {
    const res = await fetch(`${API_URL}/profile/certifications`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to add certification' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Update certification
   */
  async updateCertification(id: string, data: {
    name?: string;
    issuer?: string;
    issueDate?: string;
    credentialId?: string;
  }) {
    const res = await fetch(`${API_URL}/profile/certifications/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update certification' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Delete certification
   */
  async deleteCertification(id: string) {
    const res = await fetch(`${API_URL}/profile/certifications/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to delete certification' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Update skills (replaces all skills)
   */
  async updateSkills(skills: string[]) {
    const res = await fetch(`${API_URL}/profile/skills`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to update skills' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  /**
   * Reorder items in a section
   */
  async reorderSection(section: 'experience' | 'education' | 'projects' | 'certifications' | 'skills', items: Array<{ id: string; order: number }>) {
    const res = await fetch(`${API_URL}/profile/reorder`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, items }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Failed to reorder items' }));
      throw new Error(error.message);
    }
    return res.json();
  },
};
