'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { ApiDataTable } from '@/components/ui';
import { Modal, Group, Button, Stack } from '@mantine/core';
import { CustomForm, FieldConfig } from '@/components/forms';
import { AuthApi } from '@/lib/generated/api';
import { RoleDto, defaultRoleData, PermissionDto } from '@/types/role';
import { useCrudOperations } from '@/hooks';
import { showSuccess, showError, NOTIFICATION_MESSAGES } from '@/utils/notifications';

const columns = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'cdt', label: 'Создано', sortable: true },
];

// Создаем экземпляр API один раз
const authApi = new AuthApi();

// Дефолтный объект для формы
const defaultFormData: RoleDto = defaultRoleData;

export default function RolePage() {
    const [addModalOpened, setAddModalOpened] = useState(false);
    const [resetTouched, setResetTouched] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [permissions, setPermissions] = useState<PermissionDto[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    // Загрузка разрешений при загрузке страницы
    useEffect(() => {
        const loadPermissions = async () => {
            setLoadingPermissions(true);
            try {
                const response = await authApi.permission.list();
                
                // Пробуем разные варианты структуры ответа
                let permissionsData = [];
                if (Array.isArray(response)) {
                    permissionsData = response;
                } else if (response && Array.isArray(response.data)) {
                    permissionsData = response.data;
                } else if (response && Array.isArray(response.content)) {
                    permissionsData = response.content;
                } else if (response && Array.isArray(response.items)) {
                    permissionsData = response.items;
                } else {
                    permissionsData = [];
                }
                
                // Преобразуем данные в нужный формат
                permissionsData = permissionsData.map((perm: any) => ({
                    id: perm.id,
                    name: perm.name?.value || perm.name || 'UNKNOWN',
                    operationPermissions: perm.operationPermissions || 0
                }));
                
                setPermissions(permissionsData);
            } catch (error) {
                console.error('Ошибка загрузки разрешений:', error);
                showError('Не удалось загрузить список разрешений');
            } finally {
                setLoadingPermissions(false);
            }
        };

        loadPermissions();
    }, []);

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
    const [productData, setProductData] = useState<RoleDto>(defaultFormData);

    // Мемоизируем колонки
    const memoizedColumns = useMemo(() => columns, []);

    const handleEdit = useMemo(() => (row: any) => {
        // Используем данные строки напрямую, так как они уже содержат правильные поля
        const recordData = { ...row };

        // Преобразуем permissions в массив ID для MultiSelect
        if (recordData.permissions && Array.isArray(recordData.permissions)) {
            recordData.permissions = recordData.permissions.map((perm: any) => 
                typeof perm === 'string' ? perm : perm.id
            );
        }

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
        authApi.role.delete(row.id)
            .then(() => {
                refreshData();
                showSuccess(NOTIFICATION_MESSAGES.DELETE_SUCCESS);
            })
            .catch((error) => {
                showError(NOTIFICATION_MESSAGES.DELETE_ERROR);
            });
    }, [refreshData]);

    const { execute: saveRecord, isLoading: isSaving } = createOperation(
        () => {
            // Преобразуем выбранные ID разрешений обратно в объекты PermissionDto
            const submitData = { ...productData };
            if (submitData.permissions && Array.isArray(submitData.permissions)) {
                submitData.permissions = submitData.permissions.map((permId: any) => {
                    const permission = permissions.find(p => p.id === permId);
                    return permission || { id: permId, name: 'UNKNOWN' as any, operationPermissions: 0 };
                });
            }
            return authApi.role.save(submitData);
        }
    );

    const { execute: updateRecord, isLoading: isUpdating } = updateOperation(
        () => {
            // Преобразуем выбранные ID разрешений обратно в объекты PermissionDto
            const submitData = { ...productData };
            if (submitData.permissions && Array.isArray(submitData.permissions)) {
                submitData.permissions = submitData.permissions.map((permId: any) => {
                    const permission = permissions.find(p => p.id === permId);
                    return permission || { id: permId, name: 'UNKNOWN' as any, operationPermissions: 0 };
                });
            }
            // Для обновления используем тот же метод save, но с ID в данных
            submitData.id = editingRecord?.id;
            return authApi.role.save(submitData);
        }
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
        name: {
            type: 'string',
            label: 'Название роли',
            placeholder: 'Введите название роли',
            required: true,
            cols: 12,
            rules: [
                (value) => (!value || value.trim() === '') ? 'Название роли обязательно' : null,
            ],
        },
        description: {
            type: 'string',
            label: 'Описание роли',
            placeholder: 'Введите описание роли',
            required: true,
            cols: 12,
            rules: [
                (value) => (!value || value.trim() === '') ? 'Описание роли обязательно' : null,
            ],
        },
        permissions: {
            type: 'multiselect',
            label: 'Разрешения',
            placeholder: loadingPermissions ? 'Загрузка разрешений...' : 'Выберите разрешения',
            required: true,
            cols: 12,
            disabled: loadingPermissions,
            items: (() => {
                const items = permissions.map(permission => ({
                    value: permission.id,
                    label: permission.name
                }));
                return items;
            })(),
            searchable: true,
            clearable: true,
            rules: [
                (value) => (!value || value.length === 0) ? 'Необходимо выбрать хотя бы одно разрешение' : null,
            ],
        },
    }), [permissions, loadingPermissions]);

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
                <h1 className="text-2xl font-bold mb-4">Роли</h1>
                <ApiDataTable
                    columns={memoizedColumns}
                    apiMethod={authApi.role.listAll}
                    fieldsApiMethod={authApi.role.getFields}
                    addButton={{
                        onClick: handleAdd,
                    }}
                    showSettingsButton={false}
                    showExportButton={false}
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
                            onModelChange={(model) => setProductData(model as RoleDto)}
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