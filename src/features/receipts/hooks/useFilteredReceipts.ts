import { useState, useMemo, useCallback } from 'react';
import type { Receipt } from '../types';
import type { DateRangePreset, DateRange, AppSettings } from '@/features/settings';
import { getDateRangeFromPreset } from '@/features/settings';
import { filterReceiptsByDateRange } from '../utils/analytics';

export interface UseFilteredReceiptsProps {
  receipts: Receipt[];
  settings: AppSettings;
}

export interface UseFilteredReceiptsReturn {
  // Filtered data
  filteredReceipts: Receipt[];
  filteredCount: number;
  filteredAmount: number;

  // Date range state
  selectedPreset: DateRangePreset;
  customDateRange?: DateRange;

  // Handler
  handlePresetChange: (preset: DateRangePreset, customRange?: DateRange) => void;
}

/**
 * useFilteredReceipts Hook
 * Manages filtering of receipts by date range for the receipts tab
 */
export const useFilteredReceipts = ({
  receipts,
  settings,
}: UseFilteredReceiptsProps): UseFilteredReceiptsReturn => {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(
    settings.defaultDateRange
  );
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(
    settings.customDateRange
  );

  const handlePresetChange = useCallback(
    (preset: DateRangePreset, customRange?: DateRange) => {
      setSelectedPreset(preset);
      if (preset === 'custom' && customRange) {
        setCustomDateRange(customRange);
      }
    },
    []
  );

  const filteredReceipts = useMemo(() => {
    const dateRange =
      selectedPreset === 'custom' && customDateRange
        ? customDateRange
        : getDateRangeFromPreset(selectedPreset);

    return filterReceiptsByDateRange(receipts, dateRange);
  }, [receipts, selectedPreset, customDateRange]);

  const { filteredCount, filteredAmount } = useMemo(
    () => ({
      filteredCount: filteredReceipts.length,
      filteredAmount: filteredReceipts.reduce((sum, r) => sum + r.amount, 0),
    }),
    [filteredReceipts]
  );

  return {
    filteredReceipts,
    filteredCount,
    filteredAmount,
    selectedPreset,
    customDateRange,
    handlePresetChange,
  };
};
