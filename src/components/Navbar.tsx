'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Navbar() {
  const [mode, setMode] = useState<'detail' | 'simple'>('detail');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('care-mode') as 'detail' | 'simple';
    if (saved === 'simple' || saved === 'detail') {
      setMode(saved);
    }

    // Listen for storage change (if updated elsewhere, like home screen)
    const handleStorageChange = () => {
      const current = localStorage.getItem('care-mode') as 'detail' | 'simple';
      if (current === 'simple' || current === 'detail') {
        setMode(current);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event to listen to local changes in the same window
    window.addEventListener('careModeChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('careModeChanged', handleStorageChange);
    };
  }, []);

  const handleSetMode = (nextMode: 'detail' | 'simple') => {
    if (mode === nextMode) return;
    setMode(nextMode);
    localStorage.setItem('care-mode', nextMode);
    
    // Dispatch custom event so other components on the page react instantly
    window.dispatchEvent(new Event('careModeChanged'));

    // If we are on /transfer or /toileting, also update the URL query param for consistency
    const url = new URL(window.location.href);
    if (url.pathname === '/transfer' || url.pathname === '/toileting') {
      url.searchParams.set('mode', nextMode);
      window.history.pushState({}, '', url.toString());
      // Dispatch popstate or custom event so the page re-renders
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/80 backdrop-blur-md bg-white/95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-primary p-2 rounded-lg text-white group-hover:bg-primary-dark transition-colors duration-200">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                돌봄로봇 교육 및 자가평가
              </span>
            </Link>
          </div>

          {mounted && (
            <div className="flex items-center">
              <div className="bg-slate-100 p-0.5 flex rounded-full border border-slate-200/60 shadow-inner">
                <button
                  onClick={() => handleSetMode('detail')}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                    mode === 'detail'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  전문가 추천
                </button>
                <button
                  onClick={() => handleSetMode('simple')}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                    mode === 'simple'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  돌봄대상자 추천
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
