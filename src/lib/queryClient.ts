import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 * Centralized configuration for React Query behavior
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 5 minutes
      staleTime: 1000 * 60 * 5,

      // Cache garbage collected after 10 minutes of inactivity
      gcTime: 1000 * 60 * 10,

      // Retry failed requests 3 times with exponential backoff
      retry: 3,

      // Refetch on window focus (important for data freshness)
      refetchOnWindowFocus: true,

      // Refetch on network reconnect
      refetchOnReconnect: true,

      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once (mutations modify data, be conservative)
      retry: 1,
    },
  },
});
