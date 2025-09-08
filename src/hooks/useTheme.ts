import { useState, useEffect } from 'react';

export function useTheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Загружаем сохраненную тему из localStorage
    const savedTheme = localStorage.getItem('mantine-color-scheme') as 'light' | 'dark';
    
    if (savedTheme) {
      setColorScheme(savedTheme);
      document.documentElement.setAttribute('data-mantine-color-scheme', savedTheme);
    }
  }, []);

  const toggleColorScheme = () => {
    if (!mounted) {
      return;
    }
    
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
    
    // Сохраняем в localStorage
    localStorage.setItem('mantine-color-scheme', newScheme);
    
    // Обновляем data-mantine-color-scheme атрибут
    document.documentElement.setAttribute('data-mantine-color-scheme', newScheme);
    
    // Принудительно обновляем CSS переменные
    document.documentElement.style.colorScheme = newScheme;
  };

  // Возвращаем светлую тему по умолчанию до монтирования
  if (!mounted) {
    return { colorScheme: 'light', toggleColorScheme: () => {} };
  }

  return { colorScheme, toggleColorScheme };
} 