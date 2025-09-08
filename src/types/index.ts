export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

export type ColorScheme = 'light' | 'dark' | 'auto';

export interface MenuPermission {
  value: string;
  authority: string;
  description: string;
  icon: string;
  screenType: {
    value: string;
    description: string;
    expanded: boolean;
    icon: string;
  };
  view: string;
}

export interface MenuScreen {
  value: string;
  description: string;
  expanded: boolean;
  icon: string;
}

export interface MenuItem {
  screen: MenuScreen;
  permissions: MenuPermission[];
}

export interface MenuResponse {
  items: MenuItem[];
}

// Экспорт типов для ролей
export * from './role'; 