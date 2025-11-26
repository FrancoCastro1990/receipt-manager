/**
 * React Query Keys Factory
 * Centralized query key management for the settings feature
 */
export const settingsKeys = {
  all: ['settings'] as const,
  current: () => [...settingsKeys.all, 'current'] as const,
};
