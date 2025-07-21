# DataTable Component

Универсальный компонент таблицы данных с поддержкой сортировки, поиска, пагинации и действий.

## Использование

```tsx
import { DataTable } from '@/components/ui';

const data = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

const columns = [
  { key: 'name', label: 'Имя', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
];

function MyComponent() {
  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={true}
      pagination={true}
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

- `data: RowData[]` - массив данных для отображения
- `columns: Column[]` - конфигурация колонок

### Опциональные

- `searchable?: boolean` - включить поиск (по умолчанию: `true`)
- `pagination?: boolean` - включить пагинацию (по умолчанию: `true`)
- `itemsPerPage?: number` - количество элементов на странице (по умолчанию: `10`)
- `addButton?: AddButtonConfig` - конфигурация кнопки добавления
- `actions?: ActionsConfig` - конфигурация действий (редактирование/удаление)
- `searchPlaceholder?: string` - placeholder для поля поиска
- `emptyMessage?: string` - сообщение при отсутствии данных (по умолчанию: "Нет записей для отображения")
- `className?: string` - дополнительные CSS классы

## Типы

### RowData
```tsx
interface RowData {
  id: string;
  [key: string]: any;
}
```

### Column
```tsx
interface Column {
  key: string;           // ключ поля в данных
  label: string;         // заголовок колонки
  sortable?: boolean;    // можно ли сортировать
  width?: string | number; // ширина колонки
  align?: 'left' | 'center' | 'right'; // выравнивание
}
```

### AddButtonConfig
```tsx
interface AddButtonConfig {
  label: string;         // текст кнопки
  onClick: () => void;   // обработчик клика
}
```

### ActionsConfig
```tsx
interface ActionsConfig {
  edit?: (row: RowData) => void;    // обработчик редактирования
  delete?: (row: RowData) => void;  // обработчик удаления
}
```

## Возможности

- ✅ Сортировка по колонкам
- ✅ Поиск по всем полям
- ✅ Пагинация
- ✅ Действия (редактирование/удаление)
- ✅ Кнопка добавления
- ✅ Настраиваемые колонки
- ✅ Адаптивный дизайн
- ✅ Поддержка темной темы

## Примеры

### Простая таблица
```tsx
<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Имя' },
    { key: 'email', label: 'Email' },
  ]}
/>
```

### Таблица с сортировкой
```tsx
<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Имя', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'createdAt', label: 'Дата создания', sortable: true },
  ]}
/>
```

### Таблица с действиями
```tsx
<DataTable
  data={users}
  columns={columns}
  actions={{
    edit: (user) => handleEditUser(user),
    delete: (user) => handleDeleteUser(user),
  }}
  addButton={{
    label: 'Добавить пользователя',
    onClick: () => setAddModalOpen(true),
  }}
/>
```

### Таблица без поиска и пагинации
```tsx
<DataTable
  data={users}
  columns={columns}
  searchable={false}
  pagination={false}
/>
``` 