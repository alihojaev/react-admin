'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TextInput,
  Textarea,
  Select,
  Switch,
  FileInput,
  MultiSelect,
  NumberInput,
  Modal,
  Button,
  Group,
  Grid,
  LoadingOverlay,
  Box,
  Text,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconEye, IconLanguage } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

export interface FieldConfig {
  // Basic properties
  type: 'string' | 'number' | 'boolean' | 'array' | 'date' | 'datetime' | 'time' | 'file' | 'textarea' | 'select' | 'multiselect';
  label?: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  
  // Layout properties
  cols?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xl?: number;
  xs?: number;
  
  // Validation
  rules?: ((value: any) => string | null)[];
  
  // Input specific properties
  suffix?: string;
  prefix?: string;
  hint?: string;
  persistentHint?: boolean;
  hideDetails?: boolean;
  persistentPlaceholder?: boolean;
  password?: boolean;
  area?: boolean;
  rows?: number;
  
  // Select specific properties
  items?: Array<{ value: string; label: string }>;
  text?: string;
  value?: string;
  multiple?: boolean;
  clearable?: boolean;
  returnObject?: boolean;
  searchable?: boolean;
  
  // Date specific properties
  time?: boolean;
  
  // HTML5 input types
  inputType?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'date' | 'datetime-local' | 'time' | 'month' | 'week';
  step?: number;
  min?: number;
  max?: number;
  
  // Icons
  prependIcon?: string;
  prependOuterIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  prependInnerIcon?: string;
  
  // Callbacks
  prepend?: () => void;
  prependOuter?: () => void;
  append?: () => void;
  appendOuter?: () => void;
  prependInner?: () => void;
  
  // Language support
  lang?: boolean;
  enKey?: string;
  kgKey?: string;
  
  // File specific
  accept?: string;
  maxSize?: number;
}

export interface CustomFormProps {
  model: Record<string, any>;
  fields: Record<string, FieldConfig>;
  onModelChange: (model: Record<string, any>) => void;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  dense?: boolean;
  variant?: 'default' | 'filled' | 'unstyled';
  colClass?: string;
  hide?: boolean;
  children?: React.ReactNode;
  resetTouched?: boolean; // Новый пропс для сброса состояния touched
  
  // Валидация формы
  onValidationChange?: (isValid: boolean) => void; // Колбэк для изменения валидности
  showValidationInTitle?: boolean; // Показывать ли статус валидации в заголовке
}

export const CustomForm: React.FC<CustomFormProps> = ({
  model,
  fields,
  onModelChange,
  disabled = false,
  readonly = false,
  loading = false,
  dense = true,
  variant = 'default',
  colClass = '',
  hide = false,
  children,
  resetTouched = false,
  onValidationChange,
  showValidationInTitle = false,
}) => {
  const [langDialogs, setLangDialogs] = useState<Record<string, boolean>>({});
  const [fileDialog, setFileDialog] = useState(false);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [syncSearch, setSyncSearch] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const form = useForm({
    initialValues: model,
    validate: {},
  });

  // Initialize language dialogs
  useEffect(() => {
    const langDialogStates: Record<string, boolean> = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value.lang) {
        langDialogStates[key] = false;
      }
      if (value.type === 'array' || value.type === 'select' || value.type === 'multiselect') {
        setSyncSearch(prev => ({ ...prev, [key]: '' }));
      }
    });
    setLangDialogs(langDialogStates);
  }, [fields]);

  // Update form values when model changes
  useEffect(() => {
    form.setValues(model);
  }, [model]);

  // Reset touched fields when resetTouched changes
  useEffect(() => {
    if (resetTouched) {
      setTouchedFields({});
    }
  }, [resetTouched]);

  const setter = useCallback((path: string, value: any) => {
    const topObj = { ...model };
    let obj = topObj;
    const subPaths = path.split('.');
    
    for (let i = 0; i < subPaths.length - 1; i++) {
      const subPath = subPaths[i];
      if (!obj[subPath]) {
        obj[subPath] = {};
      }
      obj = obj[subPath];
    }
    
    obj[subPaths[subPaths.length - 1]] = value;
    onModelChange(topObj);
  }, [model, onModelChange]);

  const handleFieldTouch = useCallback((fieldKey: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldKey]: true }));
  }, []);

  const getter = useCallback((path: string) => {
    let obj = model;
    if (!obj) return undefined;

    for (const subPath of path.split('.')) {
      const subObj = obj[subPath];
      if (subObj === null || subObj === undefined) {
        return undefined;
      }
      obj = subObj;
    }
    return obj;
  }, [model]);

  // Функция валидации всей формы
  const validateForm = useCallback(() => {
    const requiredFields = Object.entries(fields)
      .filter(([_, config]) => config.required)
      .map(([key, _]) => key);

    for (const fieldKey of requiredFields) {
      const fieldConfig = fields[fieldKey];
      const value = getter(fieldKey);
      
      // Проверяем правила валидации
      if (fieldConfig.rules) {
        for (const rule of fieldConfig.rules) {
          const error = rule(value);
          if (error) {
            return false; // Форма невалидна
          }
        }
      }
      
      // Базовая проверка на пустые значения для обязательных полей
      if (value === undefined || value === null) {
        return false;
      }
      
      // Проверка на пустые строки
      if (typeof value === 'string') {
        const stringValue = value as string;
        if (stringValue.trim() === '') {
          return false;
        }
      }
      
      // Проверка на пустые массивы
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
    }
    
    return true; // Форма валидна
  }, [fields, getter]);

  // Проверяем валидность формы при изменении модели или полей
  useEffect(() => {
    const isValid = validateForm();
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [model, fields, validateForm, onValidationChange]);

  const callCallback = useCallback((callback?: () => void) => {
    callback?.();
  }, []);

  const openFilePreview = useCallback((file: any) => {
    setFileInfo(file);
    setFileDialog(true);
  }, []);

  const closeFileDialog = useCallback(() => {
    setFileDialog(false);
    setFileInfo(null);
  }, []);

  const renderField = (key: string, value: FieldConfig) => {
    if (value.hidden) return null;

    // Показываем ошибки только для "тронутых" полей
    const isFieldTouched = touchedFields[key];
    const fieldError = isFieldTouched && value.rules?.map(rule => rule(getter(key))).find(error => error);

    const commonProps = {
      label: value.label || key,
      placeholder: value.placeholder,
      disabled: value.disabled || disabled,
      readOnly: value.readonly || readonly,
      variant,
      size: dense ? 'sm' : 'md',
      withAsterisk: value.required,
      error: fieldError || undefined,
    };

    // Title
    const titleElement = value.title && (
      <Text size="sm" c="dimmed" mb={5}>
        {value.title}
      </Text>
    );

    // Language button
    const languageButton = value.lang && (
      <Tooltip label="Многоязычность">
        <ActionIcon
          variant="light"
          size="sm"
          onClick={() => setLangDialogs(prev => ({ ...prev, [key]: true }))}
        >
          <IconLanguage size={16} />
        </ActionIcon>
      </Tooltip>
    );

    // File preview button
    const filePreviewButton = value.type === 'file' && getter(key)?.id && (
      <Tooltip label="Предварительный просмотр">
        <ActionIcon
          variant="light"
          size="sm"
          onClick={() => openFilePreview(getter(key))}
        >
          <IconEye size={16} />
        </ActionIcon>
      </Tooltip>
    );

    switch (value.type) {
      case 'string':
        if (value.area) {
          return (
            <Box key={key}>
              {titleElement}
              <Group gap="xs" align="flex-end">
                <Textarea
                  {...commonProps}
                  value={String(getter(key) || '')}
                  onChange={(event) => setter(key, event.currentTarget.value)}
                  rows={value.rows || 5}
                  style={{ flex: 1 }}
                />
                {languageButton}
              </Group>
            </Box>
          );
        }
        
        // Определяем HTML5 тип на основе названия поля и настроек
        let inputType: string = value.inputType || 'text';
        if (value.password) {
          inputType = 'password';
        } else if (!value.inputType) {
          // Автоопределение типа на основе названия поля
          const fieldName = key.toLowerCase();
          if (fieldName.includes('email')) {
            inputType = 'email';
          } else if (fieldName.includes('phone') || fieldName.includes('tel')) {
            inputType = 'tel';
          } else if (fieldName.includes('url') || fieldName.includes('link')) {
            inputType = 'url';
          }
        }
        
        return (
          <Box key={key}>
            {titleElement}
            <Group gap="xs" align="flex-end">
              <TextInput
                {...commonProps}
                type={inputType}
                value={String(getter(key) || '')}
                onChange={(event) => setter(key, event.currentTarget.value)}
                onBlur={() => handleFieldTouch(key)}
                rightSection={languageButton}
                style={{ flex: 1 }}
              />
            </Group>
          </Box>
        );

      case 'number':
        const numberValue = getter(key);
        
        // Проверяем, является ли поле денежной суммой
        const fieldName = key.toLowerCase();
        const isMoneyField = fieldName.includes('price') || fieldName.includes('cost') || fieldName.includes('amount') || fieldName.includes('sum');
        
        // Всегда используем NumberInput для числовых полей, так как он предоставляет стрелки
        return (
          <Box key={key}>
            {titleElement}
            <NumberInput
              {...commonProps}
              value={typeof numberValue === 'number' ? numberValue : undefined}
              onChange={(val) => setter(key, val)}
              onBlur={() => handleFieldTouch(key)}
              min={value.min}
              max={value.max}
              step={value.step || (isMoneyField ? 0.01 : 1)}
              rightSection={languageButton}
            />
          </Box>
        );

      case 'boolean':
        return (
          <Box key={key}>
            {titleElement}
            <Switch
              {...commonProps}
              checked={Boolean(getter(key))}
              onChange={(event) => {
                setter(key, event.currentTarget.checked);
                handleFieldTouch(key);
              }}
            />
          </Box>
        );

      case 'select':
        return (
          <Box key={key}>
            {titleElement}
            <Select
              {...commonProps}
              data={value.items || []}
              value={String(getter(key) || '')}
              onChange={(val) => {
                setter(key, val);
                handleFieldTouch(key);
              }}
              searchable={value.searchable}
              clearable={value.clearable !== false}
              rightSection={languageButton}
            />
          </Box>
        );

      case 'multiselect':
        return (
          <Box key={key}>
            {titleElement}
            <MultiSelect
              {...commonProps}
              data={(value.items || []).filter(item => item && item.value && item.label)}
              value={(() => {
                try {
                  const currentValue = getter(key);
                  if (!currentValue) return [];
                  if (Array.isArray(currentValue)) {
                    // Для authRoles, извлекаем ID из объектов ролей
                    if (key === 'authRoles') {
                      return currentValue.map(role => {
                        if (typeof role === 'object' && role.id) {
                          return String(role.id);
                        }
                        return String(role);
                      }).filter(Boolean);
                    }
                    return currentValue.map(v => String(v)).filter(Boolean);
                  }
                  return [];
                } catch (error) {
                  console.error('Error processing MultiSelect value:', error);
                  return [];
                }
              })()}
              onChange={(val) => {
                try {
                  // Для multiselect с ролями, преобразуем строки обратно в объекты
                  if (key === 'authRoles' && Array.isArray(val)) {
                    const roleObjects = val.map(roleId => {
                      // Находим роль по ID
                      const role = value.items?.find(item => item.value === roleId);
                      return role ? { id: role.value, name: role.label } : { id: roleId };
                    });
                    setter(key, roleObjects);
                  } else {
                    setter(key, val);
                  }
                  handleFieldTouch(key);
                } catch (error) {
                  console.error('Error processing MultiSelect onChange:', error);
                }
              }}
              searchable={value.searchable}
              clearable={value.clearable !== false}
              rightSection={languageButton}
            />
          </Box>
          );

      case 'date':
        return (
          <Box key={key}>
            {titleElement}
            <TextInput
              {...commonProps}
              type="date"
              value={getter(key) ? String(getter(key)).split('T')[0] : ''}
              onChange={(event) => setter(key, event.currentTarget.value)}
              onBlur={() => handleFieldTouch(key)}
              rightSection={languageButton}
            />
          </Box>
        );

      case 'datetime':
        return (
          <Box key={key}>
            {titleElement}
            <TextInput
              {...commonProps}
              type="datetime-local"
              value={(() => {
                const value = getter(key);
                if (!value) return '';
                
                // Преобразуем значение в правильный формат для HTML5 input
                const dateTimeStr = String(value);
                // Если значение уже в формате YYYY-MM-DD HH:mm, преобразуем в YYYY-MM-DDTHH:mm
                if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateTimeStr)) {
                  return dateTimeStr.replace(' ', 'T');
                }
                // Если значение в другом формате, пытаемся его исправить
                return dateTimeStr.replace(/[.\s,]/g, (match) => {
                  if (match === '.') return '-';
                  if (match === ',') return ' ';
                  return match;
                }).replace(' ', 'T');
              })()}
              onChange={(event) => {
                const value = event.currentTarget.value;
                // Преобразуем формат даты и времени для API (заменяем T на пробел)
                const formattedValue = value ? value.replace('T', ' ') : value;
                setter(key, formattedValue);
              }}
              onBlur={() => handleFieldTouch(key)}
              rightSection={languageButton}
            />
          </Box>
        );

      case 'time':
        return (
          <Box key={key}>
            {titleElement}
            <TextInput
              {...commonProps}
              type="time"
              value={getter(key) ? String(getter(key)) : ''}
              onChange={(event) => setter(key, event.currentTarget.value)}
              onBlur={() => handleFieldTouch(key)}
              rightSection={languageButton}
            />
          </Box>
        );

      case 'file':
        return (
          <Box key={key}>
            {titleElement}
            <Group gap="xs" align="flex-end">
              <FileInput
                {...commonProps}
                value={getter(key) as File | null}
                onChange={(val) => {
                  setter(key, val);
                  handleFieldTouch(key);
                }}
                accept={value.accept}
                style={{ flex: 1 }}
              />
              {filePreviewButton}
            </Group>
          </Box>
        );

      case 'textarea':
        return (
          <Box key={key}>
            {titleElement}
            <Group gap="xs" align="flex-end">
              <Textarea
                {...commonProps}
                value={String(getter(key) || '')}
                onChange={(event) => setter(key, event.currentTarget.value)}
                onBlur={() => handleFieldTouch(key)}
                rows={value.rows || 5}
                style={{ flex: 1 }}
              />
              {languageButton}
            </Group>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderLanguageDialog = (key: string, value: FieldConfig) => {
    if (!value.lang || !value.enKey || !value.kgKey) return null;

    return (
      <Modal
        opened={langDialogs[key] || false}
        onClose={() => setLangDialogs(prev => ({ ...prev, [key]: false }))}
        title="Многоязычность"
        size="md"
      >
        <Box>
          <TextInput
            label="Английский"
            value={String(getter(value.enKey) || '')}
            onChange={(event) => setter(value.enKey!, event.currentTarget.value)}
            mb="md"
          />
          <TextInput
            label="Кыргызский"
            value={String(getter(value.kgKey) || '')}
            onChange={(event) => setter(value.kgKey!, event.currentTarget.value)}
            mb="lg"
          />
          <Group justify="center">
            <Button
              variant="light"
              color="red"
              onClick={() => setLangDialogs(prev => ({ ...prev, [key]: false }))}
            >
              Закрыть
            </Button>
          </Group>
        </Box>
      </Modal>
    );
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />
      
      {/* File Preview Dialog */}
      <Modal
        opened={fileDialog}
        onClose={closeFileDialog}
        title="Предварительный просмотр файла"
        size="lg"
      >
        {fileInfo && (
          <Box>
            <img
              src={`http://localhost:8081/public/file/${fileInfo.id}`}
              alt="Preview"
              style={{ maxHeight: '600px', width: '100%', objectFit: 'contain' }}
            />
            <Group justify="center" mt="md">
              <Button variant="light" onClick={closeFileDialog}>
                Закрыть
              </Button>
            </Group>
          </Box>
        )}
      </Modal>

      {/* Language Dialogs */}
      {Object.entries(fields).map(([key, value]) => renderLanguageDialog(key, value))}

      {/* Form Fields */}
      <Grid gutter={dense ? 'xs' : 'md'}>
        {Object.entries(fields).map(([key, value]) => {
          if (value.hidden) return null;

          const cols = value.cols || 12;
          const lg = value.lg;
          const md = value.md;
          const sm = value.sm;
          const xl = value.xl;
          const xs = value.xs;

          return (
            <Grid.Col
              key={key}
              span={cols}
              className={colClass}
            >
              {renderField(key, value)}
            </Grid.Col>
          );
        })}
        
        {/* Action slot */}
        {children && (
          <Grid.Col span={12}>
            {children}
          </Grid.Col>
        )}
      </Grid>
    </Box>
  );
}; 