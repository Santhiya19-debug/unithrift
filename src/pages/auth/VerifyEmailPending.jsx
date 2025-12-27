import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const VerifyEmailPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';
  const [resendStatus, setResendStatus] = useState('');

  const handleResendEmail = async () => {
    setResendStatus('sending');
    
    try {
      // Call backend to resend verification email
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setResendStatus('success');
        setTimeout(() => setResendStatus(''), 3000);
      } else {
        setResendStatus('error');
        setTimeout(() => setResendStatus(''), 3000);
      }
    } catch (error) {
      setResendStatus('error');
      setTimeout(() => setResendStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-card p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success bg-opacity-10 flex items-center justify-center">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>

          <h2 className="font-heading text-2xl font-medium text-text-primary mb-3">
            Check Your Email
          </h2>
          <p className="text-text-secondary mb-2">
            We've sent a verification link to
          </p>
          <p className="font-medium text-text-primary mb-6 break-all">
            {email}
          </p>
          
          <div className="bg-off-white rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-text-secondary mb-2">
              <strong>Next steps:</strong>
            </p>
            <ol className="text-sm text-text-muted space-y-1 ml-4">
              <li>1. Check your inbox (and spam folder)</li>
              <li>2. Click the verification link</li>
              <li>3. Your account will be activated</li>
              <li>4. Login to start using UniThrift</li>
            </ol>
          </div>

          <p className="text-xs text-text-muted mb-6">
            The verification link will expire in 24 hours for security.
          </p>

          {/* Resend Email */}
          <div className="space-y-3">
            {resendStatus === 'success' && (
              <div className="p-3 bg-success bg-opacity-10 rounded-lg">
                <p className="text-sm text-success">✓ Verification email resent successfully</p>
              </div>
            )}
            
            {resendStatus === 'error' && (
              <div className="p-3 bg-error bg-opacity-10 rounded-lg">
                <p className="text-sm text-error">Failed to resend email. Please try again.</p>
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={resendStatus === 'sending'}
              className="text-sm text-sage hover:text-green-dark transition-colors duration-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendStatus === 'sending' ? 'Sending...' : "Didn't receive email? Resend verification"}
            </button>

            <div className="pt-4">
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-text-muted mt-6">
          If you continue to have issues, please contact support
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPending;