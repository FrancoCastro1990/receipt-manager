import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '@/features/shared';
import type { Receipt } from '../types';

export interface UseReceiptCardProps {
  receipt: Receipt;
  onEdit?: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
}

export interface UseReceiptCardReturn {
  formattedDate: string;
  formattedAmount: string;
  handleEdit: () => void;
  handleDelete: () => void;
}

/**
 * useReceiptCard Hook
 * Handles receipt card display formatting, editing and deletion logic
 */
export const useReceiptCard = ({
  receipt,
  onEdit,
  onDelete,
}: UseReceiptCardProps): UseReceiptCardReturn => {
  const { t } = useTranslation();

  const formattedDate = useMemo(() => formatDate(receipt.createdAt), [receipt.createdAt]);

  const formattedAmount = useMemo(() => formatCurrency(receipt.amount), [receipt.amount]);

  const handleEdit = useCallback(() => {
    onEdit?.(receipt);
  }, [receipt, onEdit]);

  const handleDelete = useCallback(() => {
    const confirmed = window.confirm(
      t('receipts.card.deleteConfirm', { name: receipt.name })
    );

    if (confirmed) {
      onDelete(receipt.id);
    }
  }, [receipt.id, receipt.name, onDelete, t]);

  return {
    formattedDate,
    formattedAmount,
    handleEdit,
    handleDelete,
  };
};
