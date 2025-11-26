import { useCallback, useMemo } from 'react';
import { formatDateChilean } from '../utils/calendar';
import type { CalendarDay } from '../types';

export interface UseCalendarDayCellProps {
  day: CalendarDay;
  onSelect: (date: Date) => void;
}

export interface UseCalendarDayCellReturn {
  handleClick: () => void;
  dayNumber: number;
  ariaLabel: string;
}

/**
 * useCalendarDayCell Hook
 * Handles calendar day cell interactions and display logic
 */
export const useCalendarDayCell = ({
  day,
  onSelect,
}: UseCalendarDayCellProps): UseCalendarDayCellReturn => {
  const dayNumber = useMemo(() => day.date.getDate(), [day.date]);

  const ariaLabel = useMemo(() => {
    const formattedDate = formatDateChilean(day.date);

    const receiptCount = day.receipts.length;
    const receiptInfo =
      receiptCount === 0
        ? 'Sin boletas'
        : receiptCount === 1
          ? '1 boleta'
          : `${receiptCount} boletas`;

    return `${formattedDate}, ${receiptInfo}`;
  }, [day.date, day.receipts.length]);

  const handleClick = useCallback(() => {
    onSelect(day.date);
  }, [day.date, onSelect]);

  return {
    handleClick,
    dayNumber,
    ariaLabel,
  };
};
