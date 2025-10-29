'use client';

import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const dimensions = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link 
      href="/" 
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      aria-label="PrediRuta - Ir a inicio"
    >
      {/* Placeholder para logo - Usuario debe proveer imagen */}
      <div 
        className={`${dimensions[size]} w-auto flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1`}
        aria-hidden="true"
      >
        <span className="font-bold text-white text-sm">PR 2.0</span>
      </div>
      
      {showText && (
        <span className={`${textSize[size]} font-bold text-white`}>
          PrediRuta
        </span>
      )}
    </Link>
  );
}
