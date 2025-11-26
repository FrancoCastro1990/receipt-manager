import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { DateRangeSelector } from '@/features/shared';
import { useSettingsForm } from '../hooks';
import type { AppSettings, SettingsFormData } from '../types';

export interface SettingsFormProps {
  settings: AppSettings;
  onSubmit: (data: SettingsFormData) => void;
  isSubmitting?: boolean;
  className?: string;
}

/**
 * SettingsForm Component
 * UI-only form for configuring app settings (profit percentage and default date range)
 */
export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  onSubmit,
  isSubmitting = false,
  className,
}) => {
  const { t } = useTranslation();
  const {
    profitPercentage,
    dateRangePreset,
    customDateRange,
    isValid,
    profitError,
    handleProfitChange,
    handleDateRangeChange,
    handleSubmit,
  } = useSettingsForm({ initialSettings: settings, onSubmit });

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('card-base p-6 sm:p-8', className)}
    >
      {/* Profit Percentage Section */}
      <div className="mb-8">
        <label
          htmlFor="profit-percentage"
          className="block text-lg font-semibold text-primary-900 mb-1"
        >
          {t('settings.form.profitPercentage.label')}
        </label>
        <p className="text-sm text-primary-500 mb-4">
          {t('settings.form.profitPercentage.description')}
        </p>

        <div className="relative w-full sm:w-48">
          <input
            id="profit-percentage"
            type="text"
            inputMode="decimal"
            value={profitPercentage}
            onChange={handleProfitChange}
            aria-invalid={!!profitError}
            aria-describedby={profitError ? 'profit-error' : undefined}
            className={cn(
              'w-full px-4 py-3 pr-10',
              'text-right text-lg font-medium',
              'border rounded-xl',
              'transition-all duration-200',
              'focus:ring-2 focus:ring-offset-0 focus:border-transparent',
              profitError === null ? 'border-neutral-300 focus:ring-primary-500' : 'border-error-500 focus:ring-error-500 bg-error-50'
            )}
          />
          <span
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'text-lg font-medium',
              'text-primary-500',
              'pointer-events-none'
            )}
            aria-hidden="true"
          >
            %
          </span>
        </div>

        {profitError && (
          <p
            id="profit-error"
            role="alert"
            className="mt-2 text-sm text-error-600"
          >
            {t(profitError as 'settings.form.errors.profitRequired' | 'settings.form.errors.profitInvalid' | 'settings.form.errors.profitRange')}
          </p>
        )}
      </div>

      {/* Date Range Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-primary-900 mb-1">
          {t('settings.form.dateRange.label')}
        </h3>
        <p className="text-sm text-primary-500 mb-4">
          {t('settings.form.dateRange.description')}
        </p>

        <DateRangeSelector
          value={dateRangePreset}
          customRange={customDateRange}
          onChange={handleDateRangeChange}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center sm:justify-end">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={cn(
            'inline-flex items-center justify-center gap-2',
            'px-6 py-3 min-w-[200px]',
            'text-base font-medium text-white',
            'bg-primary-700 rounded-xl',
            'transition-all duration-200',
            'hover:bg-primary-800',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-700'
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>{t('settings.form.saving')}</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" aria-hidden="true" />
              <span>{t('settings.form.submit')}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
