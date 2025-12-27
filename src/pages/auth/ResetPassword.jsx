import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    // Validate token exists
    if (!token) {
      setTokenError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(token, formData.password);
      
      if (result.success) {
        setResetSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setErrors({ form: result.error });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error bg-opacity-10 flex items-center justify-center">
              <svg className="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-medium text-text-primary mb-3">
              Invalid Reset Link
            </h2>
            <p className="text-text-secondary mb-6">
              {tokenError}
            </p>
            <Button onClick={() => navigate('/forgot-password')} className="w-full">
              Request New Reset Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success bg-opacity-10 flex items-center justify-center">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-medium text-text-primary mb-3">
              Password Reset Successful
            </h2>
            <p className="text-text-secondary mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <p className="text-sm text-text-muted mb-6">
              Redirecting to login page...
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
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
            Create a new password
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="font-heading text-2xl font-medium text-text-primary mb-2">
            Reset Password
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Enter your new password below.
          </p>

          {errors.form && (
            <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-lg">
              <p className="text-sm text-error">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New Password"
              type="password"
              placeholder="Create a new password (min. 8 characters)"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              error={errors.password}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-3 bg-off-white rounded-lg">
            <p className="text-xs text-text-muted">
              <strong>Security tip:</strong> Use a strong password with at least 8 characters, including letters, numbers, and symbols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;