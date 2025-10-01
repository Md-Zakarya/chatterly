import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mono-card p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white mx-auto"></div>
            <p className="mt-4 text-[var(--muted)]">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;