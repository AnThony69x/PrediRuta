'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  // Inicializar desde el DOM para evitar flash
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // Leer desde localStorage o DOM
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) return savedTheme;
      
      // Si no hay tema guardado, verificar si el DOM ya tiene la clase 'dark'
      if (document.documentElement.classList.contains('dark')) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    // Sincronizar con localStorage al montar (por si acaso)
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (!savedTheme) {
      // Si no hay tema guardado, guardar el actual
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return { theme, toggleTheme };
};