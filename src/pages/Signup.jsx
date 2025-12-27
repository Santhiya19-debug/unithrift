import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { validateInstitutionalEmail, getEmailRules } from '../utils/emailValidation';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailRules, setShowEmailRules] = useState(false);

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

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    const emailValidation = validateInstitutionalEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validate confirm password
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
      const result = await signup({
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      if (result.success) {
        // Redirect to email verification pending page
        navigate('/verify-email-pending', { 
          state: { email: formData.email.toLowerCase() } 
        });
      } else {
        setErrors({ form: result.error });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const emailRules = getEmailRules();

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-medium text-text-primary mb-2">
            UniThrift
          </h1>
          <p className="text-text-secondary">
            Join your campus marketplace
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="font-heading text-2xl font-medium text-text-primary mb-6">
            Create Account
          </h2>

          {/* Form-level error */}
          {errors.form && (
            <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-lg">
              <p className="text-sm text-error">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              error={errors.name}
            />

            {/* Email */}
            <div>
              <Input
                label="Institutional Email"
                type="email"
                placeholder="your.name2024@vitstudent.ac.in"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                error={errors.email}
              />
              <button
                type="button"
                onClick={() => setShowEmailRules(!showEmailRules)}
                className="mt-1 text-xs text-sage hover:text-green-dark transition-colors duration-card"
              >
                {showEmailRules ? 'Hide' : 'View'} allowed email formats
              </button>

              {/* Email Rules Dropdown */}
              {showEmailRules && (
                <div className="mt-3 p-4 bg-off-white rounded-lg border border-border-soft">
                  <p className="text-xs font-medium text-text-primary mb-3">Allowed Email Formats:</p>
                  {emailRules.map((rule, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <p className="text-xs font-medium text-green-dark mb-1">{rule.title}</p>
                      <p className="text-xs text-text-muted mb-2">Domain: <span className="font-mono">{rule.domain}</span></p>
                      
                      <p className="text-xs font-medium text-text-secondary mb-1">Requirements:</p>
                      <ul className="text-xs text-text-muted ml-3 space-y-0.5 mb-2">
                        {rule.rules.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>

                      <p className="text-xs font-medium text-success mb-1">Valid Examples:</p>
                      <ul className="text-xs text-text-muted ml-3 space-y-0.5">
                        {rule.examples.map((ex, i) => (
                          <li key={i} className="font-mono">• {ex}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-border-soft">
                    <p className="text-xs text-error font-medium mb-1">❌ Not Allowed:</p>
                    <ul className="text-xs text-text-muted ml-3 space-y-0.5">
                      <li>• Public emails (gmail, yahoo, outlook)</li>
                      <li>• Other institutional domains</li>
                      <li>• Malformed patterns</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Create a password (min. 8 characters)"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              error={errors.password}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              error={errors.confirmPassword}
            />

            {/* Terms Notice */}
            <p className="text-xs text-text-muted">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-sage hover:text-green-dark">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-sage hover:text-green-dark">
                Privacy Policy
              </Link>
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-soft"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-muted">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Login
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-text-muted mt-6">
          Only verified institutional email addresses can access UniThrift
        </p>
      </div>
    </div>
  );
};

export default Signup;