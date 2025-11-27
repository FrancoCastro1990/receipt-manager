import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, ExternalLink, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { DateRangeSelector } from '@/features/shared';
import { useSettingsForm } from '../hooks';
import type { AppSettings, SettingsFormData } from '../types';

export interface SettingsFormProps {
  settings: AppSettings;
  onSubmit: (data: SettingsFormData) => void;
  isSubmitting?: boolean;
  showSuccess?: boolean;
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
  showSuccess = false,
  className,
}) => {
  const { t } = useTranslation();
  const [showApiKey, setShowApiKey] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  // Show success message briefly then hide it
  useEffect(() => {
    if (showSuccess) {
      setDisplaySuccess(true);
      const timer = setTimeout(() => setDisplaySuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const {
    profitPercentage,
    dateRangePreset,
    customDateRange,
    googleApiKey,
    isValid,
    profitError,
    handleProfitChange,
    handleDateRangeChange,
    handleGoogleApiKeyChange,
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

      {/* Google API Key Section */}
      <div className="mb-8">
        <label
          htmlFor="google-api-key"
          className="block text-lg font-semibold text-primary-900 mb-1"
        >
          {t('settings.form.googleApiKey.label')}
        </label>
        <p className="text-sm text-primary-500 mb-2">
          {t('settings.form.googleApiKey.description')}{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 underline"
          >
            {t('settings.form.googleApiKey.link')}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </p>

        <div className="relative w-full">
          <input
            id="google-api-key"
            type={showApiKey ? 'text' : 'password'}
            value={googleApiKey}
            onChange={handleGoogleApiKeyChange}
            placeholder={t('settings.form.googleApiKey.placeholder')}
            autoComplete="off"
            className={cn(
              'w-full px-4 py-3 pr-12',
              'text-base font-mono',
              'border border-neutral-300 rounded-xl',
              'transition-all duration-200',
              'focus:ring-2 focus:ring-offset-0 focus:border-transparent focus:ring-primary-500'
            )}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'p-1 rounded-lg',
              'text-primary-500 hover:text-primary-700',
              'transition-colors'
            )}
            aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
          >
            {showApiKey ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {displaySuccess && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0" />
          <span className="text-success-700 font-medium">{t('settings.form.saved')}</span>
        </div>
      )}

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
