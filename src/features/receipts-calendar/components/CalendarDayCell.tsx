import React from 'react';
import { cn } from '@/lib/cn';
import { useCalendarDayCell } from '../hooks/useCalendarDayCell';
import type { CalendarDay, ReceiptCountLevel } from '../types';

export interface CalendarDayCellProps {
  day: CalendarDay;
  countLevel: ReceiptCountLevel;
  isSelected: boolean;
  onSelect: (date: Date) => void;
  className?: string;
}

/**
 * CalendarDayCell Component
 * Represents a single day in the calendar grid with visual receipt indicators
 */
export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  countLevel,
  isSelected,
  onSelect,
  className = '',
}) => {
  const { handleClick, dayNumber, ariaLabel } = useCalendarDayCell({
    day,
    onSelect,
  });

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn(
        // Layout
        'flex flex-col items-center justify-center',
        'p-1 sm:p-2',
        'min-h-12 sm:min-h-16',
        'w-full aspect-square sm:aspect-auto',

        // Border and shape
        'rounded-lg',

        // Base colors - current month vs other months
        day.isCurrentMonth
          ? 'text-primary-900'
          : 'text-neutral-400',

        // Background states
        isSelected
          ? 'bg-primary-600 text-white'
          : day.isCurrentMonth
            ? 'bg-white hover:bg-primary-50'
            : 'bg-neutral-50 hover:bg-neutral-100',

        // Today indicator
        day.isToday && !isSelected && 'ring-2 ring-primary-500 ring-inset',

        // Transitions
        'transition-all',

        // Cursor
        'cursor-pointer',

        className
      )}
    >
      {/* Day Number */}
      <span
        className={cn(
          'text-sm sm:text-base font-medium',
          isSelected && 'text-white'
        )}
      >
        {dayNumber}
      </span>

      {/* Receipt Indicators */}
      <ReceiptIndicator countLevel={countLevel} isSelected={isSelected} />
    </button>
  );
};

/**
 * ReceiptIndicator Component
 * Displays visual dots based on receipt count level
 */
interface ReceiptIndicatorProps {
  countLevel: ReceiptCountLevel;
  isSelected: boolean;
}

const ReceiptIndicator: React.FC<ReceiptIndicatorProps> = ({
  countLevel,
  isSelected,
}) => {
  if (countLevel === 'none') {
    return null;
  }

  const dotColor = isSelected
    ? 'bg-white'
    : 'bg-primary-500';

  return (
    <div className="flex items-center gap-0.5 mt-1">
      {countLevel === 'low' && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
      )}

      {countLevel === 'medium' && (
        <>
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
        </>
      )}

      {countLevel === 'high' && (
        <div className="flex items-center gap-0.5">
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
          <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
        </div>
      )}
    </div>
  );
};
