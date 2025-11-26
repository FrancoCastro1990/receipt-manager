import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MockReceiptsCalendarService } from '../services/ReceiptsCalendarService';
import { receiptsMonthQueryOptions } from '../queries/options';
import {
  getCalendarDays,
  createDayStatsMap,
  getPreviousMonth,
  getNextMonth,
  formatMonthYear,
  getWeekdayHeaders,
} from '../utils/calendar';
import type { Receipt } from '@/features/receipts';
import type { CalendarDay, CalendarState, DayStatsMap } from '../types';

export interface UseReceiptsCalendarReturn {
  calendarDays: CalendarDay[];
  dayStatsMap: DayStatsMap;
  currentMonth: Date;
  selectedDate: Date | null;
  selectedDateReceipts: Receipt[];
  formattedMonthYear: string;
  weekdayHeaders: string[];
  isLoading: boolean;
  error: Error | null;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  selectDate: (date: Date | null) => void;
}

/**
 * useReceiptsCalendar Hook
 * Main hook for receipts calendar feature - handles calendar state and data fetching
 */
export const useReceiptsCalendar = (): UseReceiptsCalendarReturn => {
  const service = useMemo(() => new MockReceiptsCalendarService(), []);

  const [calendarState, setCalendarState] = useState<CalendarState>({
    currentMonth: new Date(),
    selectedDate: null,
  });

  const { currentMonth, selectedDate } = calendarState;

  const {
    data: receipts = [],
    isLoading,
    error,
  } = useQuery(
    receiptsMonthQueryOptions(
      service,
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    )
  );

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth, receipts),
    [currentMonth, receipts]
  );

  const dayStatsMap = useMemo(() => createDayStatsMap(receipts), [receipts]);

  const selectedDateReceipts = useMemo(() => {
    if (!selectedDate) return [];
    const selectedDay = calendarDays.find(
      (day) =>
        day.date.getDate() === selectedDate.getDate() &&
        day.date.getMonth() === selectedDate.getMonth() &&
        day.date.getFullYear() === selectedDate.getFullYear()
    );
    return selectedDay?.receipts || [];
  }, [selectedDate, calendarDays]);

  const formattedMonthYear = useMemo(
    () => formatMonthYear(currentMonth),
    [currentMonth]
  );

  const goToPreviousMonth = useCallback(() => {
    setCalendarState((prev) => ({
      ...prev,
      currentMonth: getPreviousMonth(prev.currentMonth),
      selectedDate: null,
    }));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCalendarState((prev) => ({
      ...prev,
      currentMonth: getNextMonth(prev.currentMonth),
      selectedDate: null,
    }));
  }, []);

  const goToToday = useCallback(() => {
    setCalendarState({
      currentMonth: new Date(),
      selectedDate: new Date(),
    });
  }, []);

  const selectDate = useCallback((date: Date | null) => {
    setCalendarState((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  }, []);

  return {
    calendarDays,
    dayStatsMap,
    currentMonth,
    selectedDate,
    selectedDateReceipts,
    formattedMonthYear,
    weekdayHeaders: getWeekdayHeaders(),
    isLoading,
    error: error ?? null,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDate,
  };
};
