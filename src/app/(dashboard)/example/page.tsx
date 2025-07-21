'use client';

import React, { useState, useMemo } from 'react';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { ApiDataTable } from '@/components/ui';
import { Modal, Group, Button, Stack } from '@mantine/core';
import { CustomForm, FieldConfig } from '@/components/forms';
import { AuthApi } from '@/lib/generated/api';
import { ExampleModel } from '@/types/example';
import { useCrudOperations } from '@/hooks';
import { showSuccess, showError, NOTIFICATION_MESSAGES } from '@/utils/notifications';

const columns = [
  { key: 'name', label: 'Название', sortable: true },
  { key: 'cdt', label: 'Создано', sortable: true },
];

// Создаем экземпляр API один раз
const authApi = new AuthApi();

// Дефолтный объект для формы
const defaultFormData: ExampleModel = {
  text: '',
  name: '',
  description: '',
  number: 0,
  amount: 0,
  date: '',
  dateTime: '',
  time: '',
};

export default function ExamplePage() {
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [resetTouched, setResetTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  
  // Используем хук для CRUD операций
  const { createOperation, updateOperation, deleteOperation, refreshTrigger, refreshData } = useCrudOperations({
    onSuccess: () => {
      // Закрываем модальное окно после успешной операции
      setAddModalOpened(false);
      setIsEditMode(false);
      setEditingRecord(null);
      
      // Сбрасываем форму
      setProductData(defaultFormData);
      setIsFormValid(false);
      setResetTouched(true);
      setTimeout(() => setResetTouched(false), 100);
    }
  });
  const [productData, setProductData] = useState<ExampleModel>(defaultFormData);

  // Мемоизируем колонки
  const memoizedColumns = useMemo(() => columns, []);

  const handleEdit = useMemo(() => (row: any) => {
    // Используем данные строки напрямую, так как они уже содержат правильные поля
    const recordData = { ...row };
    
    // Устанавливаем режим редактирования и данные для редактирования
    setEditingRecord(recordData);
    setProductData(recordData);
    setIsEditMode(true);
    setAddModalOpened(true);
    setIsFormValid(true); // В режиме редактирования форма уже валидна
    setResetTouched(true);
    setTimeout(() => setResetTouched(false), 100);
  }, []);

  const handleDelete = useMemo(() => (row: any) => {
    authApi.example.delete(row.id)
      .then(() => {
        refreshData();
        showSuccess(NOTIFICATION_MESSAGES.DELETE_SUCCESS);
      })
      .catch((error) => {
        showError(NOTIFICATION_MESSAGES.DELETE_ERROR);
      });
  }, [refreshData]);

  const { execute: saveRecord, isLoading: isSaving } = createOperation(
    () => authApi.example.save(productData)
  );

  const { execute: updateRecord, isLoading: isUpdating } = updateOperation(
    () => authApi.example.update(editingRecord?.id || '', productData)
  );

  const handleAdd = useMemo(() => () => {
    // Сбрасываем режим редактирования
    setIsEditMode(false);
    setEditingRecord(null);
    
    // Сбрасываем форму для новой записи
    setProductData(defaultFormData);
    setIsFormValid(false);
    setAddModalOpened(true);
    setResetTouched(true);
    setTimeout(() => setResetTouched(false), 100);
  }, []);

  const productFields: Record<string, FieldConfig> = useMemo(() => ({
    text: {
      type: 'string',
      label: 'Текст',
      placeholder: 'Введите текст',
      required: true,
      cols: 12,
      rules: [
        (value) => (!value || value.trim() === '') ? 'Текст обязателен' : null,
      ],
    },
    name: {
      type: 'string',
      label: 'Название',
      placeholder: 'Введите название',
      required: true,
      cols: 12,
      rules: [
        (value) => (!value || value.trim() === '') ? 'Название обязательно' : null,
      ],
    },
    description: {
      type: 'string',
      label: 'Описание',
      placeholder: 'Введите описание',
      required: true,
      cols: 12,
      rules: [
        (value) => (!value || value.trim() === '') ? 'Описание обязательно' : null,
      ],
    },
    number: {
      type: 'number',
      label: 'Число',
      placeholder: 'Введите число',
      required: true,
      cols: 12,
      step: 1,
      min: 0,
      rules: [
        (value) => (value === undefined || value === null) ? 'Число обязательно' : null,
        (value) => (typeof value === 'number' && value < 0) ? 'Число должно быть больше или равно 0' : null,
      ],
    },
    amount: {
      type: 'number',
      label: 'Сумма',
      placeholder: 'Введите сумму',
      required: true,
      cols: 12,
      step: 0.01,
      min: 0,
      rules: [
        (value) => (value === undefined || value === null) ? 'Сумма обязательна' : null,
        (value) => (typeof value === 'number' && value < 0) ? 'Сумма должна быть больше или равна 0' : null,
      ],
    },
    date: {
      type: 'date',
      label: 'Дата',
      required: true,
      cols: 12,
      rules: [
        (value) => (!value) ? 'Дата обязательна' : null,
        (value) => (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) ? 'Неверный формат даты' : null,
      ],
    },
    dateTime: {
      type: 'datetime',
      label: 'Дата и время',
      required: true,
      cols: 12,
      rules: [
        (value) => (!value) ? 'Дата и время обязательны' : null,
      ],
    },
    time: {
      type: 'time',
      label: 'Время',
      required: true,
      cols: 12,
      rules: [
        (value) => (!value) ? 'Время обязательно' : null,
        (value) => (value && !/^\d{2}:\d{2}$/.test(value)) ? 'Неверный формат времени' : null,
      ],
    },
  }), []);

  const handleSubmit = useMemo(() => () => {
    if (isEditMode && editingRecord) {
      updateRecord();
    } else {
      saveRecord();
    }
  }, [isEditMode, editingRecord, updateRecord, saveRecord]);

  const handleCloseModal = useMemo(() => () => {
    const isAnyOperationInProgress = isSaving || isUpdating;
    if (isAnyOperationInProgress) return; // Не закрываем во время операций
    
    setAddModalOpened(false);
    
    // Сбрасываем режим редактирования
    setIsEditMode(false);
    setEditingRecord(null);
    
    // Сброс формы и состояния touched
    setProductData(defaultFormData);
    setIsFormValid(false);
    setResetTouched(true);
    // Сбрасываем флаг через небольшую задержку
    setTimeout(() => setResetTouched(false), 100);
  }, [isSaving, isUpdating]);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Пример таблицы с API и HTML5 типами полей</h1>
        <p className="text-gray-600 mb-6">
          Эта таблица использует ApiDataTable компонент для загрузки данных с сервера. 
          При изменении поиска, пагинации или сортировки автоматически отправляются запросы к API.
          Форма демонстрирует работу HTML5 типов полей с автоматическим определением типов.
        </p>
        
        <ApiDataTable
          columns={memoizedColumns}
          apiMethod={authApi.example.listAll}
          fieldsApiMethod={authApi.example.getFields}
          addButton={{
            onClick: handleAdd,
          }}
          showSettingsButton={true}
          actions={{
            edit: handleEdit,
            delete: handleDelete,
          }}
          pageId="example-page"
          refreshTrigger={refreshTrigger}
        />
        
        <Modal 
          opened={addModalOpened} 
          onClose={handleCloseModal}
          title={isEditMode ? "Редактировать запись" : "Добавить новую запись"}
          size="lg"
          centered
          closeOnClickOutside={!(isSaving || isUpdating)}
          closeOnEscape={!(isSaving || isUpdating)}
        >
          <Stack gap="md">
            <CustomForm
              model={productData}
              fields={productFields}
              onModelChange={(model) => setProductData(model as ExampleModel)}
              dense={true}
              resetTouched={resetTouched}
              onValidationChange={setIsFormValid}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleCloseModal}>
                Отмена
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid || isSaving || isUpdating}
                color={isFormValid ? 'green' : 'gray'}
                loading={isSaving || isUpdating}
              >
                {isSaving || isUpdating
                  ? 'Сохранение...' 
                  : isFormValid 
                    ? (isEditMode ? 'Обновить' : 'Сохранить') 
                    : 'Заполните все поля'
                }
              </Button>
            </Group>
          </Stack>
        </Modal>
      </div>
    </ProtectedRoute>
  );
} 