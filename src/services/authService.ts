import { AuthApi, P_Api } from '../lib/generated/api';
import { Http } from '../lib/http';
import { STORAGE_KEYS } from '../constants';
import { 
  AuthService, 
  LoginRequest, 
  AuthResponse, 
  User 
} from '../types/auth';

class AuthServiceImpl implements AuthService {
  private api: AuthApi;
  private publicApi: P_Api;
  private httpClient: Http;

  constructor() {
    this.api = new AuthApi();
    this.publicApi = new P_Api();
    this.httpClient = new Http();
  }

  // Метод для обновления API экземпляра
  updateApi() {
    this.api = new AuthApi();
    this.publicApi = new P_Api();
  }

  // Метод для вызова login в HTTP клиенте
  callHttpLogin(jwt: string) {
    // Используем статический метод для обновления всех HTTP клиентов
    Http.updateAllClients(jwt);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting login with credentials:', credentials);
      
      // Используем правильный endpoint для авторизации
      const response = await this.publicApi.auth.login(credentials);
      
      console.log('Login response:', response);
      
      if (!response) {
        throw new Error('No response from server');
      }
      
      // API возвращает объект напрямую, а не в поле data
      const responseData = response.data || response;
      
      if (!responseData) {
        console.error('Response without data:', response);
        throw new Error('Invalid response format');
      }
      
      if (!responseData.token) {
        console.error('Response without token:', responseData);
        throw new Error('No token in response');
      }
      
      console.log('Login successful, returning data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      const response = await this.api.cli.get(`/api/public/client/check/email/${email}`);
      const responseData = response?.data || response;
      return responseData || false;
    } catch (error) {
      return false;
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    try {
      const response = await this.api.cli.get(`/api/public/client/check/username/${username}`);
      const responseData = response?.data || response;
      return responseData || false;
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      console.log('Getting current user...');
      const token = Http.getCurrentToken();
      console.log('Token in getCurrentUser:', token);
      
      // Проверяем, что HTTP клиент обновлен
      if (token && !Http.isLoggedIn()) {
        console.log('HTTP client not logged in, updating...');
        Http.updateAllClients(token);
      }
      
      const response = await this.api.admin.current();
      
      console.log('Current user raw response:', response);
      
      if (!response) {
        throw new Error('No response from server');
      }
      
      // API может возвращать объект напрямую, а не в поле data
      const responseData = response.data || response;
      
      if (!responseData) {
        console.error('Response without data:', response);
        throw new Error('Invalid response format');
      }
      
      console.log('Current user response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      throw new Error('Failed to get current user');
    }
  }
}

export const authService = new AuthServiceImpl(); 