import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CalendarHeaderProps {
  formattedMonthYear: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  className?: string;
}

/**
 * CalendarHeader Component
 * Displays month/year title with navigation arrows and a "Today" button
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  formattedMonthYear,
  onPreviousMonth,
  onNextMonth,
  onToday,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        'p-4',
        'bg-white rounded-xl shadow-card',
        className
      )}
    >
      {/* Navigation Arrows and Month/Year Title */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onPreviousMonth}
          className={cn(
            'p-2',
            'text-neutral-600 hover:text-primary-700',
            'hover:bg-primary-50',
            'rounded-lg',
            'transition-all'
          )}
          aria-label={t('calendar.prevMonth')}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold text-primary-900 min-w-48 text-center">
          {formattedMonthYear}
        </h2>

        <button
          type="button"
          onClick={onNextMonth}
          className={cn(
            'p-2',
            'text-neutral-600 hover:text-primary-700',
            'hover:bg-primary-50',
            'rounded-lg',
            'transition-all'
          )}
          aria-label={t('calendar.nextMonth')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Today Button */}
      <button
        type="button"
        onClick={onToday}
        className={cn(
          'px-4 py-2',
          'text-sm font-medium',
          'text-primary-700 hover:text-white',
          'bg-primary-50 hover:bg-primary-600',
          'rounded-lg',
          'transition-all',
          'self-center sm:self-auto'
        )}
      >
        {t('calendar.today')}
      </button>
    </div>
  );
};
