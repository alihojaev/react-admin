'use client';

import React, { useState } from 'react';
import { Button, Paper, Title } from '@mantine/core';
import { CustomForm, FieldConfig } from './CustomForm';

export const FormExample: React.FC = () => {
  const [item, setItem] = useState({
    nameRu: 'Название на русском',
    nameEn: 'Name in English',
    nameKg: 'Кыргызча аталыш',
    description: 'Описание категории',
    price: 100,
    isActive: true,
    category: 'electronics',
    tags: ['tag1', 'tag2'],
    image: null,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01T10:00',
  });

  const fieldName: Record<string, FieldConfig> = {
    nameRu: {
      type: 'string',
      cols: 12,
      label: 'Название категории',
      hideDetails: true,
      lang: true,
      enKey: 'nameEn',
      kgKey: 'nameKg',
      required: true,
      rules: [(value) => (!value || value.length < 3) ? 'Минимум 3 символа' : null],
    },
    description: {
      type: 'textarea',
      cols: 12,
      label: 'Описание',
      rows: 4,
      placeholder: 'Введите описание...',
    },
    price: {
      type: 'number',
      cols: 6,
      label: 'Цена',
      placeholder: '0',
      suffix: '₽',
      rules: [(value) => (value && value < 0) ? 'Цена не может быть отрицательной' : null],
    },
    isActive: {
      type: 'boolean',
      cols: 6,
      label: 'Активна',
    },
    category: {
      type: 'select',
      cols: 6,
      label: 'Категория',
      items: [
        { value: 'electronics', label: 'Электроника' },
        { value: 'clothing', label: 'Одежда' },
        { value: 'books', label: 'Книги' },
      ],
      searchable: true,
      clearable: true,
    },
    tags: {
      type: 'multiselect',
      cols: 6,
      label: 'Теги',
      items: [
        { value: 'tag1', label: 'Тег 1' },
        { value: 'tag2', label: 'Тег 2' },
        { value: 'tag3', label: 'Тег 3' },
      ],
      searchable: true,
      clearable: true,
    },
    image: {
      type: 'file',
      cols: 12,
      label: 'Изображение',
      accept: 'image/*',
    },
    createdAt: {
      type: 'date',
      cols: 6,
      label: 'Дата создания',
    },
    updatedAt: {
      type: 'datetime',
      cols: 6,
      label: 'Дата обновления',
    },
  };

  const handleSubmit = () => {
    console.log('Form data:', item);
  };

  return (
    <Paper p="md" withBorder>
      <Title order={3} mb="md">
        Пример использования CustomForm
      </Title>
      
      <CustomForm
        model={item}
        fields={fieldName}
        onModelChange={(model) => setItem(model as typeof item)}
        dense={true}
      >
        <Button onClick={handleSubmit} fullWidth>
          Сохранить
        </Button>
      </CustomForm>
      
      <Paper p="xs" mt="md" withBorder>
        <Title order={4} mb="xs">Текущие данные:</Title>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(item, null, 2)}
        </pre>
      </Paper>
    </Paper>
  );
}; 