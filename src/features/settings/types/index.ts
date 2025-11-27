/**
 * Settings Types
 * Type definitions for the settings feature
 */

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AppSettings {
  profitPercentage: number;
  defaultDateRange: DateRangePreset;
  customDateRange?: DateRange;
  googleApiKey?: string;
}

/**
 * Raw settings data as stored in localStorage
 * Dates are stored as ISO strings
 */
export interface AppSettingsStorageData {
  profitPercentage: number;
  defaultDateRange: DateRangePreset;
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  googleApiKey?: string;
}

export interface SettingsFormData {
  profitPercentage: number;
  defaultDateRange: DateRangePreset;
  customDateRange?: DateRange;
  googleApiKey?: string;
}
