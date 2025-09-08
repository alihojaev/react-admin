export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{10,14}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

export function isValidPassword(password: string): boolean {
  // Минимум 8 символов, хотя бы одна буква и одна цифра
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function validateRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}

// Правила валидации для форм
export const validationRules = {
  required: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Это поле обязательно для заполнения';
    }
    if (Array.isArray(value) && value.length === 0) {
      return 'Это поле обязательно для заполнения';
    }
    return null;
  },

  email: (value: string) => {
    if (value && !isValidEmail(value)) {
      return 'Введите корректный email адрес';
    }
    return null;
  },

  password: (value: string) => {
    if (value && !isValidPassword(value)) {
      return 'Пароль должен содержать минимум 8 символов, включая буквы и цифры';
    }
    return null;
  },

  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Минимальная длина ${min} символов`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Максимальная длина ${max} символов`;
    }
    return null;
  },

  // Функция для проверки уникальности username
  validateUsername: (authApi: any, currentUserId?: string) => async (value: string) => {
    if (!value) return null;
    
    try {
      const search = {
        page: 0,
        size: 10,
        sort: "",
        rsql: `username%3Din%3D${value}`
      };

      const response = await authApi.admin.getUsers(search.rsql, search.page, search.size, search.sort);
      
      if (response.content && response.content.length > 0) {
        // Если редактируем пользователя, исключаем его из проверки
        const existingUser = response.content.find((user: any) => user.id !== currentUserId);
        if (existingUser) {
          return 'Username уже существует';
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error validating username:', error);
      return null; // В случае ошибки не блокируем форму
    }
  }
}; 