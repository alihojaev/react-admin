"use client";
import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
} from '@tabler/icons-react';
import { Code, Group, ScrollArea, Loader, Text } from '@mantine/core';
import { LinksGroup, Logo } from './';
import { useMenu } from '@/hooks';
import { transformMenuItems } from '@/utils';
import { ClientOnly } from '@/components/ui';
import { usePathname } from 'next/navigation';
import classes from './NavbarNested.module.css';
import { useState, useEffect } from 'react';

// Fallback данные на случай, если API недоступен
const fallbackData = [
  { label: 'Главная', icon: IconGauge, link: '/' },
  
];

export function NavbarNested() {
  const { menuItems, loading, error } = useMenu();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setMounted(true);
    setCurrentPath(pathname || '');
  }, [pathname]);

  // Используем данные из API или fallback данные
  const data = menuItems.length > 0 ? transformMenuItems(menuItems) : fallbackData;

  // Функция для определения активного состояния
  const isActive = (item: any) => {
    // Отключаем активные состояния до полной загрузки
    if (loading || !mounted || !currentPath) return false;
    
    if (item.link) {
      // Для отдельных пунктов проверяем точное совпадение пути
      return currentPath === item.link;
    } else if (item.links) {
      // Для групп проверяем, есть ли активный вложенный пункт
      return item.links.some((link: any) => currentPath === link.link);
    }
    return false;
  };

  // Функция для определения активного состояния с приоритетом
  const isActiveWithPriority = (item: any, index: number) => {
    // Отключаем активные состояния до полной загрузки
    if (loading || !mounted || !currentPath) return false;
    
    if (item.link) {
      // Для отдельных пунктов проверяем точное совпадение пути
      return currentPath === item.link;
    } else if (item.links) {
      // Для групп проверяем, есть ли активный вложенный пункт
      const hasActiveLink = item.links.some((link: any) => currentPath === link.link);
      if (hasActiveLink) {
        // Если группа содержит активный пункт, проверяем приоритет
        // Группы имеют приоритет над отдельными пунктами
        return true;
      }
    }
    return false;
  };

  // Функция для определения активного состояния отдельных пунктов
  const isActiveSingleItem = (item: any) => {
    // Отключаем активные состояния до полной загрузки
    if (loading || !mounted || !currentPath) return false;
    if (!item.link) return false;
    
    // Проверяем, есть ли группа с таким же view
    const hasGroupWithSameView = data.some((otherItem: any) => 
      otherItem.links && otherItem.links.some((link: any) => link.link === item.link)
    );
    
    // Если есть группа с таким же view, то отдельный пункт не должен быть активным
    if (hasGroupWithSameView) {
      return false;
    }
    
    return currentPath === item.link;
  };

  const links = data.map((item, index) => {
    // Определяем активное состояние с учетом приоритетов
    let active = false;
    if (item.links) {
      // Для групп используем обычную логику
      active = isActive(item);
    } else {
      // Для отдельных пунктов используем логику с приоритетом
      active = isActiveSingleItem(item);
    }
    
    return (
      <LinksGroup 
        {...item} 
        key={item.label || item.id || index} 
        active={active}
      />
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: 120, color: 'var(--mantine-color-gray-9)' }} />
          <Code fw={700} c="gray.6">v3.1.2</Code>
        </Group>
      </div>

      <div className={classes.links}>
        <div className={classes.linksInner}>
          <ClientOnly
            fallback={
              // Показываем fallback данные во время SSR без активных состояний
              fallbackData.map((item, index) => (
                <LinksGroup 
                  {...item} 
                  key={item.label || index} 
                  active={false}
                />
              ))
            }
          >
            {loading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '20px',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <Loader size="sm" />
                <Text size="xs" c="dimmed">Loading menu...</Text>
              </div>
            ) : error ? (
              <div style={{ 
                padding: '12px', 
                textAlign: 'center' 
              }}>
                <Text size="xs" c="red">
                  Failed to load menu
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  Using default menu
                </Text>
              </div>
            ) : null}
            {!loading && !error && links}
          </ClientOnly>
        </div>
      </div>
    </nav>
  );
} 