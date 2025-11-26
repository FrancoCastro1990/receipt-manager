import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  Receipt, Menu, X, Calendar, Globe, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getNavLinkClassName, isActiveLink } from '../utils/navigation';
import { cn } from '@/lib/cn';

export interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

interface NavLinkItem {
  to: string;
  labelKey: 'nav.home' | 'nav.receipts' | 'nav.calendar' | 'nav.settings';
  icon: React.ReactNode;
}

/**
 * Layout Component
 * Main navigation layout for the Receipt Manager application.
 * Provides a responsive header with navigation links, language selector, and a main content area.
 */
export const Layout: React.FC<LayoutProps> = ({ className = "", children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navLinks: NavLinkItem[] = [
    //{ to: "/", labelKey: "nav.home", icon: <Home className="h-4 w-4" /> },
    { to: "/receipts", labelKey: "nav.receipts", icon: <Receipt className="h-4 w-4" /> },
    { to: "/calendar", labelKey: "nav.calendar", icon: <Calendar className="h-4 w-4" /> },
    { to: "/settings", labelKey: "nav.settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };

  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Receipt className="h-8 w-8" />
              <span className="text-xl font-bold">{t('app.name')}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={getNavLinkClassName(isActiveLink(location.pathname, link.to))}
                >
                  {link.icon}
                  <span>{t(link.labelKey)}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Language Selector */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label={t('languageSelector.label')}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium uppercase">{i18n.language === 'es' ? 'EN' : 'ES'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 hover:backdrop-blur-sm transition-all duration-200"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-white/20">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getNavLinkClassName(isActiveLink(location.pathname, link.to), true)}
                >
                  {link.icon}
                  <span>{t(link.labelKey)}</span>
                </Link>
              ))}
              {/* Mobile Language Selector */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label={t('languageSelector.label')}
              >
                <Globe className="h-4 w-4" />
                <span>{i18n.language === 'es' ? 'English' : 'Espanol'}</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
