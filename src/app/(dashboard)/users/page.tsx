'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { ApiDataTable, ClientOnly } from '@/components/ui';
import { CustomForm, FieldConfig } from '@/components/forms/CustomForm';
import { Modal, Group, Button, ActionIcon, Menu, Text, LoadingOverlay } from '@mantine/core';
import { IconDots, IconEdit, IconPassword, IconTrash } from '@tabler/icons-react';
import { AuthApi } from '@/lib/generated/api';
import { validationRules } from '@/utils/validation';
import { CreateUserRequest, UpdateUserRequest, UpdatePasswordRequest, User } from '@/types/auth';
import { RoleDto } from '@/types/role';
import { showSuccess, showError } from '@/utils/notifications';

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { 
    key: 'authRolesCount', 
    label: 'Ролей', 
    sortable: false,
    value: (item: any) => item.authRoles?.length || 0,
  },
];

const UsersPage = React.memo(function UsersPage() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  // Модальные окна
  const [userModalOpened, setUserModalOpened] = useState(false);
  const [passwordModalOpened, setPasswordModalOpened] = useState(false);
  
  // Состояние форм
  const [userModel, setUserModel] = useState<Partial<User> & { password?: string }>({});
  const [passwordModel, setPasswordModel] = useState<Partial<User> & { password?: string }>({});
  const [formValid, setFormValid] = useState(false);
  const [passwordFormValid, setPasswordFormValid] = useState(false);
  
  // Мемоизируем модели для предотвращения лишних перерендеров
  const memoizedUserModel = React.useMemo(() => userModel, [userModel]);
  const memoizedPasswordModel = React.useMemo(() => passwordModel, [passwordModel]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Мемоизируем refreshTrigger чтобы избежать лишних обновлений
  const memoizedRefreshTrigger = React.useMemo(() => refreshTrigger, [refreshTrigger]);

  const authApi = React.useMemo(() => new AuthApi(), []);
  
  // Мемоизируем колонки внутри компонента
  const memoizedColumns = React.useMemo(() => columns, []);
  
  // Мемоизируем fieldsApiMethod
  const memoizedFieldsApiMethod = React.useCallback(async () => [
    { fieldName: 'id', fieldType: 'String', description: 'ID' },
    { fieldName: 'username', fieldType: 'String', description: 'Username' },
    { fieldName: 'authRolesCount', fieldType: 'Number', description: 'Ролей' },
  ], []);
  


  // Загрузка ролей при открытии модального окна
  const loadRolesIfNeeded = useCallback(async () => {
    if (roles.length === 0 && !rolesLoading) {
      try {
        setRolesLoading(true);
        const response = await authApi.role.list();
        setRoles(response);
      } catch (error) {
        console.error('Error loading roles:', error);
        showError('Ошибка загрузки ролей');
      } finally {
        setRolesLoading(false);
      }
    }
  }, [roles.length, rolesLoading, authApi.role]);

  // Удаление пользователя
  const handleDelete = useCallback(async (row: any) => {
    try {
      await authApi.admin.delete(row.id);
      showSuccess('Пользователь успешно удален');
      // Обновляем данные через ApiDataTable только после успешного удаления
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Ошибка удаления пользователя');
    }
  }, [authApi.admin]);

  // Редактирование пользователя
  const handleEdit = useCallback(async (row: any) => {
    await loadRolesIfNeeded();
    setUserModel({ ...row });
    setUserModalOpened(true);
  }, [loadRolesIfNeeded]);

  // Смена пароля
  const handleEditPassword = useCallback((user: User) => {
    setPasswordModel({ ...user });
    setPasswordModalOpened(true);
  }, []);

  // Сохранение пользователя
  const handleSaveUser = useCallback(async () => {
    try {
      if (memoizedUserModel.id) {
        // Обновление существующего пользователя
        const updateData: UpdateUserRequest = {
          id: memoizedUserModel.id,
          username: memoizedUserModel.username!,
          type: memoizedUserModel.type,
          authRoles: memoizedUserModel.authRoles?.map(role => ({ id: role.id }))
        };
        await authApi.admin.save(updateData);
        showSuccess('Пользователь успешно обновлен');
      } else {
        // Создание нового пользователя
        const createData: CreateUserRequest = {
          username: memoizedUserModel.username!,
          password: memoizedUserModel.password as string,
          type: memoizedUserModel.type,
          authRoles: memoizedUserModel.authRoles?.map(role => ({ id: role.id }))
        };
        await authApi.admin.save(createData);
        showSuccess('Пользователь успешно создан');
      }
      
      setUserModalOpened(false);
      setUserModel({});
      // Обновляем данные через ApiDataTable только после успешного сохранения
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving user:', error);
      showError('Ошибка сохранения пользователя');
    }
  }, [memoizedUserModel, authApi.admin]);

  // Сохранение пароля
  const handleSavePassword = useCallback(async () => {
    try {
      const updatePasswordData: UpdatePasswordRequest = {
        id: memoizedPasswordModel.id!,
        password: memoizedPasswordModel.password as string
      };
      await authApi.admin.updatePassword(updatePasswordData);
      showSuccess('Пароль успешно обновлен');
      setPasswordModalOpened(false);
      setPasswordModel({});
    } catch (error) {
      console.error('Error updating password:', error);
      showError('Ошибка обновления пароля');
    }
  }, [memoizedPasswordModel, authApi.admin]);

  // Добавление нового пользователя
  const handleAdd = useCallback(async () => {
    await loadRolesIfNeeded();
    setUserModel({});
    setUserModalOpened(true);
  }, [loadRolesIfNeeded]);

  // Конфигурация полей для формы пользователя
  const getUserFields = useCallback((): Record<string, FieldConfig> => {
    const fields: Record<string, FieldConfig> = {
      username: {
        type: 'string',
        label: 'Username',
        required: true,
        rules: [
          validationRules.required,
          validationRules.minLength(3),
          validationRules.maxLength(50),
          // Убираем асинхронную валидацию username для упрощения
          validationRules.minLength(3)
        ],
      },
    };

    // Добавляем поле пароля только для новых пользователей
    if (!memoizedUserModel?.id) {
      fields.password = {
        type: 'string',
        label: 'Пароль',
        required: true,
        password: true,
        rules: [
          validationRules.required,
          validationRules.password,
          validationRules.minLength(8)
        ],
      };
    }

    // Добавляем поле ролей только для админов или если тип не указан
    if (!memoizedUserModel?.type?.value || memoizedUserModel.type.value === 'ADMIN') {
      // Проверяем, что роли загружены и валидны
      const validRoles = roles.filter(role => role && role.id && role.name);
      if (validRoles.length > 0) {
        fields.authRoles = {
          type: 'multiselect',
          label: 'Доступы',
          required: true,
          items: validRoles.map(role => ({ 
            value: String(role.id), // Преобразуем в строку
            label: String(role.name) // Преобразуем в строку
          })),
          rules: [validationRules.required],
        };
      } else if (rolesLoading) {
        // Показываем поле загрузки, если роли еще загружаются
        fields.authRoles = {
          type: 'multiselect',
          label: 'Доступы (загрузка...)',
          required: true,
          items: [],
          disabled: true,
        };
      }
    }

    return fields;
  }, [memoizedUserModel?.id, memoizedUserModel?.type?.value, roles]);

  // Мемоизируем addButton и actions после объявления функций
  const memoizedAddButton = React.useMemo(() => ({
    label: 'Добавить',
    onClick: handleAdd,
  }), [handleAdd]);
  
  const memoizedActions = React.useMemo(() => ({
    edit: handleEdit,
    delete: handleDelete,
  }), [handleEdit, handleDelete]);

  // Конфигурация полей для формы пароля
  const getPasswordFields = useCallback((): Record<string, FieldConfig> => {
    return {
      password: {
        type: 'string',
        label: 'Пароль',
        required: true,
        password: true,
        rules: [
          validationRules.required,
          validationRules.password,
          validationRules.minLength(8)
        ],
      },
    };
  }, []);





  return (
    <ProtectedRoute>
      <ClientOnly>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Администраторы</h1>
          
          <ClientOnly>
            <ApiDataTable
              columns={memoizedColumns}
              apiMethod={authApi.admin.getUsers}
              fieldsApiMethod={memoizedFieldsApiMethod}
              searchable={true}
              pagination={true}
              itemsPerPage={10}
              addButton={memoizedAddButton}
              actions={memoizedActions}
              searchPlaceholder="Поиск по username"
              emptyMessage="Нет записей для отображения"
              refreshTrigger={memoizedRefreshTrigger}
              pageId="users-page"
            />
          </ClientOnly>
          
          {/* Модальное окно для редактирования пользователя */}
          <ClientOnly>
            <Modal 
              opened={userModalOpened} 
              onClose={() => {
                setUserModalOpened(false);
                setUserModel({});
              }}
              title="Настройки пользователя"
              size="md"
              centered
            >
              <CustomForm
                model={memoizedUserModel}
                fields={getUserFields()}
                onModelChange={setUserModel}
                onValidationChange={setFormValid}
              >
                <Group justify="center" mt="lg">
                  <Button 
                    variant="light" 
                    color="red" 
                    onClick={() => {
                      setUserModalOpened(false);
                      setUserModel({});
                    }}
                  >
                    Отменить
                  </Button>
                  <Button 
                    disabled={!formValid} 
                    onClick={handleSaveUser}
                  >
                    Сохранить
                  </Button>
                </Group>
              </CustomForm>
            </Modal>
          </ClientOnly>

          {/* Модальное окно для смены пароля */}
          <ClientOnly>
            <Modal 
              opened={passwordModalOpened} 
              onClose={() => {
                setPasswordModalOpened(false);
                setPasswordModel({});
              }}
              title="Сменить пароль"
              size="md"
              centered
            >
              <CustomForm
                model={memoizedPasswordModel}
                fields={getPasswordFields()}
                onModelChange={setPasswordModel}
                onValidationChange={setPasswordFormValid}
              >
                <Group justify="center" mt="lg">
                  <Button 
                    variant="light" 
                    color="red" 
                    onClick={() => {
                      setPasswordModalOpened(false);
                      setPasswordModel({});
                    }}
                  >
                    Отменить
                  </Button>
                  <Button 
                    disabled={!passwordFormValid} 
                    onClick={handleSavePassword}
                  >
                    Сохранить
                  </Button>
                </Group>
              </CustomForm>
            </Modal>
          </ClientOnly>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
});

export default UsersPage;