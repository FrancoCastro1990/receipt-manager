import { useState, useCallback, useMemo } from 'react';
import type { DateRangePreset, DateRange } from '@/features/settings';

/**
 * Props for the useDateRangeSelector hook
 */
export interface UseDateRangeSelectorProps {
  value: DateRangePreset;
  customRange?: DateRange;
  onChange: (preset: DateRangePreset, customRange?: DateRange) => void;
}

/**
 * Preset option with value and translation key
 */
export interface PresetOption {
  value: DateRangePreset;
  labelKey: string;
}

/**
 * Return type for the useDateRangeSelector hook
 */
export interface UseDateRangeSelectorReturn {
  selectedPreset: DateRangePreset;
  showCustomInputs: boolean;
  customStartDate: Date | null;
  customEndDate: Date | null;
  presets: PresetOption[];
  handlePresetClick: (preset: DateRangePreset) => void;
  handleCustomStartChange: (date: Date | null) => void;
  handleCustomEndChange: (date: Date | null) => void;
}

/**
 * Hook that manages date range selector state and logic
 *
 * Handles:
 * - Preset selection with translation keys
 * - Custom date input state management
 * - Callbacks for parent component updates
 */
export const useDateRangeSelector = ({
  value,
  customRange,
  onChange,
}: UseDateRangeSelectorProps): UseDateRangeSelectorReturn => {
  // Preset options with translation keys
  const presets: PresetOption[] = useMemo(
    () => [
      { value: 'today', labelKey: 'dateRange.presets.today' },
      { value: 'yesterday', labelKey: 'dateRange.presets.yesterday' },
      { value: 'last7days', labelKey: 'dateRange.presets.last7days' },
      { value: 'last30days', labelKey: 'dateRange.presets.last30days' },
      { value: 'thisWeek', labelKey: 'dateRange.presets.thisWeek' },
      { value: 'thisMonth', labelKey: 'dateRange.presets.thisMonth' },
      { value: 'lastMonth', labelKey: 'dateRange.presets.lastMonth' },
      { value: 'custom', labelKey: 'dateRange.presets.custom' },
    ],
    []
  );

  // Local state for custom date inputs
  const [localStartDate, setLocalStartDate] = useState<Date | null>(
    customRange?.startDate ?? null
  );
  const [localEndDate, setLocalEndDate] = useState<Date | null>(
    customRange?.endDate ?? null
  );

  // Derived state
  const showCustomInputs = value === 'custom';

  // Handle preset button click
  const handlePresetClick = useCallback(
    (preset: DateRangePreset) => {
      if (preset === 'custom') {
        // When switching to custom, use existing custom range or current dates
        const startDate = localStartDate ?? new Date();
        const endDate = localEndDate ?? new Date();
        onChange(preset, { startDate, endDate });
      } else {
        onChange(preset, undefined);
      }
    },
    [onChange, localStartDate, localEndDate]
  );

  // Handle custom start date change
  const handleCustomStartChange = useCallback(
    (newDate: Date | null) => {
      setLocalStartDate(newDate);

      if (newDate && localEndDate) {
        onChange('custom', { startDate: newDate, endDate: localEndDate });
      }
    },
    [onChange, localEndDate]
  );

  // Handle custom end date change
  const handleCustomEndChange = useCallback(
    (newDate: Date | null) => {
      setLocalEndDate(newDate);

      if (localStartDate && newDate) {
        onChange('custom', { startDate: localStartDate, endDate: newDate });
      }
    },
    [onChange, localStartDate]
  );

  return {
    selectedPreset: value,
    showCustomInputs,
    customStartDate: localStartDate,
    customEndDate: localEndDate,
    presets,
    handlePresetClick,
    handleCustomStartChange,
    handleCustomEndChange,
  };
};
