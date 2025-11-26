import { useMemo } from 'react';
import { formatCurrency } from '@/features/shared';
import type { DateRangeStats } from '../types';

export interface UseDateRangeAnalyticsProps {
  dateRangeStats: DateRangeStats;
  profitPercentage: number;
}

export interface UseDateRangeAnalyticsReturn {
  formattedReceiptsInRange: string;
  formattedAmountInRange: string;
  formattedProfitInRange: string;
  formattedPercentageOfTotal: string;
  formattedPercentageOfToday: string;
  profitPercentageDisplay: string;
}

/**
 * useDateRangeAnalytics Hook
 * Formats analytics data for display in the DateRangeAnalytics component
 *
 * Takes raw DateRangeStats and returns formatted strings ready for the UI
 */
export const useDateRangeAnalytics = ({
  dateRangeStats,
  profitPercentage,
}: UseDateRangeAnalyticsProps): UseDateRangeAnalyticsReturn => {
  const formattedReceiptsInRange = useMemo(
    () => dateRangeStats.receiptsInRange.toString(),
    [dateRangeStats.receiptsInRange]
  );

  const formattedAmountInRange = useMemo(
    () => formatCurrency(dateRangeStats.amountInRange),
    [dateRangeStats.amountInRange]
  );

  const formattedProfitInRange = useMemo(
    () => formatCurrency(dateRangeStats.profitInRange),
    [dateRangeStats.profitInRange]
  );

  const formattedPercentageOfTotal = useMemo(
    () => Math.round(dateRangeStats.percentageOfTotal).toString(),
    [dateRangeStats.percentageOfTotal]
  );

  const formattedPercentageOfToday = useMemo(
    () => Math.round(dateRangeStats.percentageOfToday).toString(),
    [dateRangeStats.percentageOfToday]
  );

  const profitPercentageDisplay = useMemo(
    () => `${profitPercentage}%`,
    [profitPercentage]
  );

  return {
    formattedReceiptsInRange,
    formattedAmountInRange,
    formattedProfitInRange,
    formattedPercentageOfTotal,
    formattedPercentageOfToday,
    profitPercentageDisplay,
  };
};
