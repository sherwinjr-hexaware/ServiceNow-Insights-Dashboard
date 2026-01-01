import { Suspense, lazy } from 'react';
import { Outlet, RouteObject, createBrowserRouter, useLocation } from 'react-router-dom';
import App from 'App';
import AuthLayout from 'layouts/auth-layout';
import MainLayout from 'layouts/main-layout';
import Page404 from 'pages/errors/Page404';
import PageLoader from 'components/loading/PageLoader';
import paths, { rootPaths } from './paths';
import { ProtectedRoute } from 'components/auth/ProtectedRoute';
const Analytics = lazy(() => import('pages/dashboard/Analytics'));
const UserList = lazy(() => import('pages/users/UserList'));
const Starter = lazy(() => import('pages/others/Starter'));
const Account = lazy(() => import('pages/others/Account'));
const Login = lazy(() => import('pages/authentication/Login'));

const Signup = lazy(() => import('pages/authentication/Signup'));

export const SuspenseOutlet = () => {
  const location = useLocation();
  return (
<Suspense key={location.pathname} fallback={<PageLoader />}>
<Outlet />
</Suspense>
  );
};
export const routes: RouteObject[] = [
  {
    element: <App />, 
    children: [
      {
        path: paths.root,

        element: (
<ProtectedRoute>
<MainLayout>
<SuspenseOutlet />
</MainLayout>
</ProtectedRoute>
  ),
        children: [
          { index: true, element: <Analytics /> },
          { path: paths.users, element: <UserList /> },
          { path: paths.account, element: <Account /> },
          { path: paths.starter, element: <Starter /> }
        ]

      },
      {
        path: rootPaths.authRoot,

        element: (
<AuthLayout>
<SuspenseOutlet />
</AuthLayout>
        ),
        children: [

          { path: 'login', element: <Login /> },
          { path: 'signup', element: <Signup /> }

        ]

      },

      { path: paths['404'], element: <Page404 /> },

      { path: '*', element: <Page404 /> }

    ]

  }

];
const router = createBrowserRouter(routes, {

  basename: import.meta.env.MODE === 'production' ? import.meta.env.VITE_BASENAME : '/'

});

export default router;
 