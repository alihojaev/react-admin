# CustomForm Component

Универсальный компонент формы с поддержкой различных типов полей, валидации и многоязычности.

## Основные возможности

- ✅ **Множественные типы полей** - текст, числа, даты, файлы, селекты и др.
- ✅ **Автоматическая валидация** - встроенная логика валидации на основе правил
- ✅ **Состояние "touched"** - ошибки показываются только после взаимодействия с полем
- ✅ **HTML5 типы** - автоматическое определение типов полей
- ✅ **Многоязычность** - поддержка мультиязычных полей
- ✅ **Адаптивная сетка** - гибкая система колонок
- ✅ **Настраиваемый UI** - различные варианты отображения

## Интерфейс

### CustomFormProps

```typescript
interface CustomFormProps {
  model: Record<string, any>;                    // Модель данных
  fields: Record<string, FieldConfig>;          // Конфигурация полей
  onModelChange: (model: Record<string, any>) => void; // Колбэк изменения модели
  disabled?: boolean;                           // Отключить всю форму
  readonly?: boolean;                           // Только для чтения
  loading?: boolean;                            // Состояние загрузки
  dense?: boolean;                              // Компактный режим
  variant?: 'default' | 'filled' | 'unstyled';  // Вариант отображения
  colClass?: string;                            // CSS класс для колонок
  hide?: boolean;                               // Скрыть форму
  children?: React.ReactNode;                   // Дочерние элементы
  resetTouched?: boolean;                       // Сброс состояния touched
  onValidationChange?: (isValid: boolean) => void; // Колбэк валидации
  showValidationInTitle?: boolean;              // Показывать статус в заголовке
}
```

### FieldConfig

```typescript
interface FieldConfig {
  // Основные свойства
  type: 'string' | 'number' | 'boolean' | 'array' | 'date' | 'datetime' | 'time' | 'file' | 'textarea' | 'select' | 'multiselect';
  label?: string;                               // Подпись поля
  title?: string;                               // Заголовок секции
  placeholder?: string;                         // Плейсхолдер
  required?: boolean;                           // Обязательное поле
  disabled?: boolean;                           // Отключено
  readonly?: boolean;                           // Только для чтения
  hidden?: boolean;                             // Скрыто
  
  // Макет
  cols?: number;                                // Количество колонок (1-12)
  lg?: number;                                  // Колонки для больших экранов
  md?: number;                                  // Колонки для средних экранов
  sm?: number;                                  // Колонки для маленьких экранов
  xl?: number;                                  // Колонки для очень больших экранов
  xs?: number;                                  // Колонки для очень маленьких экранов
  
  // Валидация
  rules?: ((value: any) => string | null)[];    // Правила валидации
  
  // Специфичные свойства
  suffix?: string;                              // Суффикс
  prefix?: string;                              // Префикс
  hint?: string;                                // Подсказка
  persistentHint?: boolean;                     // Постоянная подсказка
  hideDetails?: boolean;                        // Скрыть детали
  persistentPlaceholder?: boolean;              // Постоянный плейсхолдер
  password?: boolean;                           // Пароль
  area?: boolean;                               // Текстовая область
  rows?: number;                                // Количество строк
  
  // Select свойства
  items?: Array<{ value: string; label: string }>; // Элементы для выбора
  text?: string;                                // Текст
  value?: string;                               // Значение
  multiple?: boolean;                           // Множественный выбор
  clearable?: boolean;                          // Можно очистить
  returnObject?: boolean;                       // Возвращать объект
  searchable?: boolean;                         // Поиск
  
  // Дата свойства
  time?: boolean;                               // Включать время
  
  // HTML5 типы
  inputType?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'date' | 'datetime-local' | 'time' | 'month' | 'week';
  step?: number;                                // Шаг для чисел
  min?: number;                                 // Минимальное значение
  max?: number;                                 // Максимальное значение
  
  // Иконки
  prependIcon?: string;                         // Иконка в начале
  prependOuterIcon?: string;                    // Внешняя иконка в начале
  appendIcon?: string;                          // Иконка в конце
  appendOuterIcon?: string;                     // Внешняя иконка в конце
  prependInnerIcon?: string;                    // Внутренняя иконка в начале
  
  // Колбэки
  prepend?: () => void;                         // Колбэк в начале
  prependOuter?: () => void;                    // Внешний колбэк в начале
  append?: () => void;                          // Колбэк в конце
  appendOuter?: () => void;                     // Внешний колбэк в конце
  prependInner?: () => void;                    // Внутренний колбэк в начале
  
  // Многоязычность
  lang?: boolean;                               // Многоязычное поле
  enKey?: string;                               // Ключ для английского
  kgKey?: string;                               // Ключ для кыргызского
  
  // Файл свойства
  accept?: string;                              // Принимаемые типы файлов
  maxSize?: number;                             // Максимальный размер
}
```

## Валидация

### Встроенная логика валидации

Компонент автоматически валидирует форму на основе:

1. **Обязательные поля** - проверяет поля с `required: true`
2. **Правила валидации** - выполняет переданные функции `rules`
3. **Типы данных** - проверяет корректность форматов

### Правила валидации

```typescript
const fields = {
  email: {
    type: 'string',
    label: 'Email',
    required: true,
    rules: [
      (value) => (!value || value.trim() === '') ? 'Email обязателен' : null,
      (value) => (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? 'Неверный формат email' : null,
    ],
  },
  age: {
    type: 'number',
    label: 'Возраст',
    required: true,
    min: 0,
    max: 120,
    rules: [
      (value) => (value === undefined || value === null) ? 'Возраст обязателен' : null,
      (value) => (typeof value === 'number' && value < 0) ? 'Возраст должен быть положительным' : null,
      (value) => (typeof value === 'number' && value > 120) ? 'Возраст не может быть больше 120' : null,
    ],
  },
  birthDate: {
    type: 'date',
    label: 'Дата рождения',
    required: true,
    rules: [
      (value) => (!value) ? 'Дата рождения обязательна' : null,
      (value) => (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) ? 'Неверный формат даты' : null,
    ],
  },
};
```

### Состояние "touched"

Ошибки валидации показываются только после взаимодействия с полем:

- **onBlur** - для текстовых, числовых и дата полей
- **onChange** - для select, switch и файловых полей

### Колбэк валидации

```typescript
<CustomForm
  model={data}
  fields={fields}
  onModelChange={setData}
  onValidationChange={(isValid) => {
    console.log('Форма валидна:', isValid);
    setIsFormValid(isValid);
  }}
/>
```

## Типы полей

### Строковые поля

```typescript
// Обычный текст
{
  type: 'string',
  label: 'Имя',
  placeholder: 'Введите имя',
  required: true,
}

// Email (автоопределение)
{
  type: 'string',
  label: 'Email',
  placeholder: 'example@email.com',
  required: true,
}

// Пароль
{
  type: 'string',
  label: 'Пароль',
  password: true,
  required: true,
}

// Текстовая область
{
  type: 'string',
  label: 'Описание',
  area: true,
  rows: 5,
  required: true,
}
```

### Числовые поля

```typescript
// Целое число
{
  type: 'number',
  label: 'Количество',
  placeholder: 'Введите количество',
  step: 1,
  min: 0,
  required: true,
}

// Денежная сумма
{
  type: 'number',
  label: 'Цена',
  placeholder: '0.00',
  step: 0.01,
  min: 0,
  required: true,
}
```

### Поля даты и времени

```typescript
// Дата
{
  type: 'date',
  label: 'Дата рождения',
  required: true,
}

// Дата и время
{
  type: 'datetime',
  label: 'Дата и время',
  required: true,
}

// Время
{
  type: 'time',
  label: 'Время начала',
  required: true,
}
```

### Select поля

```typescript
// Одиночный выбор
{
  type: 'select',
  label: 'Категория',
  items: [
    { value: 'electronics', label: 'Электроника' },
    { value: 'clothing', label: 'Одежда' },
    { value: 'books', label: 'Книги' },
  ],
  searchable: true,
  clearable: true,
  required: true,
}

// Множественный выбор
{
  type: 'multiselect',
  label: 'Теги',
  items: [
    { value: 'new', label: 'Новинка' },
    { value: 'sale', label: 'Распродажа' },
    { value: 'popular', label: 'Популярное' },
  ],
  searchable: true,
  clearable: true,
}
```

### Boolean поля

```typescript
{
  type: 'boolean',
  label: 'Активен',
  required: true,
}
```

### Файловые поля

```typescript
{
  type: 'file',
  label: 'Изображение',
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024, // 5MB
  required: true,
}
```

## HTML5 типы

Компонент автоматически определяет HTML5 тип на основе названия поля:

- `email` - поля с "email" в названии
- `tel` - поля с "phone" или "tel" в названии  
- `url` - поля с "url" или "link" в названии
- `password` - поля с `password: true`

Также можно явно указать тип:

```typescript
{
  type: 'string',
  label: 'Телефон',
  inputType: 'tel',
  placeholder: '+7 (999) 123-45-67',
  required: true,
}
```

## Многоязычность

```typescript
{
  type: 'string',
  label: 'Название',
  lang: true,
  enKey: 'nameEn',
  kgKey: 'nameKg',
  required: true,
}
```

## Макет

### Базовые колонки

```typescript
{
  type: 'string',
  label: 'Имя',
  cols: 6, // Занимает 6 из 12 колонок
}

{
  type: 'string', 
  label: 'Фамилия',
  cols: 6, // Занимает 6 из 12 колонок
}
```

### Адаптивные колонки

```typescript
{
  type: 'string',
  label: 'Описание',
  cols: 12,    // По умолчанию
  lg: 8,       // На больших экранах - 8 колонок
  md: 10,      // На средних экранах - 10 колонок
  sm: 12,      // На маленьких экранах - 12 колонок
}
```

## Пример использования

```tsx
import { CustomForm, FieldConfig } from '@/components/forms';

const fields: Record<string, FieldConfig> = {
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
  email: {
    type: 'string',
    label: 'Email',
    placeholder: 'example@email.com',
    required: true,
    cols: 6,
    rules: [
      (value) => (!value || value.trim() === '') ? 'Email обязателен' : null,
      (value) => (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? 'Неверный формат email' : null,
    ],
  },
  phone: {
    type: 'string',
    label: 'Телефон',
    placeholder: '+7 (999) 123-45-67',
    required: true,
    cols: 6,
    rules: [
      (value) => (!value || value.trim() === '') ? 'Телефон обязателен' : null,
    ],
  },
  age: {
    type: 'number',
    label: 'Возраст',
    placeholder: 'Введите возраст',
    required: true,
    cols: 6,
    min: 0,
    max: 120,
    rules: [
      (value) => (value === undefined || value === null) ? 'Возраст обязателен' : null,
      (value) => (typeof value === 'number' && value < 0) ? 'Возраст должен быть положительным' : null,
    ],
  },
  birthDate: {
    type: 'date',
    label: 'Дата рождения',
    required: true,
    cols: 6,
    rules: [
      (value) => (!value) ? 'Дата рождения обязательна' : null,
    ],
  },
  description: {
    type: 'string',
    label: 'Описание',
    placeholder: 'Введите описание',
    area: true,
    rows: 4,
    cols: 12,
  },
  category: {
    type: 'select',
    label: 'Категория',
    items: [
      { value: 'electronics', label: 'Электроника' },
      { value: 'clothing', label: 'Одежда' },
      { value: 'books', label: 'Книги' },
    ],
    searchable: true,
    clearable: true,
    required: true,
    cols: 6,
  },
  isActive: {
    type: 'boolean',
    label: 'Активен',
    cols: 6,
  },
};

function MyForm() {
  const [data, setData] = useState({});
  const [isValid, setIsValid] = useState(false);

  return (
    <CustomForm
      model={data}
      fields={fields}
      onModelChange={setData}
      onValidationChange={setIsValid}
      dense={true}
    >
      <Group justify="flex-end" mt="md">
        <Button variant="subtle">Отмена</Button>
        <Button 
          onClick={() => console.log('Сохранение:', data)}
          disabled={!isValid}
        >
          Сохранить
        </Button>
      </Group>
    </CustomForm>
  );
}
```

## Особенности

### Автоматическая валидация

- ✅ Проверка обязательных полей
- ✅ Выполнение пользовательских правил
- ✅ Валидация форматов данных
- ✅ Состояние "touched" для UX

### Производительность

- ✅ Мемоизация функций с `useCallback`
- ✅ Оптимизированные перерендеры
- ✅ Ленивая валидация

### Доступность

- ✅ Поддержка клавиатурной навигации
- ✅ ARIA атрибуты
- ✅ Семантическая разметка

### Расширяемость

- ✅ Легко добавлять новые типы полей
- ✅ Гибкая система правил валидации
- ✅ Настраиваемый UI 