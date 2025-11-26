import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Receipt, DollarSign, Percent, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { DateRangeSelector } from '@/features/shared';
import type { DateRangePreset, DateRange } from '@/features/settings';
import type { DateRangeStats } from '../types';
import { useDateRangeAnalytics } from '../hooks/useDateRangeAnalytics';
import { AnalyticsCard } from './AnalyticsCard';

export interface DateRangeAnalyticsProps {
  dateRangeStats: DateRangeStats;
  selectedPreset: DateRangePreset;
  customDateRange?: DateRange;
  profitPercentage: number;
  onDateRangeChange: (preset: DateRangePreset, customRange?: DateRange) => void;
  className?: string;
}

/**
 * DateRangeAnalytics Component
 * Main analytics section for the dashboard displaying profit analysis
 *
 * Features:
 * - Date range selector with presets and custom range
 * - Grid of analytics cards showing receipts, amount, and profit
 * - Percentage comparison cards (% of total, % vs today)
 * - Empty state when no receipts in range
 * - Responsive layout (1 col mobile, 2-3 on larger screens)
 * - Dark mode support
 */
export const DateRangeAnalytics: React.FC<DateRangeAnalyticsProps> = ({
  dateRangeStats,
  selectedPreset,
  customDateRange,
  profitPercentage,
  onDateRangeChange,
  className,
}) => {
  const { t } = useTranslation();
  const {
    formattedReceiptsInRange,
    formattedAmountInRange,
    formattedProfitInRange,
    formattedPercentageOfTotal,
    formattedPercentageOfToday,
    profitPercentageDisplay,
  } = useDateRangeAnalytics({ dateRangeStats, profitPercentage });

  const hasReceipts = dateRangeStats.receiptsInRange > 0;

  return (
    <section
      className={cn('card-base p-6', className)}
      aria-labelledby="analytics-title"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-xl">
          <BarChart3
            className="h-6 w-6 text-primary-600"
            aria-hidden="true"
          />
        </div>
        <h2
          id="analytics-title"
          className="text-xl font-bold text-primary-900"
        >
          {t('analytics.title')}
        </h2>
      </div>

      {/* Date Range Selector */}
      <DateRangeSelector
        value={selectedPreset}
        customRange={customDateRange}
        onChange={onDateRangeChange}
        className="mb-6"
      />

      {/* Analytics Content */}
      {hasReceipts ? (
        <div className="space-y-4">
          {/* Main Analytics Cards - 3 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Receipts in Range */}
            <AnalyticsCard
              icon={<Receipt className="h-5 w-5" />}
              label={t('analytics.receiptsInRange')}
              value={formattedReceiptsInRange}
              bgColor="bg-accent-100"
              iconColor="text-accent-600"
            />

            {/* Total Amount in Range */}
            <AnalyticsCard
              icon={<DollarSign className="h-5 w-5" />}
              label={t('analytics.amountInRange')}
              value={formattedAmountInRange}
              bgColor="bg-secondary-100"
              iconColor="text-secondary-600"
            />

            {/* Profit in Range */}
            <AnalyticsCard
              icon={<TrendingUp className="h-5 w-5" />}
              label={t('analytics.profitInRange', {
                percentage: profitPercentageDisplay,
              })}
              value={formattedProfitInRange}
              bgColor="bg-primary-100"
              iconColor="text-primary-600"
            />
          </div>

          {/* Percentage Cards - 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Percentage of Total */}
            <AnalyticsCard
              icon={<Percent className="h-5 w-5" />}
              label={t('analytics.percentageOfTotal')}
              value={`${formattedPercentageOfTotal}%`}
              percentage={dateRangeStats.percentageOfTotal}
              percentageLabel={t('analytics.ofHistoricTotal')}
              bgColor="bg-neutral-100"
              iconColor="text-neutral-600"
            />

            {/* Percentage vs Today */}
            <AnalyticsCard
              icon={<TrendingUp className="h-5 w-5" />}
              label={t('analytics.percentageVsToday')}
              value={`${formattedPercentageOfToday}%`}
              percentage={dateRangeStats.percentageOfToday}
              percentageLabel={t('analytics.vsToday')}
              bgColor="bg-neutral-100"
              iconColor="text-neutral-600"
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'py-12 px-6 rounded-xl',
            'bg-neutral-50',
            'border border-neutral-200'
          )}
        >
          <div className="p-4 bg-primary-100 rounded-full mb-4">
            <BarChart3
              className="h-8 w-8 text-primary-400"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-lg font-semibold text-primary-700 mb-1">
            {t('analytics.empty.title')}
          </h3>
          <p className="text-primary-500 text-center max-w-sm">
            {t('analytics.empty.message')}
          </p>
        </div>
      )}
    </section>
  );
};
