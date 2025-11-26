/**
 * React Query Keys Factory
 * Centralized query key management for the receipts calendar feature
 */
export const receiptsCalendarKeys = {
  all: ['receipts-calendar'] as const,
  months: () => [...receiptsCalendarKeys.all, 'month'] as const,
  month: (year: number, month: number) =>
    [...receiptsCalendarKeys.months(), year, month] as const,
  dates: () => [...receiptsCalendarKeys.all, 'date'] as const,
  date: (dateString: string) =>
    [...receiptsCalendarKeys.dates(), dateString] as const,
};
