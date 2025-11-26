/**
 * React Query Keys Factory
 * Centralized query key management for the receipts feature
 */
export const receiptKeys = {
  all: ['receipts'] as const,
  lists: () => [...receiptKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...receiptKeys.lists(), filters] as const,
  details: () => [...receiptKeys.all, 'detail'] as const,
  detail: (id: string) => [...receiptKeys.details(), id] as const,
};
