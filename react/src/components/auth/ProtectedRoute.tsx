import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import PageLoader from 'components/loading/PageLoader';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to={paths.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
