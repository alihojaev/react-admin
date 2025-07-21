'use client';

import React from 'react';
import { Container, Grid, Card, Text, Group, Badge, Stack, Avatar } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import { Button as CustomButton } from '../ui/Button';
import {
  IconUsers,
  IconChartBar,
  IconShoppingCart,
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconEye,
  IconDownload,
  IconFileText,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconFolder,
  IconUser,
  IconMail,
  IconPhone,
  IconShield,
  IconClock
} from '@tabler/icons-react';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivity {
  id: number;
  user: string;
  action: string;
  time: string;
  avatar: string;
}

interface FileItem {
  id: number;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'folder';
  size: string;
  modified: string;
  icon: React.ReactNode;
}

export default function DashboardContent() {
  const { user, logout } = useAuth();

  const stats: StatCard[] = [
    {
      title: 'Total Users',
      value: '1,234',
      change: 12.5,
      icon: <IconUsers size={24} />,
      color: 'blue'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: -2.3,
      icon: <IconCurrencyDollar size={24} />,
      color: 'green'
    },
    {
      title: 'Orders',
      value: '567',
      change: 8.1,
      icon: <IconShoppingCart size={24} />,
      color: 'orange'
    },
    {
      title: 'Views',
      value: '89,012',
      change: 15.7,
      icon: <IconEye size={24} />,
      color: 'purple'
    }
  ];

  const recentActivities: RecentActivity[] = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 hours ago', avatar: 'JD' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '4 hours ago', avatar: 'JS' },
    { id: 3, user: 'Mike Johnson', action: 'Uploaded file', time: '6 hours ago', avatar: 'MJ' },
    { id: 4, user: 'Sarah Wilson', action: 'Completed task', time: '8 hours ago', avatar: 'SW' }
  ];

  const recentFiles: FileItem[] = [
    { id: 1, name: 'presentation.pdf', type: 'document', size: '2.4 MB', modified: '2 hours ago', icon: <IconFileText size={20} /> },
    { id: 2, name: 'photo.jpg', type: 'image', size: '1.8 MB', modified: '4 hours ago', icon: <IconPhoto size={20} /> },
    { id: 3, name: 'video.mp4', type: 'video', size: '15.2 MB', modified: '6 hours ago', icon: <IconVideo size={20} /> },
    { id: 4, name: 'music.mp3', type: 'audio', size: '3.1 MB', modified: '8 hours ago', icon: <IconMusic size={20} /> }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <Text size="xl" fw={700} className="text-gray-900">
            Панель управления
          </Text>
          <Text size="sm" c="dimmed">
            Добро пожаловать, {user?.username}!
          </Text>
        </div>

        {/* Stats Cards */}
        <Grid mb="xl">
          {stats.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <div className={`text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                  <Badge 
                    color={stat.change >= 0 ? 'green' : 'red'} 
                    variant="light"
                    leftSection={stat.change >= 0 ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
                  >
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </Badge>
                </Group>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
                <Text size="sm" c="dimmed">
                  {stat.title}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <Grid>
          {/* User Information */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Информация о пользователе
              </Text>
              <Stack gap="sm">
                <Group>
                  <IconUser size={16} className="text-gray-500" />
                  <Text size="sm"><strong>Имя пользователя:</strong> {user?.username}</Text>
                </Group>
                <Group>
                  <IconMail size={16} className="text-gray-500" />
                  <Text size="sm"><strong>Email:</strong> {user?.email}</Text>
                </Group>
                <Group>
                  <IconPhone size={16} className="text-gray-500" />
                  <Text size="sm"><strong>Телефон:</strong> {user?.phone || 'Не указан'}</Text>
                </Group>
                <Group>
                  <IconShield size={16} className="text-gray-500" />
                  <Text size="sm"><strong>Тип авторизации:</strong> {user?.authType}</Text>
                </Group>
                <Group>
                  <Badge color={user?.blocked ? 'red' : 'green'} variant="light">
                    {user?.blocked ? 'Заблокирован' : 'Активен'}
                  </Badge>
                </Group>
                <Group>
                  <IconClock size={16} className="text-gray-500" />
                  <Text size="sm"><strong>Последняя активность:</strong></Text>
                </Group>
                <Text size="xs" c="dimmed" ml={24}>
                  {new Date(user?.lastActivity || '').toLocaleString()}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Recent Activity */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Последняя активность
              </Text>
              <Stack gap="sm">
                {recentActivities.map((activity) => (
                  <Group key={activity.id} gap="sm">
                    <Avatar size="sm" radius="xl">
                      {activity.avatar}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {activity.user}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {activity.action}
                      </Text>
                    </div>
                    <Text size="xs" c="dimmed">
                      {activity.time}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          {/* Recent Files */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Последние файлы
              </Text>
              <Stack gap="sm">
                {recentFiles.map((file) => (
                  <Group key={file.id} gap="sm">
                    <div className="text-gray-500">
                      {file.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {file.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {file.size} • {file.modified}
                      </Text>
                    </div>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Quick Actions */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
          <Text size="lg" fw={600} mb="md">
            Быстрые действия
          </Text>
          <Group>
            <CustomButton
              variant="outline"
              leftSection={<IconUsers size={16} />}
              onClick={() => window.location.href = '/users'}
            >
              Управление пользователями
            </CustomButton>
            <CustomButton
              variant="outline"
              leftSection={<IconShield size={16} />}
              onClick={() => window.location.href = '/role'}
            >
              Роли и разрешения
            </CustomButton>
            <CustomButton
              variant="outline"
              leftSection={<IconChartBar size={16} />}
              onClick={() => window.location.href = '/analytics'}
            >
              Аналитика
            </CustomButton>
            <CustomButton
              variant="outline"
              leftSection={<IconFileText size={16} />}
              onClick={() => window.location.href = '/docs'}
            >
              Документация
            </CustomButton>
          </Group>
        </Card>
      </Container>
    </div>
  );
} 