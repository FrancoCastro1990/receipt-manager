import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LocalStorageSettingsService } from '../services/SettingsService';
import {
  settingsQueryOptions,
  updateSettingsMutationOptions,
  resetSettingsMutationOptions,
} from '../queries/options';
import type { AppSettings, SettingsFormData } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  profitPercentage: 40,
  defaultDateRange: 'thisMonth',
};

export interface UseSettingsReturn {
  settings: AppSettings;
  isLoading: boolean;
  error: Error | null;
  updateSettings: (data: SettingsFormData) => void;
  resetSettings: () => void;
  isUpdating: boolean;
  isUpdateSuccess: boolean;
}

/**
 * useSettings Hook
 * Main hook for settings feature - handles fetching and mutations
 */
export const useSettings = (): UseSettingsReturn => {
  const service = useMemo(() => new LocalStorageSettingsService(), []);

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery(settingsQueryOptions(service));

  const updateMutation = useMutation(updateSettingsMutationOptions(service));
  const resetMutation = useMutation(resetSettingsMutationOptions(service));

  return {
    settings: settings ?? DEFAULT_SETTINGS,
    isLoading,
    error: error ?? null,
    updateSettings: updateMutation.mutate,
    resetSettings: resetMutation.mutate,
    isUpdating: updateMutation.isPending || resetMutation.isPending,
    isUpdateSuccess: updateMutation.isSuccess,
  };
};
