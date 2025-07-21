import { useState } from 'react';
import toast from 'react-hot-toast';

interface ApiOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  showNotifications?: boolean;
}

interface ApiOperationResult {
  execute: () => Promise<void>;
  isLoading: boolean;
  error: any;
}

export function useApiOperation(
  apiCall: () => Promise<any>,
  options: ApiOperationOptions = {}
): ApiOperationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const {
    successMessage = 'Операция выполнена успешно',
    errorMessage = 'Произошла ошибка',
    onSuccess,
    onError,
    showNotifications = true,
  } = options;

  const execute = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall();
      
      if (showNotifications) {
        toast.success(successMessage);
      }
      
      onSuccess?.();
    } catch (err) {
      setError(err);
      
      if (showNotifications) {
        toast.error(errorMessage);
      }
      
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
} 