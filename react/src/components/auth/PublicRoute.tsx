import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import PageLoader from 'components/loading/PageLoader';

export const PublicRoute = ({ children }: PropsWithChildren) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return <>{children}</>;
};
