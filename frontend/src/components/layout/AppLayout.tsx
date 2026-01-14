'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showBreadcrumbs?: boolean;
  showSidebar?: boolean;
  hideFooter?: boolean;
}

export function AppLayout({ 
  children, 
  showSearch = true, 
  showBreadcrumbs = true,
  showSidebar = true,
  hideFooter = false
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showSearch={showSearch}
        showBreadcrumbs={showBreadcrumbs}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1">
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
          className="flex-1 transition-all duration-300 flex flex-col"
          tabIndex={-1}
        >
          <div className="flex-1">
            {children}
          </div>
          {/* Footer */}
          {!hideFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}
