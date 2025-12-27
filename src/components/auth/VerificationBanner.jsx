import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * VerificationBanner
 * Shows when user is authenticated but email not verified
 * Sticky banner at top of page
 */
const VerificationBanner = () => {
  const { user } = useAuth();
  const [resendStatus, setResendStatus] = useState('');
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user is verified or banner is dismissed
  if (!user || user.isVerified || dismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setResendStatus('sending');
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ email: user.email })
      });

      if (response.ok) {
        setResendStatus('success');
        setTimeout(() => setResendStatus(''), 5000);
      } else {
        setResendStatus('error');
        setTimeout(() => setResendStatus(''), 5000);
      }
    } catch (error) {
      setResendStatus('error');
      setTimeout(() => setResendStatus(''), 5000);
    }
  };

  return (
    <div className="bg-text-muted text-white sticky top-0 z-40">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-grow">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-grow">
              <p className="text-sm font-medium">
                Verify your email to unlock all features
              </p>
              {resendStatus === 'success' && (
                <p className="text-xs mt-0.5">✓ Verification email sent! Check your inbox.</p>
              )}
              {resendStatus === 'error' && (
                <p className="text-xs mt-0.5">Failed to resend. Please try again.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResendEmail}
              disabled={resendStatus === 'sending'}
              className="text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {resendStatus === 'sending' ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-card"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;