'use client';

import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';

export function ConsoleApiExample() {
  const { api, publicApi } = useApi();

  useEffect(() => {
    // Делаем API доступным в консоли для тестирования
    (window as any).api = api;
    (window as any).publicApi = publicApi;

    console.log('API доступен в консоли как window.api и window.publicApi');
    console.log('Примеры использования:');
    console.log('- window.publicApi.client.getAllClients()');
    console.log('- window.api.auth.current()');
    console.log('- window.api.client.getClientById(1)');

    return () => {
      delete (window as any).api;
      delete (window as any).publicApi;
    };
  }, [api, publicApi]);

  return (
    <div className="p-6 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Тестирование API в консоли</h3>
      <p className="text-sm text-gray-600 mb-4">
        Откройте консоль браузера (F12) и используйте следующие команды:
      </p>
      
      <div className="space-y-2 text-sm">
        <div className="bg-white p-3 rounded border">
          <code className="text-green-600">window.publicApi.client.getAllClients()</code>
          <p className="text-gray-500 mt-1">Получить всех клиентов (публичный API)</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <code className="text-green-600">window.api.auth.current()</code>
          <p className="text-gray-500 mt-1">Получить текущего пользователя (авторизованный API)</p>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <code className="text-green-600">window.api.client.getClientById(1)</code>
          <p className="text-gray-500 mt-1">Получить клиента по ID (авторизованный API)</p>
        </div>
      </div>
    </div>
  );
} 