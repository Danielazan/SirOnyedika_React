

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/auth.api';

/**
 * VerifyEmailPage
 *
 * Mounted at /verify-email?token=<raw_token>
 * Reads the token from the URL, calls the backend ONCE, then shows
 * success or error feedback.
 *
 * The `hasCalled` ref prevents React 18 StrictMode from firing the
 * verification API call twice (StrictMode mounts components twice in
 * development, which would consume the token on the first call and
 * return "Invalid or expired" on the second).
 */
export default function VerifyEmailPage() {
  const [searchParams]            = useSearchParams();
  const navigate                  = useNavigate();
  const [status, setStatus]       = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage]     = useState('');
  const [countdown, setCountdown] = useState(5);
  const hasCalled                 = useRef(false); // ← StrictMode guard

  useEffect(() => {
    // StrictMode guard — only ever fire this once
    if (hasCalled.current) return;
    hasCalled.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link. Please request a new one.');
      return;
    }

    // Call the backend verify endpoint exactly once
    api.get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message || 'Your email has been verified successfully!');
      })
      .catch((err) => {
        const errMsg = err.response?.data?.error || 'This verification link is invalid or has expired.';
        setStatus('error');
        setMessage(errMsg);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown redirect after success
  useEffect(() => {
    if (status !== 'success') return;
    if (countdown === 0) {
      navigate('/login');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, countdown, navigate]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* ── Verifying ── */}
        {status === 'verifying' && (
          <>
            <div style={styles.spinner} />
            <h2 style={styles.title}>Verifying your email…</h2>
            <p style={styles.subtitle}>Please wait a moment.</p>
          </>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <>
            <div style={{ ...styles.iconCircle, background: '#dcfce7' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#16a34a" />
                <path d="M7 12.5l3.5 3.5 6-7" stroke="#fff" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={styles.title}>Email Verified!</h2>
            <p style={styles.subtitle}>{message}</p>
            <p style={{ ...styles.subtitle, color: '#6b7280', marginTop: 4 }}>
              Redirecting to login in <strong>{countdown}s</strong>…
            </p>
            <Link to="/login" style={styles.primaryBtn}>
              Go to Login Now
            </Link>
          </>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <>
            <div style={{ ...styles.iconCircle, background: '#fee2e2' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#dc2626" />
                <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2.2"
                  strokeLinecap="round" />
              </svg>
            </div>
            <h2 style={styles.title}>Verification Failed</h2>
            <p style={styles.subtitle}>{message}</p>
            <div style={styles.btnGroup}>
              <ResendButton />
              <Link to="/login" style={styles.secondaryBtn}>Back to Login</Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ── Resend button with its own loading state ──────────────────────────────────
function ResendButton() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'sent' | 'failed'

  // Try to extract email from the token (not always possible); fallback: prompt
  const handleResend = async () => {
    const email = prompt('Enter the email address you registered with:');
    if (!email) return;

    setState('loading');
    try {
      await api.post('/auth/resend-verification', { email });
      setState('sent');
    } catch {
      setState('failed');
    }
  };

  if (state === 'sent') {
    return <p style={{ color: '#16a34a', fontWeight: 600 }}>✅ New link sent! Check your inbox.</p>;
  }
  if (state === 'failed') {
    return <p style={{ color: '#dc2626' }}>Could not resend. Try again later.</p>;
  }

  return (
    <button
      onClick={handleResend}
      disabled={state === 'loading'}
      style={styles.primaryBtn}
    >
      {state === 'loading' ? 'Sending…' : 'Resend Verification Email'}
    </button>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9fafb',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '48px 40px',
    maxWidth: '440px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  iconCircle: {
    borderRadius: '50%',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: '#374151',
    margin: 0,
    lineHeight: 1.6,
  },
  primaryBtn: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '12px 28px',
    background: '#111827',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  secondaryBtn: {
    display: 'inline-block',
    marginTop: '4px',
    padding: '12px 28px',
    background: 'transparent',
    color: '#374151',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    border: '1.5px solid #d1d5db',
    width: '100%',
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    marginTop: '8px',
  },
  spinner: {
    width: '44px',
    height: '44px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #111827',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

// Inject the spin animation once
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);