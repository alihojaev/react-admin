export const APP_NAME = 'Next App Mantine Tailwind Template';
export const APP_DESCRIPTION = 'Next App Mantine Tailwind Template';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/';

export const STORAGE_KEYS = {
  COLOR_SCHEME: 'mantine-color-scheme',
  USER_TOKEN: 'user-token',
  USER_DATA: 'user-data',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const; 