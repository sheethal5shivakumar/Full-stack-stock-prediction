'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';

export function Footer() {
  const { collapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <footer className="bg-[#1e1e1e] text-gray-400 py-8 border-t border-[#333]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-white mb-2">AI Crypto Research</h2>
              <p className="text-sm">
                Powered by advanced neural networks
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm mb-2">
                This application is for educational purposes only.
              </p>
              <p className="text-xs">
                &copy; {new Date().getFullYear()} AI Crypto Research. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  return (
    <footer 
      className="bg-[#1e1e1e] text-gray-400 py-8 border-t border-[#333] transition-all duration-300"
      style={{ paddingLeft: collapsed ? '4rem' : '16rem' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-white mb-2">AI Crypto Research</h2>
            <p className="text-sm">
              Powered by advanced neural networks
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm mb-2">
              This application is for educational purposes only.
            </p>
            <p className="text-xs">
              &copy; {new Date().getFullYear()} AI Crypto Research. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 