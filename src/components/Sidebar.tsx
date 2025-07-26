'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSidebar } from '@/context/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { collapsed, setCollapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);

  // Check if user has admin role
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render client-side to prevent hydration mismatch
  if (!mounted) return null;

  // Basic navigation items for all users
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'About',
      href: '/about',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // Items for authenticated users at the top
  const authenticatedItems = [];
  
  if (session) {
    authenticatedItems.push(
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        )
      },
      {
        name: 'Crypto Predictor',
        href: '/crypto-predictor',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        )
      }
    );
  }

  // Admin section items
  const adminItems = [
    {
      name: 'User Management',
      href: '/admin/users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    }
  ];

  return (
    <aside 
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#1e1e1e] border-r border-[#333] transition-all duration-300 z-40"
      style={{ width: collapsed ? '4rem' : '16rem' }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-end">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#333] transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* Authenticated items first */}
          {session && authenticatedItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-[#333] hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
          
          {/* Basic navigation items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-[#333] hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
          
          {/* Admin section */}
          {isAdmin && (
            <>
              <div className={`mt-6 mb-2 ${collapsed ? 'px-0 text-center' : 'px-3'}`}>
                <div className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                  collapsed ? 'border-t border-[#333] pt-2' : ''
                }`}>
                  {!collapsed && 'Admin'}
                </div>
              </div>
              
              {adminItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-900 text-white'
                        : 'text-purple-300 hover:bg-[#333] hover:text-purple-200'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
} 