export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  authType: 'EMAIL';
  blocked: boolean;
  lastActivity: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  username: string;
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