import { isToday } from './dates';
import type { Receipt, ReceiptsStats } from '../types';

/**
 * Calculates statistics from receipts array
 */
export const calculateStats = (receipts: Receipt[]): ReceiptsStats => {
  const todayReceipts = receipts.filter((r) => isToday(r.createdAt));

  return {
    totalReceipts: receipts.length,
    totalAmount: receipts.reduce((sum, r) => sum + r.amount, 0),
    todayReceipts: todayReceipts.length,
    todayAmount: todayReceipts.reduce((sum, r) => sum + r.amount, 0),
  };
};
