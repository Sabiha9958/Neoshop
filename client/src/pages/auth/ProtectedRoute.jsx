import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
