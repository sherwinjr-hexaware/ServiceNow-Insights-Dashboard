import { documentationPath } from 'lib/constants';

export const rootPaths = {
  root: '/',
  authRoot: 'auth',
};
const paths = {
  root: rootPaths.root,
  dashboard: '/',
  starter: '/starter',
  users: '/users',
  account: '/account',
  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/signup`,
  notifications: '/notifications',
  documentation: documentationPath,
  404: '/404',
};

export default paths;
