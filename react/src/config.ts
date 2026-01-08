import { mainDrawerWidth } from 'lib/constants';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/metrics'; // Default to NestJS metrics base URL

export const fontFamilies = ['Plus Jakarta Sans', 'Roboto', 'Inter', 'Poppins'] as const;

export type FontFamily = (typeof fontFamilies)[number];

export interface Config {
  assetsDir: string;
  sidenavCollapsed: boolean;
  openNavbarDrawer: boolean;
  drawerWidth: number;
  fontFamily: FontFamily;
}

export const initialConfig: Config = {
  assetsDir: import.meta.env.VITE_ASSET_BASE_URL ?? '',
  sidenavCollapsed: false,
  openNavbarDrawer: false,
  drawerWidth: mainDrawerWidth.full,
  fontFamily: fontFamilies[0],
};

export const defaultAuthCredentials = {
  email: 'demo@aurora.com',
  password: 'password123',
};
