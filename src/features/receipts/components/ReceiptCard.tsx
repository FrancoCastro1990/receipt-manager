import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Calendar, DollarSign, Receipt as ReceiptIcon, Pencil } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useReceiptCard } from '../hooks';
import type { Receipt } from '../types';

export interface ReceiptCardProps {
  receipt: Receipt;
  onEdit?: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
  className?: string;
}

/**
 * ReceiptCard Component
 * Displays a single receipt with its details, edit and delete actions
 */
export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onEdit,
  onDelete,
  className = '',
}) => {
  const { t } = useTranslation();
  const { formattedDate, formattedAmount, handleEdit, handleDelete } = useReceiptCard({
    receipt,
    onEdit,
    onDelete,
  });

  return (
    <div
      className={cn('card-base card-hover overflow-hidden', className)}
    >
      <div className="h-40 overflow-hidden">
        {receipt.imageUrl ? (
          <img
            src={receipt.imageUrl}
            alt={receipt.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <ReceiptIcon className="h-16 w-16 text-primary-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-primary-900 truncate flex-1">
            {receipt.name}
          </h3>
          <div className="flex gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                aria-label={t('receipts.card.editAriaLabel', { name: receipt.name })}
              >
                <Pencil className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all"
              aria-label={t('receipts.card.deleteAriaLabel', { name: receipt.name })}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-primary-700">
            <DollarSign className="h-4 w-4 text-primary-500" />
            <span className="font-medium">{formattedAmount}</span>
          </div>

          <div className="flex items-center gap-2 text-primary-500 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
