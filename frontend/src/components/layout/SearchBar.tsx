'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atajo de teclado Ctrl/Cmd + K para enfocar búsqueda
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      // ESC para cerrar
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    
    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    // TODO: Integrar con API de geocodificación (TomTom Search API / Nominatim)
    // Simulación de resultados por ahora
    const mockResults: SearchResult[] = [
      { id: '1', title: 'Madrid, España', description: 'Capital de España', url: '/dashboard?city=madrid' },
      { id: '2', title: 'Barcelona, España', description: 'Cataluña', url: '/dashboard?city=barcelona' },
      { id: '3', title: 'Dashboard de Tráfico', description: 'Ver mapa de tráfico', url: '/dashboard' },
      { id: '4', title: 'Predicciones', description: 'Predicciones de tráfico', url: '/predicciones' },
    ].filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.description?.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(mockResults);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" 
          aria-hidden="true"
        />
        
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Buscar destino, ruta... (Ctrl+K)"
          className="
            w-full pl-10 pr-10 py-2 
            bg-white/90 dark:bg-gray-800/90 
            border border-white/20 dark:border-gray-700
            rounded-full
            focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-blue-500/50
            text-sm text-gray-900 dark:text-gray-100
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            transition-all
          "
          aria-label="Buscar destino o ruta"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className="
            absolute top-full mt-2 w-full 
            bg-white dark:bg-gray-800 
            rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
            max-h-80 overflow-y-auto
            z-50
          "
        >
          {suggestions.map((item) => (
            <a
              key={item.id}
              href={item.url}
              role="option"
              className="
                block px-4 py-3 
                hover:bg-gray-100 dark:hover:bg-gray-700 
                border-b border-gray-100 dark:border-gray-700 last:border-b-0
                transition-colors
                focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700
              "
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div className="flex items-start gap-3">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && query.length >= 2 && suggestions.length === 0 && (
        <div 
          className="
            absolute top-full mt-2 w-full 
            bg-white dark:bg-gray-800 
            rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
            px-4 py-6 text-center
            z-50
          "
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No se encontraron resultados para "{query}"
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {/* TODO: Integrar búsqueda real con TomTom Search API */}
            Intenta con otra búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
