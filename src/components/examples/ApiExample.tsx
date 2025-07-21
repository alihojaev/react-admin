'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';

export function ApiExample() {
  const { api, publicApi } = useApi();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePublicRequest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Пример публичного запроса
      // const result = await publicApi.get('/clients');
      const result = { message: 'Public API example' };
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthRequest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Пример авторизованного запроса
      const result = await api.auth.current();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Пример использования API</h2>
      
      <div className="space-y-2">
        <button
          onClick={handlePublicRequest}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Публичный запрос (категории)'}
        </button>
        
        <button
          onClick={handleAuthRequest}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          {loading ? 'Загрузка...' : 'Авторизованный запрос (текущий пользователь)'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Ошибка: {error}
        </div>
      )}

      {data && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Результат:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 