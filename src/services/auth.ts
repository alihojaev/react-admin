import { apiClient } from '@/lib';
import type { User, ApiResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Сохраняем токен в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user-token', response.data.token);
        localStorage.setItem('user-data', JSON.stringify(response.data.user));
      }
      return response.data;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Удаляем данные из localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-data');
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('user-token');
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user-data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        return null;
      }
    }
    
    return null;
  }
}

export const authService = new AuthService(); 