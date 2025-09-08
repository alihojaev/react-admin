import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import { Http } from '../lib/http';
import { 
  AuthState, 
  User, 
  LoginCredentials
} from '../types/auth';
import { STORAGE_KEYS } from '../constants';

// Функция для обновления HTTP клиента
const updateHttpClient = async () => {
  // Принудительно пересоздаем HTTP клиент с новыми заголовками
  if (typeof window !== 'undefined') {
    try {
      const token = Http.getCurrentToken();
      
      // Обновляем API экземпляр в authService
      authService.updateApi();
      
      // Небольшая задержка для полной инициализации HTTP клиента
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Failed to update HTTP client:', error);
    }
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Начинаем с true, чтобы показать загрузку
      isInitialized: false, // Новый флаг для отслеживания инициализации

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          
          if (!response) {
            throw new Error('No response from login service');
          }
          
          if (!response.token) {
            throw new Error('No token in response');
          }
          
          // Используем статический метод для обновления токена
          Http.updateAllClients(response.token);
          
          // Вызываем метод login в HTTP клиенте
          authService.callHttpLogin(response.token);
          
          await updateHttpClient();
          
          // Получаем актуальные данные пользователя
          try {
            const currentUser = await authService.getCurrentUser();
            set({ 
              user: currentUser, 
              isAuthenticated: true, 
              isLoading: false,
              isInitialized: true
            });
          } catch (_userError) {
            // Создаем временного пользователя на основе credentials
            const tempUser: User = {
              id: 'temp',
              email: credentials.username, // используем username как email временно
              username: credentials.username,
              authType: 'EMAIL',
              blocked: false,
              lastActivity: new Date().toISOString()
            };
            set({ 
              user: tempUser, 
              isAuthenticated: true, 
              isLoading: false,
              isInitialized: true
            });
          }
        } catch (error) {
          console.error('Login error in store:', error);
          set({ isLoading: false, isInitialized: true });
          throw error;
        }
      },

      logout: () => {
        // Используем статический метод для очистки токена
        Http.updateAllClients(null);
        updateHttpClient().catch(console.error);
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          isInitialized: true
        });
      },

      checkAuth: async () => {
        const token = Http.getCurrentToken();
        
        if (!token) {
          set({ 
            isAuthenticated: false, 
            user: null, 
            isLoading: false, 
            isInitialized: true 
          });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            isInitialized: true
          });
        } catch (error) {
          Http.updateAllClients(null);
          updateHttpClient().catch(console.error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      // Добавляем обработчик для правильной инициализации
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Всегда устанавливаем isInitialized в true после восстановления из localStorage
          state.isInitialized = true;
          state.isLoading = false;
        }
      },
    }
  )
); 