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
  accessibilityDarkMode: boolean;
  
  // Orientation adjustments
  readingGuide: boolean;
  readingMask: boolean;
  bigBlackCursor: boolean;
  bigWhiteCursor: boolean;
  
  // Motor adjustments (Nuevo: Accesibilidad Motriz)
  keyboardNavigation: boolean;
  largeButtons: boolean;
  customKeyboardShortcuts: boolean;
  voiceControl: boolean;
  blockAutoScroll: boolean;
  visibleFocus: boolean;
  
  // Text adjustments
  textSize: 'small' | 'medium' | 'large';
  lineHeight: 'small' | 'medium' | 'large';
  textSpacing: 'small' | 'medium' | 'large';
  buttonSize: 'small' | 'medium' | 'large';
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
  keyboardNavigation: false,
  largeButtons: false,
  customKeyboardShortcuts: false,
  voiceControl: false,
  blockAutoScroll: false,
  visibleFocus: false,
  textSize: 'medium',
  lineHeight: 'medium',
  textSpacing: 'medium',
  buttonSize: 'medium',
};

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState<'profiles' | 'content' | 'colors' | 'orientation'>('profiles');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set()); // Todos los acordeones cerrados por defecto

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

  // Block autoplay when blockAutoScroll is enabled
  useEffect(() => {
    if (settings.blockAutoScroll) {
      // Detener videos con autoplay
      const videos = document.querySelectorAll('video[autoplay]');
      videos.forEach(video => {
        (video as HTMLVideoElement).pause();
        video.removeAttribute('autoplay');
      });

      // Prevenir scroll automático
      const preventAutoScroll = (e: Event) => {
        if ((e.target as HTMLElement).hasAttribute('data-autoscroll')) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener('scroll', preventAutoScroll, { passive: false });
      return () => window.removeEventListener('scroll', preventAutoScroll);
    }
  }, [settings.blockAutoScroll]);

  // Keyboard navigation enhancement
  useEffect(() => {
    if (settings.keyboardNavigation) {
      const handleKeyPress = (e: KeyboardEvent) => {
        // Esc para cerrar modales o menús
        if (e.key === 'Escape' && isOpen) {
          closeWidget();
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [settings.keyboardNavigation, isOpen]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Reset all classes
    root.classList.remove(
      'readable-font', 'dyslexia-font', 'highlight-headings', 'highlight-links',
      'highlight-buttons', 'hide-images', 'tooltips-enabled', 'stop-animations',
      'dark-contrast', 'light-contrast', 'invert-colors', 'change-colors',
      'high-contrast', 'high-saturation', 'low-saturation', 'monochrome',
      'accessibility-dark-mode', 'reading-guide', 'reading-mask', 'big-black-cursor', 'big-white-cursor',
      'keyboard-navigation', 'large-buttons', 'custom-shortcuts', 'voice-control', 'block-auto-scroll', 'visible-focus',
      'text-small', 'text-medium', 'text-large',
      'line-height-small', 'line-height-medium', 'line-height-large',
      'spacing-small', 'spacing-medium', 'spacing-large',
      'button-small', 'button-medium', 'button-large'
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
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply orientation adjustments
    if (newSettings.readingGuide) root.classList.add('reading-guide');
    if (newSettings.readingMask) root.classList.add('reading-mask');
    if (newSettings.bigBlackCursor) root.classList.add('big-black-cursor');
    if (newSettings.bigWhiteCursor) root.classList.add('big-white-cursor');

    // Apply motor adjustments
    if (newSettings.keyboardNavigation) root.classList.add('keyboard-navigation');
    if (newSettings.largeButtons) root.classList.add('large-buttons');
    if (newSettings.customKeyboardShortcuts) root.classList.add('custom-shortcuts');
    if (newSettings.voiceControl) root.classList.add('voice-control');
    if (newSettings.blockAutoScroll) root.classList.add('block-auto-scroll');
    if (newSettings.visibleFocus) root.classList.add('visible-focus');

    // Apply text adjustments
    if (newSettings.textSize !== 'medium') {
      root.classList.add(`text-${newSettings.textSize}`);
    }
    if (newSettings.lineHeight !== 'medium') {
      root.classList.add(`line-height-${newSettings.lineHeight}`);
    }
    if (newSettings.textSpacing !== 'medium') {
      root.classList.add(`spacing-${newSettings.textSpacing}`);
    }
    if (newSettings.buttonSize !== 'medium') {
      root.classList.add(`button-${newSettings.buttonSize}`);
    }
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyProfile = (profile: AccessibilityProfile) => {
    // Verificar si el perfil ya está activo
    const isActive = Object.entries(profile.settings).every(
      ([key, value]) => settings[key as keyof AccessibilitySettings] === value
    );

    if (isActive) {
      // Si el perfil está activo, desactivar todas sus configuraciones
      const resetProfile: Partial<AccessibilitySettings> = {};
      Object.keys(profile.settings).forEach(key => {
        const settingKey = key as keyof AccessibilitySettings;
        const defaultValue = DEFAULT_SETTINGS[settingKey];
        resetProfile[settingKey] = defaultValue as any;
      });
      setSettings(prev => ({ ...prev, ...resetProfile }));
    } else {
      // Si no está activo, aplicar el perfil
      setSettings(prev => ({ ...prev, ...profile.settings }));
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const isProfileActive = (profile: AccessibilityProfile) => {
    return Object.entries(profile.settings).every(
      ([key, value]) => settings[key as keyof AccessibilitySettings] === value
    );
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
      <div className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
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
              {/* Encabezado: Accesibilidad Visual */}
              <div className="px-2 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300">👁️ ACCESIBILIDAD VISUAL</h3>
              </div>

              {/* Sección: Perfiles */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  onClick={() => toggleSection('profiles')}
                >
                  <span className="text-gray-900 dark:text-gray-100">👤 Perfiles</span>
                  <span className={`transform transition-transform duration-200 ${expandedSections.has('profiles') ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedSections.has('profiles') && (
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Perfiles de Accesibilidad</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {ACCESSIBILITY_PROFILES.map((profile) => {
                        const isActive = isProfileActive(profile);
                        return (
                          <button
                            key={profile.name}
                            className={`p-3 text-left border rounded-lg transition-all ${
                              isActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                            onClick={() => applyProfile(profile)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{profile.icon}</span>
                              <span className={`font-medium text-xs ${
                                isActive 
                                  ? 'text-blue-700 dark:text-blue-300' 
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {profile.name}
                              </span>
                              {isActive && (
                                <span className="ml-auto text-blue-500 dark:text-blue-400">✓</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sección: Contenido */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  onClick={() => toggleSection('content')}
                >
                  <span className="text-gray-900 dark:text-gray-100">📝 Contenido</span>
                  <span className={`transform transition-transform duration-200 ${expandedSections.has('content') ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedSections.has('content') && (
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Ajustes de Contenido</h3>
                    <div className="grid grid-cols-1 gap-2">
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
                          className={`accessibility-option p-2 border rounded-lg text-left transition-colors ${
                            settings[option.key] 
                              ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 active' 
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => toggleSetting(option.key)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{option.icon}</span>
                            <span className="font-medium text-xs text-gray-900 dark:text-gray-100">{option.label}</span>
                            {settings[option.key] && (
                              <span className="ml-auto text-blue-500 dark:text-blue-400">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Text Size Controls */}
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-2 text-gray-900 dark:text-gray-100">Tamaño de texto</label>
                        <div className="flex gap-2">
                          {['small', 'medium', 'large'].map((size) => (
                            <button
                              key={size}
                              className={`flex-1 px-3 py-2 border rounded transition-colors text-xs ${
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
                        <label className="block text-xs font-medium mb-2 text-gray-900 dark:text-gray-100">Altura de línea</label>
                        <div className="flex gap-2">
                          {['small', 'medium', 'large'].map((height) => (
                            <button
                              key={height}
                              className={`flex-1 px-3 py-2 border rounded transition-colors text-xs ${
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
                        <label className="block text-xs font-medium mb-2 text-gray-900 dark:text-gray-100">Espaciado</label>
                        <div className="flex gap-2">
                          {['small', 'medium', 'large'].map((spacing) => (
                            <button
                              key={spacing}
                              className={`flex-1 px-3 py-2 border rounded transition-colors text-xs ${
                                settings.textSpacing === spacing
                                  ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 text-gray-900 dark:text-gray-100'
                                  : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
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
              </div>

              {/* Sección: Colores */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  onClick={() => toggleSection('colors')}
                >
                  <span className="text-gray-900 dark:text-gray-100">🎨 Colores</span>
                  <span className={`transform transition-transform duration-200 ${expandedSections.has('colors') ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedSections.has('colors') && (
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Ajustes de Color</h3>
                    <div className="grid grid-cols-1 gap-2">
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
                          className={`accessibility-option p-2 border rounded-lg text-left transition-colors ${
                            settings[option.key] 
                              ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 active' 
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => toggleSetting(option.key)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{option.icon}</span>
                            <span className="font-medium text-xs text-gray-900 dark:text-gray-100">{option.label}</span>
                            {settings[option.key] && (
                              <span className="ml-auto text-blue-500 dark:text-blue-400">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sección: Orientación */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  onClick={() => toggleSection('orientation')}
                >
                  <span className="text-gray-900 dark:text-gray-100">🧭 Orientación</span>
                  <span className={`transform transition-transform duration-200 ${expandedSections.has('orientation') ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedSections.has('orientation') && (
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Ajustes de Orientación</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'readingGuide' as keyof AccessibilitySettings, label: 'Guía de lectura', icon: '—' },
                        { key: 'readingMask' as keyof AccessibilitySettings, label: 'Máscara de lectura', icon: '🔳' },
                        { key: 'bigBlackCursor' as keyof AccessibilitySettings, label: 'Cursor grande negro', icon: '↖️' },
                        { key: 'bigWhiteCursor' as keyof AccessibilitySettings, label: 'Cursor grande blanco', icon: '↗️' },
                      ].map((option) => (
                        <button
                          key={option.key}
                          className={`accessibility-option p-2 border rounded-lg text-left transition-colors ${
                            settings[option.key] 
                              ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700 active' 
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => toggleSetting(option.key)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{option.icon}</span>
                            <span className="font-medium text-xs text-gray-900 dark:text-gray-100">{option.label}</span>
                            {settings[option.key] && (
                              <span className="ml-auto text-blue-500 dark:text-blue-400">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Encabezado: Accesibilidad Motriz */}
              <div className="px-2 py-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg border-l-4 border-green-500 mt-4">
                <h3 className="text-sm font-bold text-green-700 dark:text-green-300">🖐️ ACCESIBILIDAD MOTRIZ</h3>
              </div>

              {/* Sección: Motriz */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  onClick={() => toggleSection('motor')}
                >
                  <span className="text-gray-900 dark:text-gray-100">⌨️ Controles Motrices</span>
                  <span className={`transform transition-transform duration-200 ${expandedSections.has('motor') ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedSections.has('motor') && (
                  <div className="p-4 bg-white dark:bg-gray-900">
                    <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Ajustes de Accesibilidad Motriz</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'keyboardNavigation' as keyof AccessibilitySettings, label: 'Navegación por teclado', icon: '⌨️', description: 'Tab, Enter, Esc' },
                        { key: 'visibleFocus' as keyof AccessibilitySettings, label: 'Foco visible', icon: '🎯', description: 'Resaltar elemento activo' },
                        { key: 'largeButtons' as keyof AccessibilitySettings, label: 'Botones grandes', icon: '🔘', description: 'Aumentar tamaño' },
                        { key: 'customKeyboardShortcuts' as keyof AccessibilitySettings, label: 'Atajos personalizados', icon: '⚡', description: 'Configurar teclas' },
                        { key: 'voiceControl' as keyof AccessibilitySettings, label: 'Control por voz', icon: '🎤', description: 'Dictado activado' },
                        { key: 'blockAutoScroll' as keyof AccessibilitySettings, label: 'Bloquear auto-scroll', icon: '⏸️', description: 'Pausar movimiento' },
                      ].map((option) => (
                        <button
                          key={option.key}
                          className={`accessibility-option p-3 border rounded-lg text-left transition-colors ${
                            settings[option.key] 
                              ? 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700 active' 
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => toggleSetting(option.key)}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg mt-0.5">{option.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-xs text-gray-900 dark:text-gray-100">{option.label}</span>
                                {settings[option.key] && (
                                  <span className="text-green-500 dark:text-green-400">✓</span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">{option.description}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Button Size Controls */}
                    <div className="mt-4">
                      <label className="block text-xs font-medium mb-2 text-gray-900 dark:text-gray-100">Tamaño de botones</label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            className={`flex-1 px-3 py-2 border rounded transition-colors text-xs ${
                              settings.buttonSize === size
                                ? 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700 text-gray-900 dark:text-gray-100'
                                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}
                            onClick={() => updateSetting('buttonSize', size)}
                          >
                            {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Ajusta el tamaño de todos los botones interactivos</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}