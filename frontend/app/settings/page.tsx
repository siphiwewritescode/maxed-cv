'use client';

import { useEffect, useState } from 'react';
import { authAPI } from '../../lib/auth';
import Link from 'next/link';

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  emailVerified?: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    authAPI.getMe().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  const handleDeactivate = async () => {
    if (confirmText !== 'DEACTIVATE') {
      return;
    }

    setDeactivating(true);
    try {
      await authAPI.deactivateAccount();
      // Redirect to login after successful deactivation
      window.location.href = '/login';
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Deactivation failed');
      setDeactivating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ marginBottom: '30px' }}>
        <Link
          href="/dashboard"
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 style={{ margin: '0 0 30px', color: '#1a1a2e', fontSize: '32px' }}>Settings</h1>

      {/* Account Information */}
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '24px',
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: '#333' }}>Account Information</h2>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
          <p style={{ margin: '8px 0' }}>
            <strong>Name:</strong> {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || 'N/A'}
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Email:</strong> {user?.email}
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Email Status:</strong> {user?.emailVerified ? '✓ Verified' : '✗ Not verified'}
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        border: '2px solid #dc3545',
        marginBottom: '24px',
      }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '20px', color: '#dc3545' }}>Danger Zone</h2>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#666' }}>
          Once you deactivate your account, there is no going back. Please be certain.
        </p>

        {!showDeactivateConfirm ? (
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Deactivate Account
          </button>
        ) : (
          <div style={{
            backgroundColor: '#fff3cd',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #ffc107',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#856404' }}>
              Are you absolutely sure?
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#856404' }}>
              This action will:
            </p>
            <ul style={{ margin: '0 0 16px', paddingLeft: '20px', fontSize: '14px', color: '#856404' }}>
              <li>Immediately log you out of all devices</li>
              <li>Prevent you from logging in again</li>
              <li>Make your profile and CV data inaccessible</li>
              <li>Send a confirmation email to {user?.email}</li>
            </ul>
            <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#856404', fontWeight: 600 }}>
              Type <strong>DEACTIVATE</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DEACTIVATE"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '12px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleDeactivate}
                disabled={confirmText !== 'DEACTIVATE' || deactivating}
                style={{
                  padding: '10px 20px',
                  backgroundColor: confirmText === 'DEACTIVATE' && !deactivating ? '#dc3545' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: confirmText === 'DEACTIVATE' && !deactivating ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {deactivating ? 'Deactivating...' : 'Yes, deactivate my account'}
              </button>
              <button
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  setConfirmText('');
                }}
                disabled={deactivating}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: deactivating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
