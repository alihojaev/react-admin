import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import type { MenuItem, MenuResponse } from '@/types';

export function useMenu() {
  const { api } = useApi();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.menu.menu();
        
        // API может возвращать данные напрямую или в поле data
        const data = response.data || response;
        
        if (data && Array.isArray(data)) {
          setMenuItems(data);
        } else if (data && data.items && Array.isArray(data.items)) {
          setMenuItems(data.items);
        } else {
          setMenuItems([]);
        }
      } catch (err) {
        console.error('Failed to fetch menu:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch menu');
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [api]);

  return {
    menuItems,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      api.menu.menu().then(response => {
        const data = response.data || response;
        if (data && Array.isArray(data)) {
          setMenuItems(data);
        } else if (data && data.items && Array.isArray(data.items)) {
          setMenuItems(data.items);
        } else {
          setMenuItems([]);
        }
      }).catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu');
        setMenuItems([]);
      }).finally(() => {
        setLoading(false);
      });
    }
  };
} 