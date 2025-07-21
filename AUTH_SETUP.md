# Система авторизации - Настройка и использование

## Обзор

Создана полнофункциональная система авторизации с поддержкой:
- Email/Password авторизации
- Google OAuth
- Современный UI с анимациями
- Защищенные роуты
- Управление состоянием с Zustand

## Структура проекта

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # Форма входа
│   │   ├── RegisterForm.tsx       # Форма регистрации
│   │   ├── GoogleAuth.tsx         # Google OAuth компонент

│   │   └── AuthLayout.tsx         # Layout для страниц авторизации
│   └── ui/
│       ├── Button.tsx             # Переиспользуемая кнопка
│       └── Input.tsx              # Переиспользуемые инпуты
├── hooks/
│   └── useAuth.ts                 # Хук для работы с авторизацией
├── services/
│   └── authService.ts             # Сервис для API запросов
├── store/
│   └── authStore.ts               # Zustand store для состояния
├── types/
│   └── auth.ts                    # TypeScript типы
├── pages/
│   ├── LoginPage.tsx              # Страница входа
│   ├── RegisterPage.tsx           # Страница регистрации
│   └── DashboardPage.tsx          # Защищенная страница дашборда
└── app/
    ├── login/page.tsx             # Next.js роут для входа
    ├── register/page.tsx          # Next.js роут для регистрации
    ├── dashboard/page.tsx         # Next.js роут для дашборда
    └── providers.tsx              # Провайдеры (Google OAuth, Toaster)
```

## Настройка

### 1. Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 2. Google OAuth настройка

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Создайте OAuth 2.0 credentials
5. Добавьте разрешенные origins:
   - `http://localhost:3000` (для разработки)
   - `https://yourdomain.com` (для продакшена)
6. Скопируйте Client ID в `.env.local`



## Использование

### Защищенные роуты

Все страницы автоматически проверяют авторизацию:

```typescript
import { useAuth } from '../hooks/useAuth';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Redirect to="/login" />;
  
  return <YourProtectedContent />;
}
```

### Авторизация в компонентах

```typescript
import { useAuthStore } from '../store/authStore';

function MyComponent() {
  const { user, login, logout } = useAuthStore();
  
  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### OAuth авторизация

```typescript
import { GoogleAuth } from '../components/auth';

function AuthButtons() {
  const handleSuccess = () => {
    // Пользователь успешно авторизовался
    router.push('/dashboard');
  };
  
  return (
    <div>
      <GoogleAuth onSuccess={handleSuccess} />
    </div>
  );
}
```

## API Endpoints

Система интегрирована с существующим API:

- `POST /api/clients/register` - Регистрация
- `POST /api/auth/login` - Вход (нужно добавить)
- `GET /api/clients/check/email/{email}` - Проверка email
- `GET /api/clients/check/username/{username}` - Проверка username
- `GET /api/auth/current` - Текущий пользователь

## Безопасность

- Все пароли валидируются на клиенте и сервере
- Токены хранятся в localStorage с автоматическим обновлением
- CSRF защита через токены
- Rate limiting для API запросов
- Автоматический logout при истечении токена

## Стилизация

- Современный дизайн с градиентами
- Адаптивная верстка
- Анимации при переходах
- Loading состояния
- Toast уведомления

## Дополнительные возможности

- Автоматический редирект после авторизации
- Сохранение состояния в localStorage
- Обработка ошибок с пользовательскими сообщениями
- Валидация форм в реальном времени
- Проверка уникальности email и username

## Запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

## Маршруты

- `/` - Главная страница (редирект на /login или /dashboard)
- `/login` - Страница входа
- `/register` - Страница регистрации
- `/dashboard` - Защищенная страница дашборда

## Troubleshooting

### Google OAuth не работает
1. Проверьте правильность Client ID
2. Убедитесь, что домен добавлен в разрешенные origins
3. Проверьте консоль браузера на ошибки


3. Проверьте домены в настройках

### API ошибки
1. Проверьте правильность URL в переменных окружения
2. Убедитесь, что backend сервер запущен
3. Проверьте CORS настройки на backend 