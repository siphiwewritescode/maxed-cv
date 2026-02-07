'use client';

import { useState } from 'react';
import { authAPI } from '../../lib/auth';

export default function VerificationBanner({ emailVerified }: { emailVerified: boolean }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  if (emailVerified) return null;

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendVerification();
      setResent(true);
    } catch {
      // Rate limited or error -- silently fail
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      borderBottom: '1px solid #ffc107',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
    }}>
      <span>Please verify your email address to secure your account.</span>
      {resent ? (
        <span style={{ color: '#28a745' }}>Verification email sent!</span>
      ) : (
        <button
          onClick={handleResend}
          disabled={resending}
          style={{
            background: 'none',
            border: 'none',
            color: '#0066cc',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px',
          }}
        >
          {resending ? 'Sending...' : 'Resend verification email'}
        </button>
      )}
    </div>
  );
}
