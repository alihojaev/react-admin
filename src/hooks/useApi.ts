import { useMemo } from 'react';
import { AuthApi, P_Api } from '@/lib/generated/api';

export function useApi() {
  const api = useMemo(() => new AuthApi(), []);
  const publicApi = useMemo(() => new P_Api(), []);

  return {
    api,
    publicApi,
  };
} 