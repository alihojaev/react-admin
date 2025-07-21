# ExampleModel

Модель данных для демонстрации работы HTML5 типов полей в `CustomForm` и `FilterModal`.

## Структура модели

```typescript
interface ExampleModel {
  id?: string;
  text: string;
  name: string;
  description: string;
  number: number;
  amount: number;
  date: string; // LocalDate в формате YYYY-MM-DD
  dateTime: string; // LocalDateTime в формате YYYY-MM-DDTHH:mm:ss
  time: string; // LocalTime в формате HH:mm:ss
}
```

## Поля модели

### 📝 String поля

#### `text: string`
- **Java тип**: `String`
- **HTML5 тип**: `text`
- **Описание**: Простое текстовое поле
- **Валидация**: Стандартная валидация текста

#### `name: string`
- **Java тип**: `String`
- **HTML5 тип**: `text`
- **Описание**: Название записи
- **Валидация**: Стандартная валидация текста

#### `description: string`
- **Java тип**: `String`
- **HTML5 тип**: `text`
- **Описание**: Описание записи
- **Валидация**: Стандартная валидация текста

### 🔢 Number поля

#### `number: number`
- **Java тип**: `Long`
- **HTML5 тип**: `number`
- **Описание**: Целое число
- **Валидация**: Числовая валидация, минимальное значение 0
- **Ограничения**: `min: 0`

#### `amount: number`
- **Java тип**: `BigDecimal`
- **HTML5 тип**: `number`
- **Описание**: Денежная сумма
- **Валидация**: Числовая валидация с двумя знаками после запятой
- **Ограничения**: `min: 0`, `step: 0.01`

### 📅 Date поля

#### `date: string`
- **Java тип**: `LocalDate`
- **HTML5 тип**: `date`
- **Формат**: `YYYY-MM-DD`
- **Описание**: Дата
- **Валидация**: Встроенная валидация даты браузера
- **Компонент**: Встроенный календарь

#### `dateTime: string`
- **Java тип**: `LocalDateTime`
- **HTML5 тип**: `datetime-local`
- **Формат**: `YYYY-MM-DDTHH:mm`
- **Описание**: Дата и время
- **Валидация**: Встроенная валидация даты и времени браузера
- **Компонент**: Встроенные элементы выбора даты и времени

#### `time: string`
- **Java тип**: `LocalTime`
- **HTML5 тип**: `time`
- **Формат**: `HH:mm`
- **Описание**: Время
- **Валидация**: Встроенная валидация времени браузера
- **Компонент**: Встроенный элемент выбора времени

## Конфигурация полей в CustomForm

```typescript
const productFields: Record<string, FieldConfig> = {
  text: {
    type: 'string',
    label: 'Текст',
    placeholder: 'Введите текст',
    required: true,
    cols: 12,
  },
  name: {
    type: 'string',
    label: 'Название',
    placeholder: 'Введите название',
    required: true,
    cols: 6,
  },
  description: {
    type: 'string',
    label: 'Описание',
    placeholder: 'Введите описание',
    required: true,
    cols: 6,
  },
  number: {
    type: 'number',
    label: 'Число',
    placeholder: 'Введите число',
    required: true,
    cols: 6,
    min: 0,
  },
  amount: {
    type: 'number',
    label: 'Сумма',
    placeholder: 'Введите сумму',
    required: true,
    cols: 6,
    step: 0.01,
    min: 0,
  },
  date: {
    type: 'date',
    label: 'Дата',
    required: true,
    cols: 6,
  },
  dateTime: {
    type: 'datetime',
    label: 'Дата и время',
    required: true,
    cols: 6,
  },
  time: {
    type: 'time',
    label: 'Время',
    required: true,
    cols: 6,
  },
};
```

## Маппинг Java типов

### Java → TypeScript
```typescript
export const JAVA_TO_TS_TYPES = {
  'String': 'string',
  'Long': 'number',
  'BigDecimal': 'number',
  'LocalDate': 'date',
  'LocalDateTime': 'datetime',
  'LocalTime': 'time',
} as const;
```

### Java → HTML5 типы
```typescript
export const JAVA_TO_HTML5_TYPES = {
  'String': 'text',
  'Long': 'number',
  'BigDecimal': 'number',
  'LocalDate': 'date',
  'LocalDateTime': 'datetime-local',
  'LocalTime': 'time',
} as const;
```

## Пример использования

### Инициализация модели
```typescript
const [model, setModel] = useState<ExampleModel>({
  text: '',
  name: '',
  description: '',
  number: 0,
  amount: 0,
  date: '',
  dateTime: '',
  time: '',
});
```

### Обработка изменений
```typescript
<CustomForm
  model={model}
  fields={productFields}
  onModelChange={setModel}
  dense={true}
/>
```

### Сброс формы
```typescript
const resetForm = () => {
  setModel({
    text: '',
    name: '',
    description: '',
    number: 0,
    amount: 0,
    date: '',
    dateTime: '',
    time: '',
  });
};
```

## Преимущества HTML5 типов

### 📅 Дата (`type="date"`)
- ✅ Встроенный календарь
- ✅ Валидация корректности даты
- ✅ Автоматическое форматирование `YYYY-MM-DD`

### 📅🕐 Дата и время (`type="datetime-local"`)
- ✅ Встроенные элементы выбора даты и времени
- ✅ Валидация корректности
- ✅ Автоматическое форматирование `YYYY-MM-DDTHH:mm`

### 🕐 Время (`type="time"`)
- ✅ Встроенный элемент выбора времени
- ✅ Валидация корректности времени
- ✅ Автоматическое форматирование `HH:mm`

### 💰 Число (`type="number"`)
- ✅ Встроенные стрелки для изменения значения
- ✅ Валидация числового формата
- ✅ Поддержка `step`, `min`, `max`

## Интеграция с API

### Отправка данных
```typescript
const handleSubmit = async () => {
  try {
    const response = await api.example.save(model);
    console.log('Данные сохранены:', response);
    resetForm();
  } catch (error) {
    console.error('Ошибка сохранения:', error);
  }
};
```

### Получение данных
```typescript
const loadData = async () => {
  try {
    const response = await api.example.listAll('', 0, 10, 'cdt,desc');
    console.log('Данные загружены:', response);
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};
```

## Валидация

### Клиентская валидация
- HTML5 типы обеспечивают базовую валидацию
- Mantine компоненты добавляют дополнительную валидацию
- Поддержка кастомных правил валидации

### Серверная валидация
- Java типы обеспечивают строгую типизацию
- Spring Boot валидация для бизнес-логики
- Обработка ошибок валидации

## Совместимость

### Браузеры
- ✅ Chrome 20+
- ✅ Firefox 16+
- ✅ Safari 10+
- ✅ Edge 12+

### Мобильные устройства
- ✅ iOS Safari 10+
- ✅ Android Chrome 20+
- ✅ Нативные элементы управления
- ✅ Оптимизированные клавиатуры 