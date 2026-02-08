const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authAPI = {
  async signup(data: { email: string; password: string; firstName: string; lastName: string }) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Signup failed' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  async login(data: { email: string; password: string; rememberMe?: boolean }) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      // Backend logout failed, but we should still clear local state
      console.warn('Backend logout failed, forcing local cleanup');
      // Note: Browser will clear session cookie when navigating to /login
      // due to server clearing it, but we log the warning for debugging
    }

    // Always return success object - frontend should clear local state
    // and redirect to login regardless of backend status
    return { message: 'Logged out successfully' };
  },

  async getMe() {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return res.json();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Reset failed' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  async verifyEmail(token: string) {
    const res = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Verification failed' }));
      throw new Error(error.message);
    }
    return res.json();
  },

  async resendVerification() {
    const res = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  getGoogleLoginUrl() {
    return `${API_URL}/auth/google`;
  },

  getLinkedInLoginUrl() {
    return `${API_URL}/auth/linkedin`;
  },

  async deactivateAccount() {
    const res = await fetch(`${API_URL}/auth/deactivate`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Deactivation failed' }));
      throw new Error(error.message);
    }
    return res.json();
  },
};
