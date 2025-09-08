export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  authType: 'EMAIL';
  blocked: boolean;
  lastActivity: string;
  type?: {
    value: string;
    description: string;
  };
  authRoles?: Array<{
    id: string;
    name: string;
  }>;
  cdt?: string;
}

export interface CreateUserRequest {
  username: string;
  password?: string;
  type?: {
    value: string;
  };
  authRoles?: Array<{
    id: string;
  }>;
}

export interface UpdateUserRequest {
  id: string;
  username: string;
  type?: {
    value: string;
  };
  authRoles?: Array<{
    id: string;
  }>;
}

export interface UpdatePasswordRequest {
  id: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface AuthService {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  checkEmail: (email: string) => Promise<boolean>;
  checkUsername: (username: string) => Promise<boolean>;
  getCurrentUser: () => Promise<User>;
} 