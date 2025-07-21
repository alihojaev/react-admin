'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import DashboardContent from '../components/dashboard/DashboardContent';
import { NavbarNested } from '../components/layout/NavbarNested';
import { HeaderTabs } from '../components/layout/HeaderTabs';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    // Ждем завершения инициализации перед редиректом
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  // Показываем загрузку пока проверяется аутентификация
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, показываем null (будет редирект)
  if (!isAuthenticated) {
    return null;
  }

  // Если пользователь аутентифицирован, показываем dashboard с layout
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <NavbarNested />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <HeaderTabs />
          <main style={{ flex: 1 }}>
            <DashboardContent />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 