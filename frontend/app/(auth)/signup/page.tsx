'use client';

import { useState } from 'react';
import { authAPI } from '../../../lib/auth';
import Link from 'next/link';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.signup({ email, password, firstName, lastName });
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
          Create your account
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
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#333',
            }}>
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#333',
            }}>
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
        </div>

        <div style={{ marginBottom: '16px' }}>
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#333',
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginBottom: 0 }}>
            Minimum 8 characters
          </p>
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
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
          <span style={{ padding: '0 12px', fontSize: '14px', color: '#999' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href={authAPI.getGoogleLoginUrl()}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#333',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '6px',
              textAlign: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Google
          </a>
          <a
            href={authAPI.getLinkedInLoginUrl()}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#333',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '6px',
              textAlign: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            LinkedIn
          </a>
        </div>
      </form>
    </div>
  );
}
