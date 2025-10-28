import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import authService from '../services/auth-service';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const authenticated = authService.isAuthenticated();
  
  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

