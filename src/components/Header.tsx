import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Shield } from 'lucide-react';
import { CATEGORIES } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const currentCategory = new URLSearchParams(location.search).get('category') || 'all';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      {/* Top bar */}
      <div className="bg-red-700 dark:bg-red-900 text-white text-xs py-1.5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="font-semibold tracking-wide text-yellow-200">TRENDING NOW</span>
          <div className="flex items-center gap-3">
            <span className="text-gray-200 hidden sm:inline">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-yellow-200 hover:text-white transition-colors no-underline"
              title="Admin Panel"
            >
              <Shield size={12} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-10 h-10 bg-red-700 dark:bg-red-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">News Blitzz</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-widest uppercase">India's Leading News</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <nav className="flex items-center gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.id === 'all' ? '/' : `/?category=${cat.id}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors no-underline ${
                    currentCategory === cat.id
                      ? 'bg-red-700 dark:bg-red-800 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.id === 'all' ? '/' : `/?category=${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors no-underline ${
                  currentCategory === cat.id
                    ? 'bg-red-700 dark:bg-red-800 text-white'
                    : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
          <div className="max-w-7xl mx-auto px-4 pb-3">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400 no-underline"
            >
              <Shield size={14} />
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
