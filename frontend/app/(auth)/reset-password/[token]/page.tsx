'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { authAPI } from '../../../../lib/auth';
import Link from 'next/link';

export default function ResetPasswordTokenPage() {
  const params = useParams();
  const token = params.token as string;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed. The link may have expired.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#0070f3',
            margin: 0,
            marginBottom: '8px',
          }}>
            Password Reset Successfully
          </h1>
        </div>

        <div style={{
          padding: '16px',
          marginBottom: '20px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '6px',
          color: '#155724',
          fontSize: '14px',
          textAlign: 'center',
        }}>
          Your password has been reset. You can now log in with your new password.
        </div>

        <Link
          href="/login"
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: '#0070f3',
            border: 'none',
            borderRadius: '6px',
            textAlign: 'center',
            textDecoration: 'none',
            boxSizing: 'border-box',
          }}
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#0070f3',
          margin: 0,
          marginBottom: '8px',
        }}>
          Maxed-CV
        </h1>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          Set a new password
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          color: '#c33',
          fontSize: '14px',
        }}>
          {error}
          {error.includes('expired') && (
            <>
              {' '}
              <Link href="/reset-password" style={{ color: '#c33', fontWeight: 600 }}>
                Request a new link
              </Link>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#333',
          }}>
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#333',
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </div>
  );
}
