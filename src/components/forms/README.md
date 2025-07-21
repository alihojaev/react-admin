# CustomForm Component

Универсальный компонент форм для React с Mantine UI, адаптированный из Vue компонента.

## Возможности

- ✅ Поддержка различных типов полей (string, number, boolean, select, multiselect, date, datetime, file, textarea)
- ✅ Многоязычность (русский, английский, кыргызский)
- ✅ Валидация полей
- ✅ Адаптивная сетка (Grid)
- ✅ Поддержка вложенных объектов (dot notation)
- ✅ Предварительный просмотр файлов
- ✅ Загрузка и состояния
- ✅ Кастомные иконки и действия
- ✅ Гибкая настройка внешнего вида

## Установка

```bash
# Компонент уже включен в проект
import { CustomForm, FieldConfig } from '@/components/forms';
```

## Базовое использование

```tsx
import React, { useState } from 'react';
import { CustomForm, FieldConfig } from '@/components/forms';

const MyComponent = () => {
  const [model, setModel] = useState({
    name: '',
    email: '',
    age: 0,
  });

  const fields: Record<string, FieldConfig> = {
    name: {
      type: 'string',
      label: 'Имя',
      required: true,
      cols: 6,
    },
    email: {
      type: 'string',
      label: 'Email',
      required: true,
      cols: 6,
    },
    age: {
      type: 'number',
      label: 'Возраст',
      cols: 12,
    },
  };

  return (
    <CustomForm
      model={model}
      fields={fields}
      onModelChange={setModel}
    />
  );
};
```

## Типы полей

### String
```tsx
{
  type: 'string',
  label: 'Текстовое поле',
  placeholder: 'Введите текст',
  password: false, // для паролей
  area: false, // для textarea
  rows: 5, // количество строк для textarea
}
```

### Number
```tsx
{
  type: 'number',
  label: 'Числовое поле',
  placeholder: '0',
  suffix: '₽', // суффикс
  prefix: '$', // префикс
}
```

### Boolean
```tsx
{
  type: 'boolean',
  label: 'Чекбокс',
}
```

### Select
```tsx
{
  type: 'select',
  label: 'Выбор',
  items: [
    { value: 'option1', label: 'Опция 1' },
    { value: 'option2', label: 'Опция 2' },
  ],
  searchable: true,
  clearable: true,
}
```

### MultiSelect
```tsx
{
  type: 'multiselect',
  label: 'Множественный выбор',
  items: [
    { value: 'tag1', label: 'Тег 1' },
    { value: 'tag2', label: 'Тег 2' },
  ],
  searchable: true,
  clearable: true,
}
```

### Date
```tsx
{
  type: 'date',
  label: 'Дата',
}
```

### DateTime
```tsx
{
  type: 'datetime',
  label: 'Дата и время',
}
```

### File
```tsx
{
  type: 'file',
  label: 'Файл',
  accept: 'image/*', // типы файлов
  maxSize: 5242880, // максимальный размер (5MB)
}
```

### Textarea
```tsx
{
  type: 'textarea',
  label: 'Многострочный текст',
  rows: 4,
}
```

## Многоязычность

Для полей с поддержкой многоязычности:

```tsx
{
  type: 'string',
  label: 'Название',
  lang: true,
  enKey: 'nameEn', // ключ для английского
  kgKey: 'nameKg', // ключ для кыргызского
}
```

## Валидация

```tsx
{
  type: 'string',
  label: 'Email',
  required: true,
  rules: [
    (value) => (!value || value.length < 3) ? 'Минимум 3 символа' : null,
    (value) => (!value || !value.includes('@')) ? 'Некорректный email' : null,
  ],
}
```

## Layout

```tsx
{
  type: 'string',
  label: 'Поле',
  cols: 6, // количество колонок (1-12)
  lg: 4, // для больших экранов
  md: 6, // для средних экранов
  sm: 12, // для маленьких экранов
}
```

## Props

### CustomFormProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `Record<string, any>` | - | Модель данных формы |
| `fields` | `Record<string, FieldConfig>` | - | Конфигурация полей |
| `onModelChange` | `(model: Record<string, any>) => void` | - | Callback при изменении модели |
| `disabled` | `boolean` | `false` | Отключить всю форму |
| `readonly` | `boolean` | `false` | Только для чтения |
| `loading` | `boolean` | `false` | Показать индикатор загрузки |
| `dense` | `boolean` | `true` | Компактный вид |
| `variant` | `'default' \| 'filled' \| 'unstyled'` | `'default'` | Вариант стиля |
| `colClass` | `string` | `''` | CSS класс для колонок |
| `hide` | `boolean` | `false` | Скрыть форму |
| `children` | `React.ReactNode` | - | Дополнительный контент (кнопки и т.д.) |

### FieldConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `FieldType` | - | Тип поля |
| `label` | `string` | - | Подпись поля |
| `title` | `string` | - | Заголовок над полем |
| `placeholder` | `string` | - | Плейсхолдер |
| `required` | `boolean` | `false` | Обязательное поле |
| `disabled` | `boolean` | `false` | Отключить поле |
| `readonly` | `boolean` | `false` | Только для чтения |
| `hidden` | `boolean` | `false` | Скрыть поле |
| `cols` | `number` | `12` | Количество колонок |
| `rules` | `ValidationRule[]` | `[]` | Правила валидации |
| `lang` | `boolean` | `false` | Поддержка многоязычности |
| `enKey` | `string` | - | Ключ для английского |
| `kgKey` | `string` | - | Ключ для кыргызского |

## Примеры

### Простая форма
```tsx
const fields = {
  name: {
    type: 'string',
    label: 'Имя',
    required: true,
    cols: 6,
  },
  email: {
    type: 'string',
    label: 'Email',
    required: true,
    cols: 6,
  },
};
```

### Форма с многоязычностью
```tsx
const fields = {
  title: {
    type: 'string',
    label: 'Заголовок',
    lang: true,
    enKey: 'titleEn',
    kgKey: 'titleKg',
    cols: 12,
  },
};
```

### Форма с валидацией
```tsx
const fields = {
  email: {
    type: 'string',
    label: 'Email',
    required: true,
    rules: [
      (value) => (!value || !value.includes('@')) ? 'Некорректный email' : null,
    ],
  },
  age: {
    type: 'number',
    label: 'Возраст',
    rules: [
      (value) => (value && value < 0) ? 'Возраст не может быть отрицательным' : null,
      (value) => (value && value > 150) ? 'Некорректный возраст' : null,
    ],
  },
};
```

### Форма с файлами
```tsx
const fields = {
  avatar: {
    type: 'file',
    label: 'Аватар',
    accept: 'image/*',
    maxSize: 5242880, // 5MB
  },
};
```

## Особенности

1. **Вложенные объекты**: Поддерживается dot notation для доступа к вложенным свойствам
2. **Автоматическая валидация**: Правила валидации выполняются при изменении полей
3. **Адаптивность**: Автоматическая адаптация под размер экрана
4. **Доступность**: Поддержка ARIA атрибутов и клавиатурной навигации
5. **Производительность**: Оптимизирован для больших форм

## Миграция с Vue

Основные отличия от Vue версии:

1. Используется `onModelChange` вместо `@update:model`
2. Типы полей указаны как строки вместо конструкторов
3. Валидация через функции вместо массивов строк
4. Используется Mantine UI вместо Vuetify
5. Поддержка TypeScript из коробки 