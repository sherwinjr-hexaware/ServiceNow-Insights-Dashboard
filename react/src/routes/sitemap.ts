import { HTMLAttributeAnchorTarget } from 'react';

import { SxProps } from '@mui/material';

import paths, { rootPaths } from './paths';

export interface SubMenuItem {

  name: string;

  pathName: string;

  key?: string;

  selectionPrefix?: string;

  path?: string;

  target?: HTMLAttributeAnchorTarget;

  active?: boolean;

  icon?: string;

  iconSx?: SxProps;

  items?: SubMenuItem[];

}

export interface MenuItem {

  id: string;

  key?: string; // Used for translation/locale

  subheader?: string;

  icon: string;

  target?: HTMLAttributeAnchorTarget;

  iconSx?: SxProps;

  items: SubMenuItem[];

}

const sitemap: MenuItem[] = [

  {

    id: 'pages',

    subheader: 'ServiceNow Insights',

    icon: 'material-symbols:view-quilt-outline',

    items: [

      {

        name: 'Main Dashboard',

        path: rootPaths.root,

        pathName: 'dashboard',

        icon: 'material-symbols:query-stats-rounded',

        active: true,

        selectionPrefix: rootPaths.root,

      },

      {

        name: 'Users',

        path: paths.users,

        pathName: 'users',

        icon: 'material-symbols:account-box-outline',

        active: true,

        selectionPrefix: '/users',

      },

      {

        name: 'Account',

        key: 'account',

        path: paths.account,

        pathName: 'account',

        active: true,

        icon: 'material-symbols:admin-panel-settings-outline-rounded',

        selectionPrefix: '/account',

      },

    ],

  },

  {

    id: 'auth-group',

    subheader: 'Authentication',

    icon: 'material-symbols:lock-outline',

    items: [

      {

        name: 'Login',

        icon: 'material-symbols:login',

        path: paths.login,

        pathName: 'login',

        active: true,

        selectionPrefix: '/auth',

      },

      {

        name: 'Sign up',

        icon: 'material-symbols:person-add-outline',

        path: paths.signup,

        pathName: 'signup',

        active: true,

        selectionPrefix: '/auth',

      },

    ],

  },

];

export default sitemap;
 