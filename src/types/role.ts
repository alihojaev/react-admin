// Enum для типов разрешений
export enum PermissionType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ADMIN = 'ADMIN'
}

// Интерфейс для разрешения
export interface PermissionDto {
  id: string; // UUID в виде строки
  name: PermissionType;
  operationPermissions: number;
}

// Интерфейс для роли
export interface RoleDto {
  id?: string; // UUID в виде строки, опциональный для создания
  name: string;
  description: string;
  createdBy?: string; // UUID в виде строки
  cdt?: string; // LocalDateTime в формате ISO string
  permissions: PermissionDto[];
}

// Дефолтный объект для создания новой роли
export const defaultRoleData: RoleDto = {
  name: '',
  description: '',
  permissions: [],
};

// Интерфейс для валидации роли
export interface RoleValidation {
  isValid: boolean;
  errors: string[];
}

// Функция валидации роли
export const validateRole = (role: RoleDto): RoleValidation => {
  const errors: string[] = [];

  // Проверка названия
  if (!role.name || role.name.trim() === '') {
    errors.push('Название роли не указано');
  }

  // Проверка разрешений
  if (!role.permissions || role.permissions.length === 0) {
    errors.push('Не указано ни одного разрешения для роли');
  } else {
    // Проверка каждого разрешения
    role.permissions.forEach((permission, index) => {
      if (!permission.id) {
        errors.push(`Разрешение ${index + 1}: ID не указан`);
      }
      
      if (!permission.name) {
        errors.push(`Разрешение ${index + 1}: Тип разрешения не указан`);
      }
      
      if (permission.operationPermissions === undefined || permission.operationPermissions === null) {
        errors.push(`Разрешение ${index + 1}: Права доступа не указаны`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Маппинг Java типов на TypeScript для ролей
export const ROLE_JAVA_TO_TS_TYPES = {
  'UUID': 'string',
  'String': 'string',
  'LocalDateTime': 'datetime',
  'List<PermissionDto>': 'array',
} as const;

// Маппинг Java типов на HTML5 типы для ролей
export const ROLE_JAVA_TO_HTML5_TYPES = {
  'UUID': 'text',
  'String': 'text',
  'LocalDateTime': 'datetime-local',
  'List<PermissionDto>': 'array',
} as const; 