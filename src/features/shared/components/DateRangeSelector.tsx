import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import type { DateRangePreset, DateRange } from '@/features/settings';
import { useDateRangeSelector } from '../hooks/useDateRangeSelector';
import { DatePicker } from './DatePicker';

/**
 * Props for the DateRangeSelector component
 */
export interface DateRangeSelectorProps {
  value: DateRangePreset;
  customRange?: DateRange;
  onChange: (preset: DateRangePreset, customRange?: DateRange) => void;
  className?: string;
}

/**
 * DateRangeSelector component for selecting date range presets
 *
 * Features:
 * - Grid of preset buttons (today, yesterday, last7days, etc.)
 * - Custom date range with start/end date inputs
 * - Responsive layout (wraps on mobile, inline on desktop)
 * - Dark mode support
 * - Accessible with proper labels and focus states
 */
export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  value,
  customRange,
  onChange,
  className,
}) => {
  const { t } = useTranslation();
  const {
    selectedPreset,
    showCustomInputs,
    customStartDate,
    customEndDate,
    presets,
    handlePresetClick,
    handleCustomStartChange,
    handleCustomEndChange,
  } = useDateRangeSelector({ value, customRange, onChange });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preset Buttons */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t('dateRange.label')}
      >
        {presets.map((preset) => {
          const isActive = selectedPreset === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              className={cn(
                // Base styles
                'px-3 py-2 text-sm font-medium rounded-lg',
                'border transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                // Default state
                !isActive && 'bg-white border-neutral-300 text-primary-700 hover:bg-neutral-50 hover:border-neutral-400',
                // Active state
                isActive && 'bg-primary-700 border-primary-700 text-white hover:bg-primary-800 hover:border-primary-800'
              )}
              aria-pressed={isActive}
            >
              {t(preset.labelKey as 'dateRange.presets.today' | 'dateRange.presets.yesterday' | 'dateRange.presets.last7days' | 'dateRange.presets.last30days' | 'dateRange.presets.thisWeek' | 'dateRange.presets.thisMonth' | 'dateRange.presets.lastMonth' | 'dateRange.presets.custom')}
            </button>
          );
        })}
      </div>

      {/* Custom Date Inputs */}
      {showCustomInputs && (
        <div
          className={cn(
            'grid gap-4',
            'grid-cols-1 sm:grid-cols-2',
            'p-4 rounded-lg',
            'bg-neutral-50',
            'border border-neutral-200',
            'animate-fade-in'
          )}
        >
          {/* Start Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="date-range-start"
              className="block text-sm font-medium text-primary-700"
            >
              {t('dateRange.startDate')}
            </label>
            <DatePicker
              id="date-range-start"
              value={customStartDate}
              onChange={handleCustomStartChange}
              maxDate={customEndDate ?? undefined}
              placeholder={t('dateRange.startDatePlaceholder')}
              className="bg-white"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="date-range-end"
              className="block text-sm font-medium text-primary-700"
            >
              {t('dateRange.endDate')}
            </label>
            <DatePicker
              id="date-range-end"
              value={customEndDate}
              onChange={handleCustomEndChange}
              minDate={customStartDate ?? undefined}
              placeholder={t('dateRange.endDatePlaceholder')}
              className="bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
