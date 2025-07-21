'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  // Redirect if already authenticated and initialization is complete
  React.useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, isInitialized, router]);

  // Show loading while checking authentication
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

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <AuthLayout>
      <LoginForm
        onSuccess={handleSuccess}
      />
    </AuthLayout>
  );
} 