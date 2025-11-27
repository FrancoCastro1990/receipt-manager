import { useMemo } from 'react';
import { formatCurrency } from '@/features/shared';
import { formatDateChilean, formatTimeChilean } from '../utils/calendar';
import type { Receipt } from '@/features/receipts';

export interface UseSelectedDayDetailsProps {
  selectedDate: Date | null;
  receipts: Receipt[];
}

export interface FormattedReceipt {
  id: string;
  name: string;
  formattedAmount: string;
  formattedTime: string;
}

export interface UseSelectedDayDetailsReturn {
  formattedDate: string;
  formattedReceipts: FormattedReceipt[];
  totalAmount: string;
  profitAmount: string;
  hasReceipts: boolean;
}

/**
 * useSelectedDayDetails Hook
 * Handles formatting and display logic for selected day receipts
 */
export const useSelectedDayDetails = ({
  selectedDate,
  receipts,
}: UseSelectedDayDetailsProps): UseSelectedDayDetailsReturn => {
  const formattedDate = useMemo(() => {
    if (!selectedDate) return '';
    return formatDateChilean(selectedDate);
  }, [selectedDate]);

  const formattedReceipts = useMemo(() => {
    return receipts.map((receipt) => ({
      id: receipt.id,
      name: receipt.name,
      formattedAmount: formatCurrency(receipt.amount),
      formattedTime: formatTimeChilean(receipt.createdAt),
    }));
  }, [receipts]);

  const totalAmount = useMemo(() => {
    const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    return formatCurrency(total);
  }, [receipts]);

  const profitAmount = useMemo(() => {
    const total = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    return formatCurrency(total * 0.4);
  }, [receipts]);

  const hasReceipts = receipts.length > 0;

  return {
    formattedDate,
    formattedReceipts,
    totalAmount,
    profitAmount,
    hasReceipts,
  };
};
