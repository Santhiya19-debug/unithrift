import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { validateInstitutionalEmail } from '../../utils/emailValidation';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = validateInstitutionalEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await requestPasswordReset(email.toLowerCase());
      
      if (result.success) {
        setEmailSent(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            {/* Email Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success bg-opacity-10 flex items-center justify-center">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>

            <h2 className="font-heading text-2xl font-medium text-text-primary mb-3">
              Check Your Email
            </h2>
            <p className="text-text-secondary mb-2">
              We've sent a password reset link to
            </p>
            <p className="font-medium text-text-primary mb-6 break-all">
              {email}
            </p>
            <p className="text-sm text-text-muted mb-6">
              The link will expire in 30 minutes for security.
            </p>

            <div className="space-y-3">
              <Button onClick={() => navigate('/login')} className="w-full">
                Back to Login
              </Button>
              <button
                onClick={() => setEmailSent(false)}
                className="text-sm text-sage hover:text-green-dark transition-colors duration-card"
              >
                Didn't receive email? Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-medium text-text-primary mb-2">
            UniThrift
          </h1>
          <p className="text-text-secondary">
            Reset your password
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="font-heading text-2xl font-medium text-text-primary mb-2">
            Forgot Password
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Enter your institutional email and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Institutional Email"
              type="email"
              placeholder="your.name2024@vitstudent.ac.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-sage hover:text-green-dark transition-colors duration-card"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;