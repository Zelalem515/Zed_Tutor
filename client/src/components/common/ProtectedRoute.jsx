import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

/**
 * ProtectedRoute — wraps any route that requires admin authentication.
 * While auth state is loading (first mount, token verification in progress)
 * shows a neutral spinner so the page doesn't flash to /admin/login prematurely.
 * Once resolved: authenticated → renders children; unauthenticated → redirects.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4 text-slate-400">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-navy-900 to-academic-600 flex items-center justify-center animate-pulse">
            <Lock className="w-5 h-5 text-gold-400" />
          </div>
          <p className="text-sm font-medium">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
