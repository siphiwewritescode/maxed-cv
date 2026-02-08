'use client';

import { useEffect, useState } from 'react';
import { authAPI } from '../../lib/auth';
import VerificationBanner from '../components/VerificationBanner';
import Link from 'next/link';

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  emailVerified?: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getMe().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await authAPI.logout();
    window.location.href = '/login';
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      {user && <VerificationBanner emailVerified={!!user.emailVerified} />}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#1a1a2e' }}>Dashboard</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/settings"
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                display: 'inline-block',
              }}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
        }}>
          <p style={{ margin: '0 0 10px' }}>Welcome, <strong>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}</strong>!</p>
          <p style={{ margin: '0', color: '#666' }}>Email: {user?.email}</p>
          <p style={{ margin: '10px 0 0', color: '#999', fontSize: '14px' }}>
            Your dashboard will show your master profile and generated CVs here in future phases.
          </p>
        </div>
      </div>
    </>
  );
}
