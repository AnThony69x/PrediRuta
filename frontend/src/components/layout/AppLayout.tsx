'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
  showSidebar?: boolean;
}

export function AppLayout({ 
  children, 
  showSearch = true, 
  showBreadcrumbs = true,
  showSidebar = true 
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showSearch={showSearch}
        showBreadcrumbs={showBreadcrumbs}
      />

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar 
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        {/* Main content */}
        <main 
          id="main-content" 
          className="flex-1 transition-all duration-300"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
