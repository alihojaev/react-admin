'use client';

import React from 'react';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { TableSort } from './TableSort';

export default function PermissionPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Разрешения</h1>
        <TableSort />
      </div>
    </ProtectedRoute>
  );
} 