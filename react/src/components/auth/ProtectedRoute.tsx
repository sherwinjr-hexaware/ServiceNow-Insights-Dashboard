import { PropsWithChildren } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from 'providers/AuthProvider'; // Using absolute import

import PageLoader from 'components/loading/PageLoader';

import paths from 'routes/paths';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {

  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {

    return <PageLoader />;

  }

  if (!user) {

    // Redirect to login, but save the current location so we can go back after login

    return <Navigate to={paths.login} state={{ from: location }} replace />;

  }

  return <>{children}</>;

};
 