'use client';

import { useEffect, useState } from 'react';
import { authAPI } from '../../lib/auth';
import { profileAPI } from '../../lib/profile-api';
import VerificationBanner from '../components/VerificationBanner';
import Link from 'next/link';
import { MasterProfile } from '@/types/profile';

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  emailVerified?: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<MasterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authAPI.getMe(),
      profileAPI.getProfile().catch(() => null) // Profile might not exist yet
    ]).then(([userData, profileData]) => {
      setUser(userData);
      setProfile(profileData);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await authAPI.logout();
    window.location.href = '/login';
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  // Determine if profile has substantial data
  const hasSubstantialProfile = profile && (
    (profile.experiences && profile.experiences.length > 0) ||
    (profile.skills && profile.skills.length > 0)
  );

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
              href="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Profile
            </Link>
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

        {/* Welcome Card */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginBottom: '20px',
        }}>
          <p style={{ margin: '0 0 10px' }}>Welcome, <strong>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}</strong>!</p>
          <p style={{ margin: '0', color: '#666' }}>Email: {user?.email}</p>
        </div>

        {/* Master Profile Section */}
        {!hasSubstantialProfile ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border-2 border-blue-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Create Your Master Profile
            </h2>
            <p className="text-gray-600 mb-6">
              Set up your comprehensive profile to start generating tailored CVs. Add your work experience, skills, education, and more in just a few steps.
            </p>
            <Link
              href="/profile/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Create Profile
            </Link>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Master Profile</h2>
              <div className="flex gap-2">
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  View Profile
                </Link>
                <Link
                  href="/profile/create"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="text-gray-600 space-y-1">
              {profile?.skills && profile.skills.length > 0 && (
                <p>
                  <span className="font-semibold text-gray-900">{profile.skills.length}</span> skills
                </p>
              )}
              {profile?.experiences && profile.experiences.length > 0 && (
                <p>
                  <span className="font-semibold text-gray-900">{profile.experiences.length}</span> work experiences
                </p>
              )}
              {profile?.education && profile.education.length > 0 && (
                <p>
                  <span className="font-semibold text-gray-900">{profile.education.length}</span> education entries
                </p>
              )}
              {profile?.projects && profile.projects.length > 0 && (
                <p>
                  <span className="font-semibold text-gray-900">{profile.projects.length}</span> projects
                </p>
              )}
              {profile?.certifications && profile.certifications.length > 0 && (
                <p>
                  <span className="font-semibold text-gray-900">{profile.certifications.length}</span> certifications
                </p>
              )}
            </div>
          </div>
        )}

        <p style={{ margin: '20px 0 0', color: '#999', fontSize: '14px', textAlign: 'center' }}>
          Generated CVs and AI-powered tailoring features coming in future phases.
        </p>
      </div>
    </>
  );
}
