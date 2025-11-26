import { useState, useMemo, useCallback } from 'react';

import type { Receipt, ReceiptsStats, DateRangeStats } from '../types';
import type { DateRangePreset, DateRange, AppSettings } from '@/features/settings';
import { getDateRangeFromPreset } from '@/features/settings';
import { calculateDateRangeStats, calculateProfit } from '../utils/analytics';

export interface UseDashboardAnalyticsProps {
  receipts: Receipt[];
  stats: ReceiptsStats;
  settings: AppSettings;
}

export interface UseDashboardAnalyticsReturn {
  /** Current selected preset (can override settings default) */
  selectedPreset: DateRangePreset;
  /** Custom date range when preset is 'custom' */
  customDateRange?: DateRange;
  /** The currently active date range based on selection */
  activeDateRange: DateRange;

  /** Computed analytics for the selected date range */
  dateRangeStats: DateRangeStats;
  /** Total profit across all receipts */
  totalProfit: number;
  /** Profit for today's receipts */
  todayProfit: number;

  /** Handler to change the date range preset */
  handlePresetChange: (preset: DateRangePreset, customRange?: DateRange) => void;
}

/**
 * useDashboardAnalytics Hook
 * Manages analytics state and calculations for the dashboard.
 * Allows overriding the default date range from settings.
 */
export const useDashboardAnalytics = ({
  receipts,
  stats,
  settings,
}: UseDashboardAnalyticsProps): UseDashboardAnalyticsReturn => {
  // State for override (initially null, uses settings default)
  const [overridePreset, setOverridePreset] = useState<DateRangePreset | null>(
    null
  );
  const [overrideCustomRange, setOverrideCustomRange] = useState<
    DateRange | undefined
  >(undefined);

  // Determine active preset and range
  const selectedPreset = overridePreset ?? settings.defaultDateRange;
  const customDateRange =
    overridePreset === 'custom'
      ? overrideCustomRange
      : selectedPreset === 'custom'
        ? settings.customDateRange
        : undefined;

  // Calculate active date range
  const activeDateRange = useMemo(
    () => getDateRangeFromPreset(selectedPreset, customDateRange),
    [selectedPreset, customDateRange]
  );

  // Calculate date range stats
  const dateRangeStats = useMemo(
    () =>
      calculateDateRangeStats(
        receipts,
        activeDateRange,
        settings.profitPercentage,
        stats.totalAmount,
        stats.todayAmount
      ),
    [
      receipts,
      activeDateRange,
      settings.profitPercentage,
      stats.totalAmount,
      stats.todayAmount,
    ]
  );

  // Calculate total and today profits
  const totalProfit = useMemo(
    () => calculateProfit(stats.totalAmount, settings.profitPercentage),
    [stats.totalAmount, settings.profitPercentage]
  );

  const todayProfit = useMemo(
    () => calculateProfit(stats.todayAmount, settings.profitPercentage),
    [stats.todayAmount, settings.profitPercentage]
  );

  // Handler to change preset (override settings)
  const handlePresetChange = useCallback(
    (preset: DateRangePreset, customRange?: DateRange) => {
      setOverridePreset(preset);
      if (preset === 'custom') {
        setOverrideCustomRange(customRange);
      }
    },
    []
  );

  return {
    selectedPreset,
    customDateRange,
    activeDateRange,
    dateRangeStats,
    totalProfit,
    todayProfit,
    handlePresetChange,
  };
};
