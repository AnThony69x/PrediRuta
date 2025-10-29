'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button';

// Estilos CSS para el botón de ayuda
const helpButtonStyles = `
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
`;

interface AccessibilitySettings {
  // Content adjustments
  readableFont: boolean;
  dyslexiaFont: boolean;
  highlightHeadings: boolean;
  highlightLinks: boolean;
  highlightButtons: boolean;
  hideImages: boolean;
  tooltips: boolean;
  stopAnimations: boolean;
  
  // Color adjustments
  darkContrast: boolean;
  lightContrast: boolean;
  invertColors: boolean;
  changeColors: boolean;
  highContrast: boolean;
  highSaturation: boolean;
  lowSaturation: boolean;
  monochrome: boolean;
  accessibilityDarkMode: boolean; // Nuevo: modo oscuro específico de accesibilidad
  
  // Orientation adjustments
  readingGuide: boolean;
  readingMask: boolean;
  bigBlackCursor: boolean;
  bigWhiteCursor: boolean;
  
  // Text adjustments
  textSize: 'small' | 'medium' | 'large';
  lineHeight: 'small' | 'medium' | 'large';
  textSpacing: 'small' | 'medium' | 'large';
}

interface AccessibilityProfile {
  name: string;
  icon: string;
  settings: Partial<AccessibilitySettings>;
}

const ACCESSIBILITY_PROFILES: AccessibilityProfile[] = [
  {
    name: 'Impedimento visual',
    icon: '👁️',
    settings: {
      readableFont: true,
      textSize: 'large',
      lineHeight: 'large',
      highContrast: true,
      highlightLinks: true,
      accessibilityDarkMode: true,
    }
  },
  {
    name: 'Convulsiones y epilepsia',
    icon: '⚡',
    settings: {
      stopAnimations: true,
      lowSaturation: true,
      hideImages: true,
      accessibilityDarkMode: true,
    }
  },
  {
    name: 'Deficiencia de visión de colores',
    icon: '🔴',
    settings: {
      changeColors: true,
      highlightLinks: true,
      highlightButtons: true,
      highContrast: true,
    }
  },
  {
    name: 'ADHD',
    icon: '🎯',
    settings: {
      readingMask: true,
      highlightHeadings: true,
      stopAnimations: true,
      accessibilityDarkMode: true,
    }
  },
  {
    name: 'Dislexia',
    icon: '📚',
    settings: {
      dyslexiaFont: true,
      textSpacing: 'large',
      lineHeight: 'large',
      readingGuide: true,
    }
  },
  {
    name: 'Aprendizaje',
    icon: '🧠',
    settings: {
      readableFont: true,
      highlightHeadings: true,
      tooltips: true,
      textSize: 'large',
    }
  }
];

const DEFAULT_SETTINGS: AccessibilitySettings = {
  readableFont: false,
  dyslexiaFont: false,
  highlightHeadings: false,
  highlightLinks: false,
  highlightButtons: false,
  hideImages: false,
  tooltips: false,
  stopAnimations: false,
  darkContrast: false,
  lightContrast: false,
  invertColors: false,
  changeColors: false,
  highContrast: false,
  highSaturation: false,
  lowSaturation: false,
  monochrome: false,
  accessibilityDarkMode: false,
  readingGuide: false,
  readingMask: false,
  bigBlackCursor: false,
  bigWhiteCursor: false,
  textSize: 'medium',
  lineHeight: 'medium',
  textSpacing: 'medium',
};

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState<'profiles' | 'content' | 'colors' | 'orientation'>('profiles');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
    }
  }, []);

  // Save settings to localStorage and apply changes
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  // Mouse tracking for reading guide and mask
  useEffect(() => {
    if (settings.readingGuide || settings.readingMask) {
      const handleMouseMove = (e: MouseEvent) => {
        if (settings.readingGuide) {
          const guide = document.querySelector('.reading-guide::before') as HTMLElement;
          if (guide) {
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
          }
        }
        
        if (settings.readingMask) {
          const mask = document.querySelector('.reading-mask::before') as HTMLElement;
          if (mask) {
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
          }
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [settings.readingGuide, settings.readingMask]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Reset all classes
    root.classList.remove(
      'readable-font', 'dyslexia-font', 'highlight-headings', 'highlight-links',
      'highlight-buttons', 'hide-images', 'tooltips-enabled', 'stop-animations',
      'dark-contrast', 'light-contrast', 'invert-colors', 'change-colors',
      'high-contrast', 'high-saturation', 'low-saturation', 'monochrome',
      'accessibility-dark-mode', 'reading-guide', 'reading-mask', 'big-black-cursor', 'big-white-cursor',
      'text-small', 'text-medium', 'text-large',
      'line-height-small', 'line-height-medium', 'line-height-large',
      'spacing-small', 'spacing-medium', 'spacing-large'
    );

    // Apply content adjustments
    if (newSettings.readableFont) root.classList.add('readable-font');
    if (newSettings.dyslexiaFont) root.classList.add('dyslexia-font');
    if (newSettings.highlightHeadings) root.classList.add('highlight-headings');
    if (newSettings.highlightLinks) root.classList.add('highlight-links');
    if (newSettings.highlightButtons) root.classList.add('highlight-buttons');
    if (newSettings.hideImages) root.classList.add('hide-images');
    if (newSettings.tooltips) root.classList.add('tooltips-enabled');
    if (newSettings.stopAnimations) root.classList.add('stop-animations');

    // Apply color adjustments
    if (newSettings.darkContrast) root.classList.add('dark-contrast');
    if (newSettings.lightContrast) root.classList.add('light-contrast');
    if (newSettings.invertColors) root.classList.add('invert-colors');
    if (newSettings.changeColors) root.classList.add('change-colors');
    if (newSettings.highContrast) root.classList.add('high-contrast');
    if (newSettings.highSaturation) root.classList.add('high-saturation');
    if (newSettings.lowSaturation) root.classList.add('low-saturation');
    if (newSettings.monochrome) root.classList.add('monochrome');
    if (newSettings.accessibilityDarkMode) {
      root.classList.add('accessibility-dark-mode');
      // También aplicar la clase dark de Tailwind para compatibilidad
      root.classList.add('dark');
    } else {
      // Solo remover si no está activo
      root.classList.remove('dark');
    }

    // Apply orientation adjustments
    if (newSettings.readingGuide) root.classList.add('reading-guide');
    if (newSettings.readingMask) root.classList.add('reading-mask');
    if (newSettings.bigBlackCursor) root.classList.add('big-black-cursor');
    if (newSettings.bigWhiteCursor) root.classList.add('big-white-cursor');

    // Apply text adjustments - only if NOT default (medium)
    // This allows the app's default Inter font to work without interference
    if (newSettings.textSize !== 'medium') {
      root.classList.add(`text-${newSettings.textSize}`);
    }
    if (newSettings.lineHeight !== 'medium') {
      root.classList.add(`line-height-${newSettings.lineHeight}`);
    }
    if (newSettings.textSpacing !== 'medium') {
      root.classList.add(`spacing-${newSettings.textSpacing}`);
    }
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyProfile = (profile: AccessibilityProfile) => {
    setSettings(prev => ({ ...prev, ...profile.settings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Estilos CSS para el botón de ayuda */}
      <style jsx>{helpButtonStyles}</style>
      
      {/* Bottom Right Toggle Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center pulse"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir ayuda y configuración de accesibilidad"
      >
        {/* Icono de silla de ruedas */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300"
        >
          {/* Persona/Cabeza */}
          <circle 
            cx="16" 
            cy="4" 
            r="2" 
            fill="currentColor"
          />
          {/* Cuerpo */}
          <path 
            d="M14 7.5h3.5l.5 6h-2" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          {/* Rueda grande */}
          <circle 
            cx="10" 
            cy="17" 
            r="5" 
            stroke="currentColor" 
            strokeWidth="1.5"
            fill="none"
          />
          {/* Centro de la rueda */}
          <circle 
            cx="10" 
            cy="17" 
            r="1" 
            fill="currentColor"
          />
          {/* Radio de la rueda */}
          <line 
            x1="10" 
            y1="17" 
            x2="13.5" 
            y2="14.5" 
            stroke="currentColor" 
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Conexión del cuerpo a la rueda */}
          <path 
            d="M14 13.5L10 17" 
            stroke="currentColor" 
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Rueda pequeña delantera */}
          <circle 
            cx="17" 
            cy="19.5" 
            r="1.5" 
            fill="currentColor"
          />
          {/* Conexión a rueda delantera */}
          <path 
            d="M16 13.5L17 18" 
            stroke="currentColor" 
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998] bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeWidget}
        />
      )}

      {/* Side Panel */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto accessibility-menu">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Accesibilidad</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="flex items-center gap-1 px-3 py-1 text-sm"
                >
                  🔄 Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={closeWidget}
                  className="flex items-center justify-center w-8 h-8 p-0 text-sm"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-col gap-2 mb-6">
              {[
                { key: 'profiles', label: 'Perfiles', icon: '👤' },
                { key: 'content', label: 'Contenido', icon: '📝' },
                { key: 'colors', label: 'Colores', icon: '🎨' },
                { key: 'orientation', label: 'Orientación', icon: '🧭' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === tab.key
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveSection(tab.key as any)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-4">
              {activeSection === 'profiles' && (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Perfiles de Accesibilidad</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {ACCESSIBILITY_PROFILES.map((profile) => (
                      <button
                        key={profile.name}
                        className="p-4 text-left border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => applyProfile(profile)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{profile.icon}</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{profile.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'content' && (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Ajustes de Contenido</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: 'readableFont' as keyof AccessibilitySettings, label: 'Fuente legible', icon: 'A' },
                      { key: 'dyslexiaFont' as keyof AccessibilitySettings, label: 'Fuente dislexia', icon: 'Aa' },
                      { key: 'highlightHeadings' as keyof AccessibilitySettings, label: 'Resaltar títulos', icon: 'H' },
                      { key: 'highlightLinks' as keyof AccessibilitySettings, label: 'Resaltar enlaces', icon: '🔗' },
                      { key: 'highlightButtons' as keyof AccessibilitySettings, label: 'Resaltar botones', icon: '⭕' },
                      { key: 'hideImages' as keyof AccessibilitySettings, label: 'Ocultar imágenes', icon: '🖼️' },
                      { key: 'tooltips' as keyof AccessibilitySettings, label: 'Tooltips', icon: '💭' },
                      { key: 'stopAnimations' as keyof AccessibilitySettings, label: 'Sin animaciones', icon: '⏸️' },
                    ].map((option) => (
                      <button
                        key={option.key}
                        className={`accessibility-option p-3 border rounded-lg text-left transition-colors ${
                          settings[option.key] 
                            ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 active' 
                            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => toggleSetting(option.key)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Text Size Controls */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Tamaño de texto</label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            className={`px-4 py-2 border rounded transition-colors text-sm ${
                              settings.textSize === size
                                ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 text-gray-900 dark:text-gray-100'
                                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}
                            onClick={() => updateSetting('textSize', size)}
                          >
                            {size === 'small' ? '+' : size === 'medium' ? '++' : '+++'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Altura de línea</label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((height) => (
                          <button
                            key={height}
                            className={`px-4 py-2 border rounded transition-colors text-sm ${
                              settings.lineHeight === height
                                ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 text-gray-900 dark:text-gray-100'
                                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}
                            onClick={() => updateSetting('lineHeight', height)}
                          >
                            {height === 'small' ? '+' : height === 'medium' ? '++' : '+++'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Espaciado</label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((spacing) => (
                          <button
                            key={spacing}
                            className={`px-4 py-2 border rounded transition-colors text-sm ${
                              settings.textSpacing === spacing
                                ? 'bg-blue-100 border-blue-300'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => updateSetting('textSpacing', spacing)}
                          >
                            {spacing === 'small' ? '+' : spacing === 'medium' ? '++' : '+++'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'colors' && (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Ajustes de Color</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: 'accessibilityDarkMode' as keyof AccessibilitySettings, label: 'Modo oscuro global', icon: '🌚' },
                      { key: 'darkContrast' as keyof AccessibilitySettings, label: 'Contraste oscuro', icon: '🌙' },
                      { key: 'lightContrast' as keyof AccessibilitySettings, label: 'Contraste claro', icon: '☀️' },
                      { key: 'invertColors' as keyof AccessibilitySettings, label: 'Invertir colores', icon: '⚫' },
                      { key: 'changeColors' as keyof AccessibilitySettings, label: 'Cambiar colores', icon: '🎨' },
                      { key: 'highContrast' as keyof AccessibilitySettings, label: 'Alto contraste', icon: '⚫' },
                      { key: 'highSaturation' as keyof AccessibilitySettings, label: 'Alta saturación', icon: '♦️' },
                      { key: 'lowSaturation' as keyof AccessibilitySettings, label: 'Baja saturación', icon: '💧' },
                      { key: 'monochrome' as keyof AccessibilitySettings, label: 'Monocromo', icon: '♠️' },
                    ].map((option) => (
                      <button
                        key={option.key}
                        className={`accessibility-option p-3 border rounded-lg text-left transition-colors ${
                          settings[option.key] 
                            ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 active' 
                            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => toggleSetting(option.key)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'orientation' && (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Ajustes de Orientación</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: 'readingGuide' as keyof AccessibilitySettings, label: 'Guía de lectura', icon: '—' },
                      { key: 'readingMask' as keyof AccessibilitySettings, label: 'Máscara de lectura', icon: '🔳' },
                      { key: 'bigBlackCursor' as keyof AccessibilitySettings, label: 'Cursor grande negro', icon: '↖️' },
                      { key: 'bigWhiteCursor' as keyof AccessibilitySettings, label: 'Cursor grande blanco', icon: '↗️' },
                    ].map((option) => (
                      <button
                        key={option.key}
                        className={`accessibility-option p-3 border rounded-lg text-left transition-colors ${
                          settings[option.key] 
                            ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 active' 
                            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => toggleSetting(option.key)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}