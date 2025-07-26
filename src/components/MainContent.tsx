'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { collapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="flex-grow pt-4 w-full mt-16">
        <div className="px-4 md:px-8 max-w-full">
          {children}
        </div>
      </main>
    );
  }
  
  return (
    <main 
      className="flex-grow pt-4 w-full transition-all duration-300 mt-16"
      style={{ paddingLeft: collapsed ? '4rem' : '16rem' }}
    >
      <div className="px-4 md:px-8 max-w-full">
        {children}
      </div>
    </main>
  );
}