import type { DateRange, DateRangePreset } from '../types';

/**
 * Gets the start of a day (00:00:00.000)
 */
const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Gets the end of a day (23:59:59.999)
 */
const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Gets the Monday of the week for a given date
 */
const getMonday = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  // Adjust for Sunday being 0, Monday being 1, etc.
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return startOfDay(result);
};

/**
 * Gets the first day of the month for a given date
 */
const getFirstDayOfMonth = (date: Date): Date => {
  const result = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfDay(result);
};

/**
 * Gets the last day of the month for a given date
 */
const getLastDayOfMonth = (date: Date): Date => {
  const result = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endOfDay(result);
};

/**
 * Calculates a date range based on the given preset
 * @param preset - The date range preset to calculate
 * @param customRange - Optional custom range for 'custom' preset
 * @returns The calculated date range
 */
export const getDateRangeFromPreset = (
  preset: DateRangePreset,
  customRange?: DateRange
): DateRange => {
  const today = new Date();

  switch (preset) {
    case 'today':
      return {
        startDate: startOfDay(today),
        endDate: endOfDay(today),
      };

    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: startOfDay(yesterday),
        endDate: endOfDay(yesterday),
      };
    }

    case 'last7days': {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      return {
        startDate: startOfDay(sevenDaysAgo),
        endDate: endOfDay(today),
      };
    }

    case 'last30days': {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
      return {
        startDate: startOfDay(thirtyDaysAgo),
        endDate: endOfDay(today),
      };
    }

    case 'thisWeek':
      return {
        startDate: getMonday(today),
        endDate: endOfDay(today),
      };

    case 'thisMonth':
      return {
        startDate: getFirstDayOfMonth(today),
        endDate: endOfDay(today),
      };

    case 'lastMonth': {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return {
        startDate: getFirstDayOfMonth(lastMonth),
        endDate: getLastDayOfMonth(lastMonth),
      };
    }

    case 'custom':
      if (customRange) {
        return {
          startDate: startOfDay(customRange.startDate),
          endDate: endOfDay(customRange.endDate),
        };
      }
      // Fallback to thisMonth if no custom range provided
      return {
        startDate: getFirstDayOfMonth(today),
        endDate: endOfDay(today),
      };

    default:
      return {
        startDate: getFirstDayOfMonth(today),
        endDate: endOfDay(today),
      };
  }
};

/**
 * Checks if a date falls within a given date range
 * @param date - The date to check
 * @param range - The date range to check against
 * @returns True if the date is within the range (inclusive)
 */
export const isDateInRange = (date: Date, range: DateRange): boolean => {
  const timestamp = date.getTime();
  return timestamp >= range.startDate.getTime() && timestamp <= range.endDate.getTime();
};

/**
 * Returns the translation key for a date range preset label
 * @param preset - The date range preset
 * @returns Translation key string
 */
export const formatDateRangeLabel = (preset: DateRangePreset): string => {
  const labelKeys: Record<DateRangePreset, string> = {
    today: 'settings.dateRanges.today',
    yesterday: 'settings.dateRanges.yesterday',
    last7days: 'settings.dateRanges.last7days',
    last30days: 'settings.dateRanges.last30days',
    thisWeek: 'settings.dateRanges.thisWeek',
    thisMonth: 'settings.dateRanges.thisMonth',
    lastMonth: 'settings.dateRanges.lastMonth',
    custom: 'settings.dateRanges.custom',
  };

  return labelKeys[preset];
};
