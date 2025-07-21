import { useState } from 'react';
import { useApiOperation } from './useApiOperation';
import { NOTIFICATION_MESSAGES } from '@/utils/notifications';

interface CrudOperationsOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  showNotifications?: boolean;
}

export function useCrudOperations(options: CrudOperationsOptions = {}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  const createOperation = (apiCall: () => Promise<any>) => {
    return useApiOperation(apiCall, {
      successMessage: NOTIFICATION_MESSAGES.SAVE_SUCCESS,
      errorMessage: NOTIFICATION_MESSAGES.SAVE_ERROR,
      onSuccess: () => {
        refreshData();
        options.onSuccess?.();
      },
      onError: options.onError,
      showNotifications: options.showNotifications,
    });
  };

  const updateOperation = (apiCall: () => Promise<any>) => {
    return useApiOperation(apiCall, {
      successMessage: NOTIFICATION_MESSAGES.UPDATE_SUCCESS,
      errorMessage: NOTIFICATION_MESSAGES.UPDATE_ERROR,
      onSuccess: () => {
        refreshData();
        options.onSuccess?.();
      },
      onError: options.onError,
      showNotifications: options.showNotifications,
    });
  };

  const deleteOperation = (apiCall: () => Promise<any>) => {
    return useApiOperation(apiCall, {
      successMessage: NOTIFICATION_MESSAGES.DELETE_SUCCESS,
      errorMessage: NOTIFICATION_MESSAGES.DELETE_ERROR,
      onSuccess: () => {
        refreshData();
        options.onSuccess?.();
      },
      onError: options.onError,
      showNotifications: options.showNotifications,
    });
  };

  return {
    createOperation,
    updateOperation,
    deleteOperation,
    refreshTrigger,
    refreshData,
  };
} 