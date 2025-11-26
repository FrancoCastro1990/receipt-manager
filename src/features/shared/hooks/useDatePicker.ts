import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { es, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';

export interface UseDatePickerReturn {
  locale: Locale;
  dateFormat: string;
}

/**
 * Hook to get locale-aware date picker configuration
 * Returns the appropriate date-fns locale based on current i18n language
 */
export const useDatePicker = (): UseDatePickerReturn => {
  const { i18n } = useTranslation();

  const locale = useMemo((): Locale => {
    return i18n.language === 'en' ? enUS : es;
  }, [i18n.language]);

  return {
    locale,
    dateFormat: 'dd/MM/yyyy',
  };
};
