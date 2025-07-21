# Руководство по интеграции системы генерации API

## Что было реализовано

Я успешно перенес вашу логику генерации API из Vue.js проекта в Next.js проект. Вот что было создано:

### 1. Скрипт генерации API
- **Файл**: `scripts/generate-api.js`
- **Функция**: Получает Swagger документацию и генерирует TypeScript API клиенты
- **Команда**: `npm run generate:api`

### 2. HTTP клиенты
- **Файл**: `src/lib/http.ts`
- **Классы**: `Http` (для авторизованных запросов) и `PublicHttp` (для публичных запросов)
- **Функции**: Автоматическое добавление JWT токенов, обработка 401 ошибок

### 3. Сгенерированный API
- **Файл**: `src/lib/generated/api.ts`
- **Классы**: `AuthApi` и `P_Api`
- **Методы**: Автоматически сгенерированные методы на основе Swagger

### 4. React хук
- **Файл**: `src/hooks/useApi.ts`
- **Функция**: Предоставляет доступ к API в React компонентах

### 5. Примеры использования
- **Компонент**: `src/components/examples/ApiExample.tsx`
- **Страница**: `src/app/examples/api/page.tsx`
- **Консольный пример**: `src/components/examples/ConsoleApiExample.tsx`

## Как использовать

### 1. Настройка
```bash
# Установите axios (если еще не установлен)
npm install axios

# Создайте .env.local файл
echo "SWAGGER_URL=http://localhost:8081/v3/api-docs" > .env.local
```

### 2. Генерация API
```bash
npm run generate:api
```

### 3. Использование в компонентах
```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { api, publicApi } = useApi();

  const handleGetClients = async () => {
    try {
      const clients = await publicApi.client.getAllClients();
      console.log('Clients:', clients);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGetCurrentUser = async () => {
    try {
      const user = await api.auth.current();
      console.log('Current user:', user);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGetClients}>Get Clients</button>
      <button onClick={handleGetCurrentUser}>Get Current User</button>
    </div>
  );
}
```

### 4. Авторизация
```typescript
import { Http } from '@/lib/http';

const http = new Http();

// Установка токена
http.login('your-jwt-token');

// Проверка авторизации
if (http.loggedIn) {
  console.log('User is logged in');
}

// Выход
http.logout();
```

## Отличия от Vue.js версии

### 1. TypeScript поддержка
- Все файлы написаны на TypeScript
- Добавлены типы для лучшей разработки

### 2. React интеграция
- Создан хук `useApi` для использования в React компонентах
- Нет необходимости в глобальных плагинах

### 3. Next.js совместимость
- Учтена серверная и клиентская рендеринг
- Правильная работа с localStorage

### 4. Современная структура
- Использование современных ES6+ возможностей
- Лучшая организация кода

## Доступные методы API

### AuthApi (авторизованные запросы)
- `api.auth.current()` - получить текущего пользователя
- `api.client.getAllClients()` - получить всех клиентов
- `api.client.getClientById(id)` - получить клиента по ID
- `api.client.registerClient(body)` - зарегистрировать клиента
- `api.client.updateClient(id, body)` - обновить клиента
- `api.client.deleteClient(id)` - удалить клиента
- `api.client.blockClient(id)` - заблокировать клиента
- `api.client.unblockClient(id)` - разблокировать клиента
- `api.client.checkEmailExists(email)` - проверить существование email
- `api.client.checkUsernameExists(username)` - проверить существование username

- `api.client.checkGoogleIdExists(googleId)` - проверить существование Google ID
- `api.client.getClientByEmail(email)` - получить клиента по email
- `api.client.getClientByUsername(username)` - получить клиента по username

- `api.client.getClientByGoogleId(googleId)` - получить клиента по Google ID

### P_Api (публичные запросы)
- `publicApi.client.getAllClients()` - получить всех клиентов (публично)

## Тестирование

1. Запустите сервер разработки: `npm run dev`
2. Перейдите на страницу: `http://localhost:3000/examples/api`
3. Используйте кнопки для тестирования API
4. Откройте консоль браузера для дополнительного тестирования

## Перегенерация при изменениях

При изменении Swagger документации:
1. Убедитесь, что сервер доступен
2. Запустите: `npm run generate:api`
3. Файл `src/lib/generated/api.ts` будет обновлен

## Преимущества новой системы

1. **Автоматическая генерация** - нет необходимости вручную писать API методы
2. **TypeScript поддержка** - лучшая разработка с типами
3. **React интеграция** - удобные хуки для использования
4. **Автоматическая авторизация** - JWT токены добавляются автоматически
5. **Обработка ошибок** - централизованная обработка ошибок
6. **Современная архитектура** - использование современных возможностей JavaScript/TypeScript

Система готова к использованию! 🚀 