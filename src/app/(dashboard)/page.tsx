'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardHomePage() {
  const router = useRouter();
  
  // Перенаправляем на главную страницу, так как dashboard теперь находится там
  React.useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
} 