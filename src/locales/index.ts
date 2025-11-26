export type SupportedLocale = 'es' | 'en';

export const LOCALE_CONFIG: Record<SupportedLocale, {
  currency: string;
  currencyLocale: string;
  dateLocale: string;
}> = {
  es: {
    currency: 'CLP',
    currencyLocale: 'es-CL',
    dateLocale: 'es-CL',
  },
  en: {
    currency: 'USD',
    currencyLocale: 'en-US',
    dateLocale: 'en-US',
  },
};

export const DEFAULT_LOCALE: SupportedLocale = 'es';
export const SUPPORTED_LOCALES: SupportedLocale[] = ['es', 'en'];
