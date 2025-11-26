import type {
  AppSettings,
  AppSettingsStorageData,
  SettingsFormData,
} from '../types';

const STORAGE_KEY = 'app-settings';

const DEFAULT_SETTINGS: AppSettings = {
  profitPercentage: 40,
  defaultDateRange: 'thisMonth',
};

/**
 * Settings Service Interface
 * Defines the contract for settings data operations
 */
export interface ISettingsService {
  get(): Promise<AppSettings>;
  update(data: SettingsFormData): Promise<AppSettings>;
  reset(): Promise<AppSettings>;
}

/**
 * LocalStorageSettingsService
 * Implementation using localStorage for persistence
 */
export class LocalStorageSettingsService implements ISettingsService {
  /**
   * Retrieves settings from localStorage
   */
  async get(): Promise<AppSettings> {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return { ...DEFAULT_SETTINGS };
    }

    const storageData: AppSettingsStorageData = JSON.parse(data);

    return this.parseSettings(storageData);
  }

  /**
   * Updates settings and persists to localStorage
   */
  async update(data: SettingsFormData): Promise<AppSettings> {
    const settings: AppSettings = {
      profitPercentage: data.profitPercentage,
      defaultDateRange: data.defaultDateRange,
      customDateRange: data.customDateRange,
    };

    this.saveToStorage(settings);

    return settings;
  }

  /**
   * Resets settings to defaults
   */
  async reset(): Promise<AppSettings> {
    const settings = { ...DEFAULT_SETTINGS };
    this.saveToStorage(settings);

    return settings;
  }

  /**
   * Parses stored settings data to AppSettings type
   */
  private parseSettings(data: AppSettingsStorageData): AppSettings {
    const settings: AppSettings = {
      profitPercentage: data.profitPercentage,
      defaultDateRange: data.defaultDateRange,
    };

    if (data.customDateRange) {
      settings.customDateRange = {
        startDate: new Date(data.customDateRange.startDate),
        endDate: new Date(data.customDateRange.endDate),
      };
    }

    return settings;
  }

  /**
   * Saves settings to localStorage
   */
  private saveToStorage(settings: AppSettings): void {
    const storageData: AppSettingsStorageData = {
      profitPercentage: settings.profitPercentage,
      defaultDateRange: settings.defaultDateRange,
    };

    if (settings.customDateRange) {
      storageData.customDateRange = {
        startDate: settings.customDateRange.startDate.toISOString(),
        endDate: settings.customDateRange.endDate.toISOString(),
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  }
}

export default LocalStorageSettingsService;
