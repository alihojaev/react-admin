'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { ApiDataTable } from '@/components/ui';
import { Modal, TextInput, Group, Button, Select } from '@mantine/core';
import { AuthApi } from '@/lib/generated/api';

const columns = [
  { key: 'name', label: 'Имя', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Роль', sortable: true },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'createdAt', label: 'Дата создания', sortable: true },
];

export default function UsersPage() {
  const [addModalOpened, setAddModalOpened] = useState(false);
  const authApi = new AuthApi();

  const handleEdit = (row: any) => {
    console.log('Edit user:', row);
    // Здесь будет логика редактирования пользователя
  };

  const handleDelete = (row: any) => {
    console.log('Delete user:', row);
    // Здесь будет логика удаления пользователя
  };

  const handleAdd = () => {
    setAddModalOpened(true);
  };

  const handleDataLoaded = (data: any) => {
    console.log('Users data loaded:', data);
    // Здесь можно обработать загруженные данные
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
        <p className="text-gray-600 mb-6">
          Управление пользователями системы. Данные загружаются с сервера через API.
        </p>
        
        <ApiDataTable
          columns={columns}
          apiMethod={authApi.admin.getUsers}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          addButton={{
            label: 'Добавить пользователя',
            onClick: handleAdd,
          }}
          actions={{
            edit: handleEdit,
            delete: handleDelete,
          }}
          searchPlaceholder="Поиск по имени, email или роли"
          emptyMessage="Нет записей для отображения"
          onDataLoaded={handleDataLoaded}
        />
        
        <Modal 
          opened={addModalOpened} 
          onClose={() => setAddModalOpened(false)}
          title="Добавить нового пользователя"
          size="md"
          centered
        >
          <div>
            <TextInput
              label="Имя"
              placeholder="Введите имя пользователя"
              mb="md"
              required
            />
            <TextInput
              label="Email"
              placeholder="Введите email"
              mb="md"
              required
            />
            <Select
              label="Роль"
              placeholder="Выберите роль"
              data={[
                { value: 'Admin', label: 'Администратор' },
                { value: 'Moderator', label: 'Модератор' },
                { value: 'User', label: 'Пользователь' },
              ]}
              mb="md"
              required
            />
            <Select
              label="Статус"
              placeholder="Выберите статус"
              data={[
                { value: 'Active', label: 'Активный' },
                { value: 'Inactive', label: 'Неактивный' },
              ]}
              mb="lg"
              required
            />
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setAddModalOpened(false)}>
                Отмена
              </Button>
              <Button onClick={() => setAddModalOpened(false)}>
                Добавить
              </Button>
            </Group>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
} 