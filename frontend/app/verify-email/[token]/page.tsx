'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authAPI } from '../../../lib/auth';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendVerification();
      setError('Verification email sent! Please check your inbox.');
    } catch {
      setError('Failed to resend. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#333',
              marginBottom: '12px',
            }}>
              Verifying your email...
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#28a745',
              marginBottom: '12px',
            }}>
              Email Verified Successfully!
            </h1>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Your email has been verified. Please log in with your credentials.
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#0070f3',
                textDecoration: 'none',
              }}
            >
              Go to login page
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#c33',
              marginBottom: '12px',
            }}>
              Verification Failed
            </h1>
            <p style={{
              color: '#666',
              fontSize: '14px',
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
            }}>
              {error}
            </p>
            <button
              onClick={handleResend}
              disabled={resending}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#fff',
                backgroundColor: resending ? '#ccc' : '#0070f3',
                border: 'none',
                borderRadius: '6px',
                cursor: resending ? 'not-allowed' : 'pointer',
                marginBottom: '12px',
              }}
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
            <Link
              href="/login"
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#0070f3',
                textDecoration: 'none',
              }}
            >
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
