'use client';

import React from 'react';
import { Container, Title, Paper } from '@mantine/core';
import { FormExample } from '@/components/forms/Example';

export default function FormsPage() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        Демонстрация CustomForm
      </Title>
      
      <FormExample />
    </Container>
  );
} 