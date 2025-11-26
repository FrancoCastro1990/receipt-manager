/**
 * Formatting utilities for consistent display across the application
 * Uses dynamic locale based on current i18n language setting
 */

import i18n from '@/lib/i18n';
import { LOCALE_CONFIG, type SupportedLocale } from '@/locales';

const getLocaleConfig = () => {
  const lang = (i18n.language || 'es') as SupportedLocale;
  return LOCALE_CONFIG[lang] || LOCALE_CONFIG.es;
};

export const formatCurrency = (amount: number): string => {
  const config = getLocaleConfig();
  return new Intl.NumberFormat(config.currencyLocale, {
    style: 'currency',
    currency: config.currency,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
