import { useState, useCallback, useMemo, type FormEvent, type ChangeEvent } from 'react';
import type { AppSettings, SettingsFormData, DateRangePreset, DateRange } from '../types';

export interface UseSettingsFormProps {
  initialSettings: AppSettings;
  onSubmit: (data: SettingsFormData) => void;
}

export interface UseSettingsFormReturn {
  // Form values
  profitPercentage: string;
  dateRangePreset: DateRangePreset;
  customDateRange?: DateRange;

  // Validation
  isValid: boolean;
  profitError: string | null;

  // Handlers
  handleProfitChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDateRangeChange: (preset: DateRangePreset, customRange?: DateRange) => void;
  handleSubmit: (e: FormEvent) => void;

  // State
  isDirty: boolean;
}

/**
 * Validates profit percentage value
 * Returns error message or null if valid
 */
const validateProfit = (value: string): string | null => {
  if (value === '') {
    return 'settings.form.errors.profitRequired';
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return 'settings.form.errors.profitInvalid';
  }

  if (numValue < 0 || numValue > 100) {
    return 'settings.form.errors.profitRange';
  }

  return null;
};

/**
 * Compares two optional DateRange objects for equality
 */
const areDateRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;

  return (
    a.startDate.getTime() === b.startDate.getTime() &&
    a.endDate.getTime() === b.endDate.getTime()
  );
};

/**
 * useSettingsForm Hook
 * Manages form state and validation for settings
 */
export const useSettingsForm = ({
  initialSettings,
  onSubmit,
}: UseSettingsFormProps): UseSettingsFormReturn => {
  const [profitPercentage, setProfitPercentage] = useState(
    initialSettings.profitPercentage.toString()
  );
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>(
    initialSettings.defaultDateRange
  );
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(
    initialSettings.customDateRange
  );

  const profitError = useMemo(() => validateProfit(profitPercentage), [profitPercentage]);

  const isValid = profitError === null;

  const isDirty = useMemo(() => {
    const profitChanged =
      parseFloat(profitPercentage) !== initialSettings.profitPercentage;
    const presetChanged = dateRangePreset !== initialSettings.defaultDateRange;
    const customRangeChanged = !areDateRangesEqual(
      customDateRange,
      initialSettings.customDateRange
    );

    return profitChanged || presetChanged || customRangeChanged;
  }, [
    profitPercentage,
    dateRangePreset,
    customDateRange,
    initialSettings.profitPercentage,
    initialSettings.defaultDateRange,
    initialSettings.customDateRange,
  ]);

  const handleProfitChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string, or valid decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setProfitPercentage(value);
    }
  }, []);

  const handleDateRangeChange = useCallback(
    (preset: DateRangePreset, customRange?: DateRange) => {
      setDateRangePreset(preset);
      setCustomDateRange(customRange);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!isValid) {
        return;
      }

      const formData: SettingsFormData = {
        profitPercentage: parseFloat(profitPercentage),
        defaultDateRange: dateRangePreset,
        customDateRange: dateRangePreset === 'custom' ? customDateRange : undefined,
      };

      onSubmit(formData);
    },
    [isValid, profitPercentage, dateRangePreset, customDateRange, onSubmit]
  );

  return {
    profitPercentage,
    dateRangePreset,
    customDateRange,
    isValid,
    profitError,
    handleProfitChange,
    handleDateRangeChange,
    handleSubmit,
    isDirty,
  };
};
