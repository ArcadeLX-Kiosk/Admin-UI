import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../app/authContext';
import { Role } from '../types/user';

interface ProtectedRouteProps {
  allowedRole?: Role;
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If the user tries to access a route they don't have permission for,
    // redirect them to their own dashboard.
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
}
