import { queryOptions, type MutationOptions } from '@tanstack/react-query';
import type { ISettingsService } from '../services/SettingsService';
import type { AppSettings, SettingsFormData } from '../types';
import { settingsKeys } from './keys';
import { queryClient } from '@/lib/queryClient';

/**
 * Query options for fetching current settings
 */
export const settingsQueryOptions = (service: ISettingsService) =>
  queryOptions({
    queryKey: settingsKeys.current(),
    queryFn: () => service.get(),
    staleTime: Infinity,
  });

/**
 * Mutation options for updating settings
 */
export const updateSettingsMutationOptions = (
  service: ISettingsService
): MutationOptions<AppSettings, Error, SettingsFormData> => ({
  mutationFn: (data: SettingsFormData) => service.update(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: settingsKeys.all });
  },
});

/**
 * Mutation options for resetting settings to defaults
 */
export const resetSettingsMutationOptions = (
  service: ISettingsService
): MutationOptions<AppSettings, Error, void> => ({
  mutationFn: () => service.reset(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: settingsKeys.all });
  },
});
