/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Backend endpoints should match these patterns
 */

const API_BASE_URL = 'http://localhost:5000/api/auth';
 // Replace with actual API URL

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set auth token in localStorage
 * @param {string} token - JWT token
 */
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove auth token from localStorage
 */
const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with token and user data
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Signup new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Verify email with token
 * @param {string} token - Verification token from email
 * @returns {Promise<Object>} Response
 */
export const verifyEmail = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-email?token=${token}`)
 ;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Verification failed');
    }

    return data;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
export const resendVerification = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend verification');
    }

    return data;
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Reset failed');
    }

    return data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Get current user data
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No auth token');
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    return data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Response
 */
export const logout = async () => {
  try {
    const token = getAuthToken();
    
    if (token) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthToken();
  }
};

export { getAuthToken, setAuthToken, clearAuthToken };