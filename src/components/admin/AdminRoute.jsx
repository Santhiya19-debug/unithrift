import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Admin Route Guard
 * Protects admin routes - requires authentication + admin role
 * Redirects non-admins to home, unauthenticated to login
 */
const AdminRoute = ({ children }) => {
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

  // Redirect to home if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;