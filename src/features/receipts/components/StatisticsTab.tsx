import React from 'react';
import { cn } from '@/lib/cn';
import { StatsSummary } from './StatsSummary';
import { DateRangeAnalytics } from './DateRangeAnalytics';
import type { ReceiptsStats, DateRangeStats } from '../types';
import type { DateRangePreset, DateRange } from '@/features/settings';

export interface StatisticsTabProps {
  stats: ReceiptsStats;
  dateRangeStats: DateRangeStats;
  totalProfit: number;
  todayProfit: number;
  profitPercentage: number;
  selectedPreset: DateRangePreset;
  customRange?: DateRange;
  onPresetChange: (preset: DateRangePreset, customRange?: DateRange) => void;
  className?: string;
}

/**
 * StatisticsTab Component
 * Tab content displaying global stats and date range analytics
 */
export const StatisticsTab: React.FC<StatisticsTabProps> = ({
  stats,
  dateRangeStats,
  profitPercentage,
  selectedPreset,
  customRange,
  onPresetChange,
  className,
}) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Global stats */}
      <StatsSummary stats={stats} />

      {/* Date range analytics */}
      <DateRangeAnalytics
        dateRangeStats={dateRangeStats}
        selectedPreset={selectedPreset}
        customDateRange={customRange}
        profitPercentage={profitPercentage}
        onDateRangeChange={onPresetChange}
      />
    </div>
  );
};
