import React from 'react';
import { useApiOperation, useCrudOperations } from '@/hooks';
import { showSuccess, showError, NOTIFICATION_MESSAGES } from '@/utils/notifications';
import { AuthApi } from '@/lib/generated/api';

const authApi = new AuthApi();

// Пример 1: Использование базового хука useApiOperation
export function ExampleWithUseApiOperation() {
  const { execute: saveData, isLoading: isSaving } = useApiOperation(
    () => authApi.example.save({ name: 'Test' }),
    {
      successMessage: 'Данные сохранены!',
      errorMessage: 'Ошибка сохранения',
      onSuccess: () => console.log('Успешно сохранено'),
    }
  );

  return (
    <button onClick={saveData} disabled={isSaving}>
      {isSaving ? 'Сохранение...' : 'Сохранить'}
    </button>
  );
}

// Пример 2: Использование специализированного хука useCrudOperations
export function ExampleWithUseCrudOperations() {
  const { createOperation, updateOperation, deleteOperation, refreshTrigger } = useCrudOperations({
    onSuccess: () => console.log('Операция выполнена'),
  });

  const { execute: save, isLoading: isSaving } = createOperation(
    () => authApi.example.save({ name: 'Test' })
  );

  const { execute: update, isLoading: isUpdating } = updateOperation(
    () => authApi.example.update('123', { name: 'Updated' })
  );

  const { execute: deleteRecord, isLoading: isDeleting } = deleteOperation(
    () => authApi.example.delete('123')
  );

  return (
    <div>
      <button onClick={save} disabled={isSaving}>
        Сохранить
      </button>
      <button onClick={update} disabled={isUpdating}>
        Обновить
      </button>
      <button onClick={deleteRecord} disabled={isDeleting}>
        Удалить
      </button>
    </div>
  );
}

// Пример 3: Использование утилит напрямую
export function ExampleWithDirectUtils() {
  const handleSave = async () => {
    try {
      await authApi.example.save({ name: 'Test' });
      showSuccess(NOTIFICATION_MESSAGES.SAVE_SUCCESS);
    } catch (error) {
      showError(NOTIFICATION_MESSAGES.SAVE_ERROR);
    }
  };

  const handleDelete = async () => {
    try {
      await authApi.example.delete('123');
      showSuccess(NOTIFICATION_MESSAGES.DELETE_SUCCESS);
    } catch (error) {
      showError(NOTIFICATION_MESSAGES.DELETE_ERROR);
    }
  };

  return (
    <div>
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
} 