```
```
### Template Admin

Коротко о проекте: админ-панель на Next.js с готовыми компонентами, аутентификацией, таблицами, формами и состоянием. 

### Демо
- Landing: [landing.code-lab.pro](https://landing.code-lab.pro)
- Dashboard: [dashboard.code-lab.pro](https://dashboard.code-lab.pro/)
- Support: [support.code-lab.pro](https://support.code-lab.pro)

(login: admin, pass: 123)

### Технологии
- **Next.js (App Router)**: рендеринг, маршрутизация, оптимизации
- **React 18** и **TypeScript**: компоненты и строгая типизация
- **Mantine v8**: UI-компоненты, модальные окна, `ScrollArea`, `Pagination`
- **Tailwind CSS**: утилитарные стили
- **Zustand**: хранилище аутентификации (`authStore`)
- **Axios**: HTTP-клиент и перехватчики (`src/lib/http.ts`)
- **Автогенерация API-клиента**: `src/lib/generated/api.ts`
- **Tabler Icons**, **react-hot-toast** и полезные хуки/утилиты

### Структура проекта 
- `src/app/`
  - `(auth)/` — страницы входа/выхода, макет авторизации (`login/`, `logout/`)
  - `(dashboard)/` — основные разделы админки: `users/`, `role/`, `docs/`
  - `layout.tsx`, `providers.tsx` — общий макет и провайдеры
- `src/components/`
  - `auth/` — `AuthLayout`, `LoginForm`, `ProtectedRoute`
  - `ui/` — `ApiDataTable`, `DataTable`, `FilterModal`, вспомогательные UI
  - `layout/` — шапка/навигация
  - `forms/` — универсальная форма `CustomForm`
- `src/hooks/` — `useAuth`, `useApi`, `useCrudOperations`, `useTableState` и др.
- `src/lib/` — обёртки над HTTP, сгенерированный API-клиент
- `src/services/` — сервисы (например, `authService`)
- `src/store/` — Zustand-хранилище (`authStore.ts`)
- `src/types/` — типы доменной модели
- `src/utils/` — валидации, уведомления, форматирование

### Особенности
#### CustomForm
- Универсальный компонент формы: `src/components/forms/CustomForm.tsx`
- Конфигурация полей через `FieldConfig` (лейблы, плейсхолдеры, required, правила)
- Поддерживаемые типы: string, textarea, number, boolean, select, multiselect, date, datetime, time, file
- Валидации и сообщения об ошибках, колонки/раскладка, режим «dense»

#### Data Table и RSQL-фильтры
- Таблица `ApiDataTable` (`src/components/ui/ApiDataTable.tsx`) формирует RSQL-запрос из поиска и выбранных фильтров
- Операторы: `==`, `!=`, `>`, `>=`, `<`, `<=`, `=like=`, `=ilike=`, `=in=`, `=out=` (см. `FilterModal`)
- Сохранение состояния (поиск, сортировка, колонки, пагинация) в `useTableState`

#### Автогенерация API из Swagger/OpenAPI
- Клиент генерируется в `src/lib/generated/api.ts`
- Скрипт генерации: `scripts/generate-api.js` (подключите свой OpenAPI/Swagger источник)
- HTTP-обёртка `src/lib/http.ts` с управлением токеном и перехватчиками

























