"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function NavBar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Only show client-side elements after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    if (!profileMenuOpen) return;
    
    const handleClickOutside = () => {
      setProfileMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <header className="bg-[#1e1e1e] shadow-md fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95 text-white border-b border-[#333] h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/globe.svg" alt="Logo" width={32} height={32} />
              <span className="ml-2 font-bold text-xl text-white">AI Crypto</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          {mounted && session && (
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
          
          {/* Show loading state during server rendering or when status is loading */}
          {(!mounted || status === "loading") ? (
            <div className="animate-pulse bg-[#333] h-8 w-20 rounded-lg"></div>
          ) : (
            <div className="flex items-center space-x-3">
              {session ? (
                <div className="flex items-center space-x-4">
                  {/* User profile dropdown */}
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 bg-[#252525] p-1.5 rounded-full text-white hover:bg-[#333] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-[#1e1e1e]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileMenuOpen(!profileMenuOpen);
                      }}
                    >
                      {session.user?.image ? (
                        <Image 
                          src={session.user.image} 
                          alt="Profile" 
                          className="h-8 w-8 rounded-full border border-[#444]"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="font-medium text-sm">
                            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                      <span className="hidden md:inline-block text-sm font-medium mr-1">
                        {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
                      </span>
                      <svg className="h-4 w-4 text-gray-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Profile dropdown menu */}
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#333] rounded-lg shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b border-[#333]">
                          <p className="text-sm font-medium text-white truncate">
                            {session.user?.name || session.user?.email}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {session.user?.email}
                          </p>
                          {session.user?.role === "admin" && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-900 text-purple-200 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Desktop Navigation Links */}
                  <div className="hidden md:flex space-x-4">
                    <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-[#333] transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/crypto-predictor" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-[#333] transition-colors">
                      Crypto Predictor
                    </Link>
                    {session.user?.role === "admin" && (
                      <Link href="/admin/users" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-[#333] transition-colors">
                        Admin
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link href="/register" className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-transparent hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-[#1e1e1e] transition-all shadow-sm">
                    Register
                  </Link>
                  <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-[#1e1e1e] transition-all shadow-sm">
                    Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
        
        {/* Mobile menu - only render on client to prevent hydration mismatch */}
        {mounted && mobileMenuOpen && session && (
          <div className="md:hidden fixed top-16 right-0 left-0 bg-[#1e1e1e] border-b border-[#333] shadow-lg z-40">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#333] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/crypto-predictor" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#333] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Crypto Predictor
              </Link>
              {session.user?.role === "admin" && (
                <Link 
                  href="/admin/users" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-[#333] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
