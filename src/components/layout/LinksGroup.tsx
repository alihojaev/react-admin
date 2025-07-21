"use client";
import React, { useState, useEffect } from 'react';
import { Group, Text, UnstyledButton, Collapse } from '@mantine/core';
import { IconChevronRight, IconChevronUp } from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';

export interface LinksGroupProps {
  label: string;
  icon: React.ElementType;
  links?: { label: string; link: string }[];
  link?: string; // Добавляем поддержку прямой ссылки для отдельных пунктов
  active?: boolean;
}

export function LinksGroup({ label, icon: Icon, links = [], link, active = false }: LinksGroupProps) {
  const [opened, setOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const hasLinks = Array.isArray(links) && links.length > 0;

  useEffect(() => {
    setMounted(true);
    setCurrentPath(pathname || '');
    // Устанавливаем начальное состояние только после монтирования
    if (label === 'Market news') {
      setOpened(true);
    }
  }, [label, pathname]);

  // Автоматически раскрываем группу, если один из вложенных пунктов активен
  useEffect(() => {
    if (mounted && hasLinks && active) {
      setOpened(true);
    }
  }, [mounted, hasLinks, active, currentPath]);

  const handleClick = () => {
    if (hasLinks) {
      // Если есть вложенные ссылки, переключаем состояние
      setOpened((o) => !o);
    } else if (link) {
      // Если это отдельный пункт с прямой ссылкой, переходим по ней
      router.push(link);
    }
  };

  const handleLinkClick = (link: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(link);
  };

  // Функция для определения активного состояния вложенного пункта
  const isLinkActive = (linkPath: string) => {
    return mounted && currentPath === linkPath;
  };

  const items = hasLinks ? (
    <Collapse in={opened}>
      <div style={{ 
        paddingLeft: 32,
        paddingTop: '4px',
        paddingBottom: '4px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          left: 24,
          top: 0,
          bottom: 0,
          width: '1px',
          backgroundColor: 'var(--mantine-color-gray-3)'
        }} />
        {links.map((link) => (
          <Text
            key={link.label}
            component="a"
            href={link.link}
            size="sm"
            c="dimmed"
            style={{ 
              display: 'block', 
              padding: '8px 12px',
              textDecoration: 'none',
              borderRadius: '4px',
              marginBottom: '2px',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
              backgroundColor: isLinkActive(link.link) ? 'var(--mantine-color-blue-0)' : 'transparent',
              color: isLinkActive(link.link) ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-6)',
              fontWeight: isLinkActive(link.link) ? 500 : 400
            }}
            onClick={(e) => handleLinkClick(link.link, e)}
            onMouseEnter={(e) => {
              if (!isLinkActive(link.link)) {
                e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLinkActive(link.link)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {link.label}
          </Text>
        ))}
      </div>
    </Collapse>
  ) : null;

  return (
    <div>
      <UnstyledButton 
        onClick={handleClick}
        style={{ 
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          color: 'var(--mantine-color-gray-9)',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease',
          backgroundColor: active ? 'var(--mantine-color-blue-0)' : 'transparent',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (!active && !hasLinks) {
            e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active && !hasLinks) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <Group justify="space-between">
          <Group gap="sm">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: active ? 'var(--mantine-color-blue-1)' : 'var(--mantine-color-blue-0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${active ? 'var(--mantine-color-blue-3)' : 'var(--mantine-color-blue-2)'}`
            }}>
              <Icon size={16} style={{ 
                color: active ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-blue-6)' 
              }} />
            </div>
            <Text size="sm" fw={active ? 600 : 500} c={active ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-9)'}>
              {label}
            </Text>
          </Group>
          {hasLinks && (
            opened ? (
              <IconChevronUp 
                size={16} 
                style={{ 
                  color: 'var(--mantine-color-gray-5)',
                  transition: 'transform 0.2s'
                }} 
              />
            ) : (
              <IconChevronRight 
                size={16} 
                style={{ 
                  color: 'var(--mantine-color-gray-5)',
                  transition: 'transform 0.2s'
                }} 
              />
            )
          )}
        </Group>
      </UnstyledButton>
      {items}
    </div>
  );
} 