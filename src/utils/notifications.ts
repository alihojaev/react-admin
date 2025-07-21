import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showInfo = (message: string) => {
  toast(message);
};

// Предустановленные сообщения
export const NOTIFICATION_MESSAGES = {
  SAVE_SUCCESS: 'Данные успешно сохранены',
  SAVE_ERROR: 'Не удалось сохранить данные',
  UPDATE_SUCCESS: 'Данные успешно обновлены',
  UPDATE_ERROR: 'Не удалось обновить данные',
  DELETE_SUCCESS: 'Запись успешно удалена',
  DELETE_ERROR: 'Не удалось удалить запись',
  LOAD_ERROR: 'Не удалось загрузить данные',
} as const; 