import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protected Route Guard
 * Ensures only authenticated users can access certain routes
 * Redirects blocked users to blocked page
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to blocked page if user is blocked
  if (user?.isBlocked) {
    return <Navigate to="/blocked" replace />;
  }

  return children;
};

export default ProtectedRoute;