'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  user: any;
  token: string | null;
  currentPage: string;
  navigateToPage: (page: string) => void;
  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
}

export default function Header({ 
  user, 
  token, 
  currentPage, 
  navigateToPage, 
  setUser, 
  setToken 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigateToPage('main');
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserDropdownOpen && !(event.target as Element).closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">F</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">FullStack App</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
                    <button
                      onClick={() => navigateToPage('main')}
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPage === 'main' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      홈
                    </button>
                    <button
                      onClick={() => navigateToPage('posts')}
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPage === 'posts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      게시글
                    </button>
                    <button
                      onClick={() => navigateToPage('api')}
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPage === 'api' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      API
                    </button>
            </nav>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Dropdown */}
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:block font-medium">{user.username}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                          <div className="font-medium text-gray-900">{user.username}</div>
                          <div className="text-xs">{user.email}</div>
                        </div>
                        <button
                          onClick={() => {
                            alert('마이페이지는 준비 중입니다.');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          마이페이지
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
                  ) : (
                    <button
                      onClick={() => navigateToPage('auth')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === 'auth' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      로그인
                    </button>
                  )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        navigateToPage('main');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 text-left text-sm font-medium rounded-md ${
                        currentPage === 'main' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      홈
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('posts');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 text-left text-sm font-medium rounded-md ${
                        currentPage === 'posts' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      게시글
                    </button>
                    <button
                      onClick={() => {
                        navigateToPage('api');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 text-left text-sm font-medium rounded-md ${
                        currentPage === 'api' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      API
                    </button>
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-md">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert('마이페이지는 준비 중입니다.');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    마이페이지
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                      <button
                        onClick={() => {
                          navigateToPage('auth');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === 'auth' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        로그인
                      </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
