import type { Receipt } from '@/features/receipts';
import i18n from '@/lib/i18n';
import { LOCALE_CONFIG, type SupportedLocale } from '@/locales';
import type {
  CalendarDay,
  DayStats,
  DayStatsMap,
  ReceiptCountLevel,
} from '../types';

/**
 * Gets the current locale for date formatting based on i18n language
 */
const getLocale = (): string => {
  const lang = (i18n.language || 'es') as SupportedLocale;
  return LOCALE_CONFIG[lang]?.dateLocale || 'es-CL';
};

/**
 * Returns the first day of the month
 */
export const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Returns the last day of the month
 */
export const getLastDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Converts Sunday-based day index (0-6) to Monday-based (0-6)
 * Sunday (0) becomes 6, Monday (1) becomes 0, etc.
 */
const getMondayBasedDayIndex = (sundayBasedIndex: number): number => {
  return sundayBasedIndex === 0 ? 6 : sundayBasedIndex - 1;
};

/**
 * Returns an array of calendar days for a month view
 * Includes days from previous/next months to fill the grid
 * Week starts on Monday (Chilean/ISO standard)
 */
export const getCalendarDays = (
  currentMonth: Date,
  receipts: Receipt[]
): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const firstDay = getFirstDayOfMonth(currentMonth);
  const lastDay = getLastDayOfMonth(currentMonth);

  // Get the day of week for the first day (Monday = 0, Sunday = 6)
  const startDayOfWeek = getMondayBasedDayIndex(firstDay.getDay());

  // Add days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDay);
    date.setDate(date.getDate() - i - 1);
    days.push(createCalendarDay(date, currentMonth, receipts));
  }

  // Add days of current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    days.push(createCalendarDay(date, currentMonth, receipts));
  }

  // Add days from next month to complete the grid (6 rows x 7 days = 42)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(lastDay);
    date.setDate(lastDay.getDate() + i);
    days.push(createCalendarDay(date, currentMonth, receipts));
  }

  return days;
};

/**
 * Creates a CalendarDay object
 */
const createCalendarDay = (
  date: Date,
  currentMonth: Date,
  receipts: Receipt[]
): CalendarDay => {
  const today = new Date();

  return {
    date,
    receipts: getReceiptsForDate(date, receipts),
    isCurrentMonth:
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear(),
    isToday:
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear(),
  };
};

/**
 * Filters receipts for a specific date
 */
export const getReceiptsForDate = (
  date: Date,
  receipts: Receipt[]
): Receipt[] => {
  return receipts.filter((receipt) => {
    const receiptDate = receipt.createdAt;
    return (
      receiptDate.getFullYear() === date.getFullYear() &&
      receiptDate.getMonth() === date.getMonth() &&
      receiptDate.getDate() === date.getDate()
    );
  });
};

/**
 * Creates a map of date strings to day statistics
 */
export const createDayStatsMap = (receipts: Receipt[]): DayStatsMap => {
  const map: DayStatsMap = new Map();

  receipts.forEach((receipt) => {
    const dateKey = formatDateKey(receipt.createdAt);
    const existing = map.get(dateKey) || { count: 0, total: 0 };

    map.set(dateKey, {
      count: existing.count + 1,
      total: existing.total + receipt.amount,
    });
  });

  return map;
};

/**
 * Formats a date to a consistent string key (YYYY-MM-DD)
 */
export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Gets the day stats for a specific date
 */
export const getDayStats = (
  date: Date,
  statsMap: DayStatsMap
): DayStats | null => {
  return statsMap.get(formatDateKey(date)) || null;
};

/**
 * Determines the receipt count level for visual indicators
 */
export const getReceiptCountLevel = (count: number): ReceiptCountLevel => {
  if (count === 0) return 'none';
  if (count <= 2) return 'low';
  if (count <= 5) return 'medium';
  return 'high';
};

/**
 * Returns the previous month
 */
export const getPreviousMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

/**
 * Returns the next month
 */
export const getNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

/**
 * Formats month and year for display using current locale
 */
export const formatMonthYear = (date: Date): string => {
  const formatted = date.toLocaleDateString(getLocale(), {
    month: 'long',
    year: 'numeric',
  });
  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Returns weekday headers (Monday first) using translations
 */
export const getWeekdayHeaders = (): string[] => {
  return [
    i18n.t('calendar.weekdays.mon'),
    i18n.t('calendar.weekdays.tue'),
    i18n.t('calendar.weekdays.wed'),
    i18n.t('calendar.weekdays.thu'),
    i18n.t('calendar.weekdays.fri'),
    i18n.t('calendar.weekdays.sat'),
    i18n.t('calendar.weekdays.sun'),
  ];
};

/**
 * Formats a date for display using current locale
 */
export const formatDateChilean = (date: Date): string => {
  const formatted = date.toLocaleDateString(getLocale(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Formats a short date for display using current locale
 */
export const formatShortDateChilean = (date: Date): string => {
  const formatted = date.toLocaleDateString(getLocale(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Formats time for display using current locale
 */
export const formatTimeChilean = (date: Date): string => {
  return date.toLocaleTimeString(getLocale(), {
    hour: '2-digit',
    minute: '2-digit',
  });
};
