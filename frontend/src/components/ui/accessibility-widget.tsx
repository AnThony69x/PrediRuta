'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button';

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
    }
  },
  {
    name: 'Convulsiones y epilepsia',
    icon: '⚡',
    settings: {
      stopAnimations: true,
      lowSaturation: true,
      hideImages: true,
    }
  },
  {
    name: 'Deficiencia de visión de colores',
    icon: '🔴',
    settings: {
      changeColors: true,
      highlightLinks: true,
      highlightButtons: true,
    }
  },
  {
    name: 'ADHD',
    icon: '🎯',
    settings: {
      readingMask: true,
      highlightHeadings: true,
      stopAnimations: true,
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
      'reading-guide', 'reading-mask', 'big-black-cursor', 'big-white-cursor',
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

    // Apply orientation adjustments
    if (newSettings.readingGuide) root.classList.add('reading-guide');
    if (newSettings.readingMask) root.classList.add('reading-mask');
    if (newSettings.bigBlackCursor) root.classList.add('big-black-cursor');
    if (newSettings.bigWhiteCursor) root.classList.add('big-white-cursor');

    // Apply text adjustments
    root.classList.add(`text-${newSettings.textSize}`);
    root.classList.add(`line-height-${newSettings.lineHeight}`);
    root.classList.add(`spacing-${newSettings.textSpacing}`);
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
      {/* Side Toggle Button */}
      <button
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg shadow-lg transition-all duration-300 hover:pl-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir configuración de accesibilidad"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9.5L12.5 8L10 10L8.5 11.5L7 10L4.5 11.5L3 10V12L4.5 13.5L6 12L7.5 13.5L9 12L10.5 13.5L12 12L13.5 13.5L15 12L16.5 13.5L18 12V14L16.5 15.5L15 14V16L21 16.5V14.5L18.5 13L21 11.5V9Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeWidget}
        />
      )}

      {/* Side Panel */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto accessibility-menu">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Accesibilidad</h2>
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
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                  <h3 className="text-lg font-medium mb-4">Perfiles de Accesibilidad</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {ACCESSIBILITY_PROFILES.map((profile) => (
                      <button
                        key={profile.name}
                        className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => applyProfile(profile)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{profile.icon}</span>
                          <span className="font-medium text-sm">{profile.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'content' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Ajustes de Contenido</h3>
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
                            ? 'bg-blue-100 border-blue-300 active' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleSetting(option.key)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Text Size Controls */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tamaño de texto</label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((size) => (
                          <button
                            key={size}
                            className={`px-4 py-2 border rounded transition-colors text-sm ${
                              settings.textSize === size
                                ? 'bg-blue-100 border-blue-300'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => updateSetting('textSize', size)}
                          >
                            {size === 'small' ? '+' : size === 'medium' ? '++' : '+++'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Altura de línea</label>
                      <div className="flex gap-2">
                        {['small', 'medium', 'large'].map((height) => (
                          <button
                            key={height}
                            className={`px-4 py-2 border rounded transition-colors text-sm ${
                              settings.lineHeight === height
                                ? 'bg-blue-100 border-blue-300'
                                : 'hover:bg-gray-50'
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
                  <h3 className="text-lg font-medium mb-4">Ajustes de Color</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
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
                            ? 'bg-blue-100 border-blue-300 active' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleSetting(option.key)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'orientation' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Ajustes de Orientación</h3>
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
                            ? 'bg-blue-100 border-blue-300 active' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleSetting(option.key)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-sm">{option.label}</span>
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