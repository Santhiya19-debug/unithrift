import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { validateInstitutionalEmail, getEmailRules } from '../utils/emailValidation';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailRules, setShowEmailRules] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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

    // Validate email
    const emailValidation = validateInstitutionalEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const result = await login(formData.email.toLowerCase(), formData.password);
      
      if (result.success) {
        // Auth context handles redirect based on role
        navigate(result.redirect);
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
            Welcome back to your campus marketplace
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="font-heading text-2xl font-medium text-text-primary mb-6">
            Login
          </h2>

          {/* Form-level error */}
          {errors.form && (
            <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-lg">
              <p className="text-sm text-error">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                    <div key={idx} className="mb-3 last:mb-0">
                      <p className="text-xs font-medium text-text-secondary mb-1">{rule.title}</p>
                      <p className="text-xs text-text-muted mb-1">Domain: {rule.domain}</p>
                      <p className="text-xs text-success">Examples:</p>
                      <ul className="text-xs text-text-muted ml-3 space-y-0.5">
                        {rule.examples.map((ex, i) => (
                          <li key={i}>• {ex}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              error={errors.password}
            />

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-sage hover:text-green-dark transition-colors duration-card"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-soft"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-muted">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <Link to="/signup">
            <Button variant="secondary" className="w-full">
              Create Account
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

export default Login;