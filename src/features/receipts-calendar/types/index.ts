/**
 * Receipts Calendar Types
 * Type definitions for the receipts calendar feature
 */

import type { Receipt } from '@/features/receipts';

/**
 * Represents a single day in the calendar with receipt data
 */
export interface CalendarDay {
  date: Date;
  receipts: Receipt[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

/**
 * Aggregated data for a specific day
 */
export interface DayStats {
  count: number;
  total: number;
}

/**
 * Receipt count level for visual indicators
 */
export type ReceiptCountLevel = 'none' | 'low' | 'medium' | 'high';

/**
 * Calendar navigation state
 */
export interface CalendarState {
  currentMonth: Date;
  selectedDate: Date | null;
}

/**
 * Map of date strings to day statistics
 */
export type DayStatsMap = Map<string, DayStats>;
