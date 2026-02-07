'use client';

import { useState } from 'react';
import { authAPI } from '../../../lib/auth';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

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
          Reset your password
        </p>
      </div>

      {submitted ? (
        <div>
          <div style={{
            padding: '16px',
            marginBottom: '20px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '6px',
            color: '#004085',
            fontSize: '14px',
          }}>
            If that email is registered, we sent a password reset link.
          </div>
          <Link
            href="/login"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#0070f3',
              backgroundColor: '#fff',
              border: '1px solid #0070f3',
              borderRadius: '6px',
              textAlign: 'center',
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#333',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              marginBottom: '16px',
            }}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>
              Back to login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
