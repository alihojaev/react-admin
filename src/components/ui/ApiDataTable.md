# ApiDataTable Component

Компонент таблицы данных с автоматической загрузкой данных через API. Поддерживает пагинацию, поиск, сортировку и автоматические запросы к серверу.

## Использование

```tsx
import { ApiDataTable } from '@/components/ui';
import { AuthApi } from '@/lib/generated/api';

const authApi = new AuthApi();

const columns = [
  { key: 'name', label: 'Имя', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
];

function MyComponent() {
  return (
    <ApiDataTable
      columns={columns}
      apiMethod={authApi.admin.getUsers}
      searchable={true}
      pagination={true}
      itemsPerPage={10}
      addButton={{
        label: 'Добавить',
        onClick: () => console.log('Add clicked'),
      }}
      actions={{
        edit: (row) => console.log('Edit:', row),
        delete: (row) => console.log('Delete:', row),
      }}
    />
  );
}
```

## Props

### Обязательные

- `columns: Column[]` - конфигурация колонок
- `apiMethod: (query: string, page: number, size: number, sort: string) => Promise<any>` - метод API для загрузки данных

### Опциональные

- `fieldsApiMethod?: () => Promise<any>` - метод API для загрузки полей (вызывается при монтировании)

### Опциональные

- `searchable?: boolean` - включить поиск (по умолчанию: `true`)
- `pagination?: boolean` - включить пагинацию (по умолчанию: `true`)
- `itemsPerPage?: number` - количество элементов на странице (по умолчанию: `10`)
- `addButton?: AddButtonConfig` - конфигурация кнопки добавления
- `actions?: ActionsConfig` - конфигурация действий (редактирование/удаление)
- `searchPlaceholder?: string` - placeholder для поля поиска
- `emptyMessage?: string` - сообщение при отсутствии данных (по умолчанию: "Нет записей для отображения")
- `className?: string` - дополнительные CSS классы
- `onDataLoaded?: (data: any) => void` - callback при загрузке данных
- `onFieldsLoaded?: (fields: any) => void` - callback при загрузке полей
- `onColumnsChange?: (columns: Column[]) => void` - callback при изменении колонок
- `onFiltersChange?: (filters: FilterModel[]) => void` - callback при изменении фильтров

## API Метод

API метод должен принимать следующие параметры:

```tsx
type ApiMethod = (
  query: string,    // RSQL запрос для поиска
  page: number,     // Номер страницы (начинается с 0)
  size: number,     // Размер страницы
  sort: string      // Сортировка в формате "field,direction"
) => Promise<any>
```

### Пример API метода:

```tsx
// Из AuthApi
getUsers(query: string, page?: number, size?: number, sort?: string) {
  return c.get(`/api/user?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
}
```

## Формат ответа API

Компонент ожидает, что API возвращает один из следующих форматов:

### Вариант 1: Spring Boot Page
```json
{
  "content": [...],      // Массив данных
  "totalElements": 100,  // Общее количество элементов
  "totalPages": 10,      // Общее количество страниц
  "size": 10,           // Размер страницы
  "number": 0           // Номер текущей страницы
}
```

### Вариант 2: Простой объект
```json
{
  "data": [...],        // Массив данных
  "total": 100          // Общее количество элементов
}
```

### Вариант 3: Простой массив
```json
[...]  // Массив данных (total будет равен длине массива)
```

## Автоматические запросы

Компонент автоматически отправляет запросы к API при:

1. **Монтировании компонента** - загружает поля (если указан `fieldsApiMethod`)
2. **Первой загрузке** - загружает первую страницу данных
3. **Изменении поиска** - сбрасывает на первую страницу
4. **Изменении фильтров** - сбрасывает на первую страницу
5. **Изменении сортировки** - сбрасывает на первую страницу
6. **Изменении страницы** - загружает новую страницу

## Параметры запроса

### Поиск (query)
- По умолчанию: пустая строка
- Поддерживает RSQL синтаксис
- Автоматически ищет по всем строковым полям с оператором `=like=*search*`
- Фильтры добавляются к поиску через `;` (AND логика)

### Пагинация (page)
- Начинается с 0 (как ожидает Spring Boot)
- Автоматически конвертируется из UI (где страницы начинаются с 1)

### Размер страницы (size)
- По умолчанию: 10
- Настраивается через `itemsPerPage`

### Сортировка (sort)
- По умолчанию: `"cdt,desc"` (сортировка по дате создания)
- Формат: `"field,direction"`
- Примеры: `"name,asc"`, `"email,desc"`, `"cdt,desc"`

## Состояния загрузки

- **LoadingOverlay** - показывает индикатор загрузки
- **Сообщения** - "Загрузка..." при отсутствии данных
- **Блокировка пагинации** - кнопки неактивны во время загрузки

## Примеры использования

### Простая таблица с API
```tsx
<ApiDataTable
  columns={[
    { key: 'name', label: 'Имя', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
  ]}
  apiMethod={authApi.admin.getUsers}
/>
```

### Таблица с кастомными настройками
```tsx
<ApiDataTable
  columns={columns}
  apiMethod={authApi.example.listAll}
  fieldsApiMethod={authApi.example.getFields}
  searchable={true}
  pagination={true}
  itemsPerPage={20}
  addButton={{
    label: 'Добавить запись',
    onClick: () => setModalOpen(true),
  }}
  actions={{
    edit: (row) => handleEdit(row),
    delete: (row) => handleDelete(row),
  }}
  onDataLoaded={(data) => console.log('Loaded:', data)}
  onFieldsLoaded={(fields) => console.log('Fields:', fields)}
/>
```

### Таблица без поиска
```tsx
<ApiDataTable
  columns={columns}
  apiMethod={apiMethod}
  searchable={false}
  pagination={true}
/>
```

## Отличия от DataTable

| Функция | DataTable | ApiDataTable |
|---------|-----------|--------------|
| Источник данных | Статичные данные | API запросы |
| Пагинация | Клиентская | Серверная |
| Поиск | Клиентский | Серверный |
| Фильтры | Нет | RSQL фильтры |
| Сортировка | Клиентская | Серверная |
| Загрузка | Нет | Автоматическая |
| Состояния | Нет | Loading, Error |

## Интеграция с существующим API

Компонент уже интегрирован с вашим API:

- **Users**: `authApi.admin.getUsers`
- **Examples**: `authApi.example.listAll`
- **Roles**: `authApi.role.findAllRsql`

Просто передайте нужный метод в `apiMethod` prop! 