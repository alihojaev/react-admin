# Система сохранения состояния таблицы

Система автоматического сохранения и восстановления состояния таблицы в localStorage с валидацией полей и поддержкой множественных страниц.

## Особенности

- **Автоматическое сохранение** всех настроек таблицы
- **Восстановление при перезагрузке** страницы
- **Валидация полей** - удаление фильтров/колонок для несуществующих полей
- **Поддержка множественных страниц** - отдельное состояние для каждой страницы
- **Безопасность** - обработка ошибок localStorage

## Использование

### 1. В ApiDataTable

```tsx
<ApiDataTable
  columns={columns}
  apiMethod={authApi.example.listAll}
  fieldsApiMethod={authApi.example.getFields}
  pageId="example-page" // Уникальный идентификатор страницы
  // ... другие пропсы
/>
```

### 2. В хуке useTableState

```tsx
const {
  state,
  updateSearchQuery,
  updateFilters,
  updateCurrentPage,
  updateItemsPerPage,
  updateColumns,
  updateSorting,
  resetState,
} = useTableState(pageId, initialColumns, availableFields);
```

## Сохраняемые данные

### TableState
```tsx
interface TableState {
  searchQuery: string;           // Поисковый запрос
  filters: FilterModel[];        // Активные фильтры
  itemsPerPage: number;          // Размер страницы
  columns: Column[];             // Настроенные колонки
  sortBy: string | null;         // Поле сортировки
  reverseSortDirection: boolean; // Направление сортировки
}
```

> **Примечание:** Текущая страница (`currentPage`) не сохраняется в localStorage и сбрасывается на 1 при перезагрузке страницы.

## Валидация данных

### Фильтры
- **Проверка существования полей** в `availableFields`
- **Автоматическое удаление** фильтров для несуществующих полей
- **Безопасное восстановление** при изменении схемы БД

### Колонки
- **Сохранение системных колонок** (не из БД)
- **Валидация полей БД** по `availableFields`
- **Fallback на начальные колонки** при полной очистке

## Структура localStorage

### Ключи
```
table_state_example-page
table_state_users-page
table_state_roles-page
```

### Пример данных
```json
{
  "searchQuery": "test",
  "filters": [
    {
      "field": {
        "fieldName": "name",
        "fieldType": "String",
        "description": "Название"
      },
      "type": {
        "value": "=like=",
        "name": "Содержит"
      },
      "value": "test"
    }
  ],
  "itemsPerPage": 20,
  "columns": [
    {
      "key": "name",
      "label": "Название",
      "sortable": true
    },
    {
      "key": "cdt",
      "label": "Создано",
      "sortable": true
    }
  ],
  "sortBy": "cdt",
  "reverseSortDirection": true
}
```

## API хука

### Параметры
- `pageId: string` - уникальный идентификатор страницы
- `initialColumns: Column[]` - начальные колонки
- `availableFields: FieldInfo[]` - доступные поля из API

### Возвращаемые значения

#### state
```tsx
const {
  searchQuery,
  filters,
  itemsPerPage,
  columns,
  sortBy,
  reverseSortDirection,
} = state;
```

#### Функции обновления
```tsx
updateSearchQuery(searchQuery: string)     // Обновить поиск
updateFilters(filters: FilterModel[])      // Обновить фильтры
updateItemsPerPage(itemsPerPage: number)   // Обновить размер страницы
updateColumns(columns: Column[])           // Обновить колонки
updateSorting(sortBy: string, reverse: boolean) // Обновить сортировку
resetState()                              // Сбросить состояние
```

## Примеры использования

### Страница пользователей
```tsx
<ApiDataTable
  pageId="users-page"
  columns={userColumns}
  apiMethod={authApi.admin.getUsers}
  // ...
/>
```

### Страница ролей
```tsx
<ApiDataTable
  pageId="roles-page"
  columns={roleColumns}
  apiMethod={authApi.role.findAllRsql}
  // ...
/>
```

### Страница примеров
```tsx
<ApiDataTable
  pageId="example-page"
  columns={exampleColumns}
  apiMethod={authApi.example.listAll}
  // ...
/>
```

## Обработка ошибок

### localStorage недоступен
- **Fallback на значения по умолчанию**
- **Логирование ошибок** в консоль
- **Продолжение работы** без сохранения

### Некорректные данные
- **Валидация при загрузке**
- **Восстановление по умолчанию** при ошибках
- **Безопасное парсинг** JSON

## Преимущества

1. **Удобство пользователя** - настройки сохраняются между сессиями
2. **Производительность** - не нужно настраивать таблицу заново
3. **Безопасность** - валидация предотвращает ошибки
4. **Масштабируемость** - поддержка множественных страниц
5. **Надежность** - обработка всех возможных ошибок

## Миграция

При изменении схемы БД:
1. **Фильтры автоматически очищаются** для удаленных полей
2. **Колонки валидируются** по новым полям
3. **Системные колонки сохраняются** независимо от БД
4. **Fallback механизм** обеспечивает работоспособность 