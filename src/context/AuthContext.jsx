import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

/**
 * AuthProvider - Manages authentication state globally
 * Provides auth state and actions to all components
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   * Validates JWT token and fetches user data
   */
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // Validate token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        // Invalid token, clear it
        localStorage.removeItem('authToken');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result with user data or error
   */
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }

      // Store token
      localStorage.setItem('authToken', data.token);

      // Set user data
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false
      });

      // Role-based redirect
      if (data.user.isBlocked) {
        return { success: true, redirect: '/blocked' };
      } else if (data.user.role === 'admin') {
        return { success: true, redirect: '/admin' };
      } else {
        return { success: true, redirect: '/' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Signup new user
   * @param {Object} signupData - User signup data
   * @returns {Promise<Object>} Signup result
   */
  const signup = async (signupData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Signup failed' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Call backend logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless
      localStorage.removeItem('authToken');
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      navigate('/login');
    }
  };

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Result
   */
  const requestPasswordReset = async (email) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Request failed' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Result
   */
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Reset failed' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Result
   */
  const verifyEmail = async (token) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Verification failed' };
      }

      // Update user state
      if (authState.user) {
        setAuthState(prev => ({
          ...prev,
          user: { ...prev.user, isVerified: true }
        }));
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook - Access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};