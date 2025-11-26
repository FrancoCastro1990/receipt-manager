import React from 'react';
import { cn } from '@/lib/cn';
import { CalendarDayCell } from './CalendarDayCell';
import { formatDateKey, getReceiptCountLevel } from '../utils/calendar';
import type { CalendarDay, DayStatsMap } from '../types';

export interface CalendarGridProps {
  calendarDays: CalendarDay[];
  dayStatsMap: DayStatsMap;
  weekdayHeaders: string[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  className?: string;
}

/**
 * CalendarGrid Component
 * Renders the full calendar grid with weekday headers and day cells
 */
export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  dayStatsMap,
  weekdayHeaders,
  selectedDate,
  onSelectDate,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-card',
        'p-2 sm:p-4',
        className
      )}
    >
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {weekdayHeaders.map((weekday) => (
          <div
            key={weekday}
            className={cn(
              'text-center',
              'text-xs sm:text-sm font-medium',
              'text-neutral-500',
              'py-2'
            )}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((day) => {
          const dateKey = formatDateKey(day.date);
          const stats = dayStatsMap.get(dateKey);
          const countLevel = getReceiptCountLevel(stats?.count || 0);

          const isSelected =
            selectedDate !== null &&
            day.date.getFullYear() === selectedDate.getFullYear() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getDate() === selectedDate.getDate();

          return (
            <CalendarDayCell
              key={dateKey}
              day={day}
              countLevel={countLevel}
              isSelected={isSelected}
              onSelect={onSelectDate}            />
          );
        })}
      </div>
    </div>
  );
};
