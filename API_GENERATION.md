# Генерация API из Swagger

Эта система позволяет автоматически генерировать TypeScript API клиенты из Swagger документации.

## Установка

1. Убедитесь, что у вас установлен `axios`:
```bash
npm install axios
```

## Настройка

1. Установите переменную окружения `SWAGGER_URL` в вашем `.env.local` файле:
```env
SWAGGER_URL=http://localhost:8081/v3/api-docs
```

## Генерация API

Запустите команду для генерации API:
```bash
npm run generate:api
```

Это создаст файл `src/lib/generated/api.ts` с сгенерированными классами API.

## Структура сгенерированного API

Система создает два основных класса:

### AuthApi
Для авторизованных запросов (требуют JWT токен):
```typescript
const { api } = useApi();

// Пример использования
const userData = await api.auth.current();
const orders = await api.userOrder.listAllByUserId('en');
```

### P_Api (PublicApi)
Для публичных запросов (не требуют авторизации):
```typescript
const { publicApi } = useApi();

// Примеры использования
const categories = await publicApi.category.listAll('en');
const loginResult = await publicApi.auth.login({ email, password });
const products = await publicApi.product.list('search', 0, 10, 'name,asc', 'en');
```

## Использование в компонентах

```typescript
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { api, publicApi } = useApi();

  const handleLogin = async () => {
    try {
      const result = await publicApi.auth.login({
        email: 'user@example.com',
        password: 'password'
      });
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGetUserData = async () => {
    try {
      const userData = await api.auth.current();
      console.log('User data:', userData);
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGetUserData}>Get User Data</button>
    </div>
  );
}
```

## Автоматическая авторизация

Система автоматически:
- Добавляет JWT токен к авторизованным запросам
- Обрабатывает 401 ошибки (автоматический logout)
- Обновляет заголовки при изменении токена

## Настройка обработчиков ошибок

```typescript
import { Http } from '@/lib/http';

const http = new Http();

// Глобальный обработчик ошибок
http.setGlobalErrorHandler((error) => {
  console.error('API Error:', error);
  // Показать уведомление пользователю
});

// Обработчик 401 ошибок
http.set403Interceptor((error) => {
  // Перенаправить на страницу входа
  window.location.href = '/login';
});

// Обработчики login/logout
http.setLoginHandler(() => {
  console.log('User logged in');
});

http.setLogoutHandler(() => {
  console.log('User logged out');
});
```

## Типы запросов

Система поддерживает все основные HTTP методы:
- `GET` - для получения данных
- `POST` - для создания данных
- `PUT` - для обновления данных
- `DELETE` - для удаления данных

## Параметры запросов

### Path параметры
```typescript
// GET /api/product/{id}
const product = await publicApi.product.getById(123, 'en');
```

### Query параметры
```typescript
// GET /api/product?query=search&page=0&size=10&sort=name,asc&lang=en
const products = await publicApi.product.list('search', 0, 10, 'name,asc', 'en');
```

### Body параметры
```typescript
// POST /api/auth/login
const result = await publicApi.auth.login({
  email: 'user@example.com',
  password: 'password'
});
```

## Перегенерация API

При изменении Swagger документации просто запустите команду генерации снова:
```bash
npm run generate:api
```

Файл `src/lib/generated/api.ts` будет обновлен с новыми эндпоинтами.

## Примечания

- Сгенерированный файл содержит примеры API методов
- Для реального использования замените содержимое файла результатом генерации
- Убедитесь, что ваш Swagger сервер доступен перед запуском генерации
- Система автоматически разделяет публичные и авторизованные эндпоинты 