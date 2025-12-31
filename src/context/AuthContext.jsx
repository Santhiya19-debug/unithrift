import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const data = await authService.getCurrentUser();

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);

      localStorage.setItem('authToken', data.token);

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      if (data.user?.isBlocked) {
        navigate('/blocked');
      } else if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (signupData) => {
    try {
      const data = await authService.signup(signupData);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');

    if (token) {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    navigate('/login');
  }
};


  const requestPasswordReset = async (email) => {
    return authService.forgotPassword(email);
  };

  const resetPassword = async (token, newPassword) => {
    return authService.resetPassword(token, newPassword);
  };

  const verifyEmail = async (token) => {
    return authService.verifyEmail(token);
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
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
