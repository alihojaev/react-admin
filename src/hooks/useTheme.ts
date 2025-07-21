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
    console.log('toggleColorScheme called, mounted:', mounted);
    if (!mounted) {
      console.log('Not mounted, returning');
      return;
    }
    
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    console.log('New scheme will be:', newScheme);
    setColorScheme(newScheme);
    
    // Сохраняем в localStorage
    localStorage.setItem('mantine-color-scheme', newScheme);
    console.log('Saved to localStorage:', newScheme);
    
    // Обновляем data-mantine-color-scheme атрибут
    document.documentElement.setAttribute('data-mantine-color-scheme', newScheme);
    console.log('Set data-mantine-color-scheme to:', newScheme);
    
    // Принудительно обновляем CSS переменные
    document.documentElement.style.colorScheme = newScheme;
    console.log('Set style.colorScheme to:', newScheme);
  };

  // Возвращаем светлую тему по умолчанию до монтирования
  if (!mounted) {
    return { colorScheme: 'light', toggleColorScheme: () => {} };
  }

  return { colorScheme, toggleColorScheme };
} 