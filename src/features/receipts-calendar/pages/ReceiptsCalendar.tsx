import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/features/shared';
import { useReceiptsCalendar } from '../hooks';
import {
  CalendarHeader,
  CalendarGrid,
  SelectedDayDetails,
} from '../components';

export interface ReceiptsCalendarProps {
  className?: string;
}

/**
 * ReceiptsCalendar Page
 * Displays a calendar view of receipts with daily counts and details
 */
export const ReceiptsCalendar: React.FC<ReceiptsCalendarProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const {
    calendarDays,
    dayStatsMap,
    selectedDate,
    selectedDateReceipts,
    formattedMonthYear,
    weekdayHeaders,
    isLoading,
    error,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDate,
  } = useReceiptsCalendar();

  if (error) {
    return (
      <div className="container-page">
        <div className="card-base p-6 text-center text-error-600">
          <p>{t('calendar.error.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('container-page', className)}>
      <PageHeader
        icon={<Calendar className="h-8 w-8" />}
        title={t('calendar.title')}
        description={t('calendar.description')}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <div className="card-base p-4 sm:p-6">
            <CalendarHeader
              formattedMonthYear={formattedMonthYear}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              onToday={goToToday}
              className="mb-4"
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
              </div>
            ) : (
              <CalendarGrid
                calendarDays={calendarDays}
                dayStatsMap={dayStatsMap}
                weekdayHeaders={weekdayHeaders}
                selectedDate={selectedDate}
                onSelectDate={selectDate}
              />
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-400" />
              <span>{t('calendar.legend.low')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <div className="w-2 h-2 rounded-full bg-primary-500" />
              </div>
              <span>{t('calendar.legend.medium')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <div className="w-2 h-2 rounded-full bg-primary-600" />
                <div className="w-2 h-2 rounded-full bg-primary-600" />
                <div className="w-2 h-2 rounded-full bg-primary-600" />
              </div>
              <span>{t('calendar.legend.high')}</span>
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="lg:col-span-1">
          <SelectedDayDetails
            selectedDate={selectedDate}
            receipts={selectedDateReceipts}
          />
        </div>
      </div>
    </div>
  );
};
