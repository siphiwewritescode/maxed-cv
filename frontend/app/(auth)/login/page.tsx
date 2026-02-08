'use client';

import { useState } from 'react';
import { authAPI } from '../../../lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.login({ email, password });
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          Sign in to your account
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
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 40px 10px 12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#666',
                fontSize: '18px',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link href="/reset-password" style={{ fontSize: '14px', color: '#0070f3', textDecoration: 'none' }}>
            Forgot password?
          </Link>
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
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>
            Sign up
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
