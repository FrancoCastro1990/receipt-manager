import type { Receipt, DateRangeStats } from '../types';
import type { DateRange } from '@/features/settings';
import { isDateInRange } from '@/features/settings';

/**
 * Calculates profit from an amount based on percentage
 * @param amount - The base amount
 * @param percentage - The profit percentage (e.g., 15 for 15%)
 * @returns The calculated profit
 */
export const calculateProfit = (amount: number, percentage: number): number => {
  return amount * (percentage / 100);
};

/**
 * Filters receipts that fall within a given date range
 * @param receipts - Array of receipts to filter
 * @param range - The date range to filter by
 * @returns Filtered array of receipts within the range
 */
export const filterReceiptsByDateRange = (
  receipts: Receipt[],
  range: DateRange
): Receipt[] => {
  return receipts.filter((receipt) => isDateInRange(receipt.createdAt, range));
};

/**
 * Calculates comprehensive date range statistics for analytics
 * @param receipts - All receipts to analyze
 * @param range - The date range to calculate stats for
 * @param profitPercentage - The profit percentage to apply
 * @param totalAmount - Total amount across all receipts (for percentage calculation)
 * @param todayAmount - Today's amount (for percentage calculation)
 * @returns DateRangeStats object with all calculated values
 */
export const calculateDateRangeStats = (
  receipts: Receipt[],
  range: DateRange,
  profitPercentage: number,
  totalAmount: number,
  todayAmount: number
): DateRangeStats => {
  const receiptsInRange = filterReceiptsByDateRange(receipts, range);
  const amountInRange = receiptsInRange.reduce((sum, r) => sum + r.amount, 0);
  const profitInRange = calculateProfit(amountInRange, profitPercentage);

  // Calculate percentages safely (avoid division by zero)
  const percentageOfTotal =
    totalAmount > 0 ? (amountInRange / totalAmount) * 100 : 0;
  const percentageOfToday =
    amountInRange > 0 ? (todayAmount / amountInRange) * 100 : 0;

  return {
    receiptsInRange: receiptsInRange.length,
    amountInRange,
    profitInRange,
    percentageOfTotal,
    percentageOfToday,
  };
};
