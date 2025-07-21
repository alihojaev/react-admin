'use client';

import React from 'react';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';

export default function RolePage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Роли</h1>
        <p>Страница управления ролями</p>
      </div>
    </ProtectedRoute>
  );
} 