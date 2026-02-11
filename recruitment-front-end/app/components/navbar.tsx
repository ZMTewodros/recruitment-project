'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface JwtPayload {
  userId: number;
  role: string;
}

/**
 * Lightweight JWT parser
 * Avoids external dependencies and ESM/CommonJS issues
 */
function parseJwt<T = unknown>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(
      decoded
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    )) as T;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /**
   * Initialize auth + theme on mount
   */
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const syncState = () => {
      const token = localStorage.getItem('token');

      if (token) {
        setIsLoggedIn(true);
        const decoded = parseJwt<JwtPayload>(token);
        setIsAdmin(decoded?.role?.toLowerCase() === 'admin');
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }

      const storedTheme = localStorage.getItem('dark');
      if (storedTheme !== null) {
        setDarkMode(storedTheme === 'true');
      } else {
        setDarkMode(
          window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
        );
      }
    };

    syncState();

    window.addEventListener('storage', syncState);
    window.addEventListener('token-changed', syncState);

    return () => {
      window.removeEventListener('storage', syncState);
      window.removeEventListener('token-changed', syncState);
    };
  }, []);

  /**
   * Persist and apply theme
   */
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('dark', String(darkMode));
  }, [darkMode, mounted]);

  function logout() {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('token-changed'));
    window.location.href = '/login';
  }

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold">
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Job Marketplace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/jobs">Jobs</Link>

          {isAdmin && (
            <Link href="/admin" className="font-medium text-indigo-600">
              Admin
            </Link>
          )}

          {!isLoggedIn ? (
            <Link href="/auth/register">Register</Link>
          ) : (
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 bg-white dark:bg-gray-900 border-t">
          <Link href="/music">Music</Link>

          {isAdmin && <Link href="/admin">Admin</Link>}

          {!isLoggedIn ? (
            <Link href="/login">Login</Link>
          ) : (
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          )}

          <button onClick={() => setDarkMode((v) => !v)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </header>
  );
}
