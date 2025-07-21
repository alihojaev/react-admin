import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const auth = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Проверяем аутентификацию только если еще не инициализированы
    if (!hasChecked.current && !auth.isInitialized) {
      auth.checkAuth();
      hasChecked.current = true;
    }
  }, [auth.isInitialized]);

  return auth;
}; 