import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Receipt as ReceiptIcon, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useSelectedDayDetails } from '../hooks/useSelectedDayDetails';
import type { Receipt } from '@/features/receipts';

export interface SelectedDayDetailsProps {
  selectedDate: Date | null;
  receipts: Receipt[];
  onEdit?: (receipt: Receipt) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

/**
 * SelectedDayDetails Component
 * Shows receipts for the selected day
 */
export const SelectedDayDetails: React.FC<SelectedDayDetailsProps> = ({
  selectedDate,
  receipts,
  onEdit,
  onDelete,
  className = '',
}) => {
  const { t } = useTranslation();
  const { formattedDate, formattedReceipts, totalAmount, profitAmount, hasReceipts } =
    useSelectedDayDetails({
      selectedDate,
      receipts,
    });

  if (!selectedDate) {
    return (
      <div
        className={cn(
          'card-base',
          'p-6',
          'text-center',
          className
        )}
      >
        <Calendar className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
        <p className="text-neutral-500">{t('calendar.selectDay')}</p>
      </div>
    );
  }

  return (
    <div className={cn('card-base', 'overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-gradient-primary p-4">
        <div className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5" />
          <h3 className="font-semibold">{formattedDate}</h3>
        </div>
        {hasReceipts && (
          <div className="mt-2 text-primary-100 text-sm space-y-1">
            <div>{t('calendar.total')}: {totalAmount}</div>
            <div>{t('calendar.profit')}: {profitAmount}</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {hasReceipts ? (
          <ul className="space-y-3">
            {formattedReceipts.map((formattedReceipt, index) => {
              const originalReceipt = receipts[index];
              return (
                <li
                  key={formattedReceipt.id}
                  className={cn(
                    'flex items-center justify-between',
                    'p-3',
                    'bg-neutral-50',
                    'rounded-lg',
                    'hover:bg-primary-50',
                    'transition-colors'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ReceiptIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-primary-900">{formattedReceipt.name}</p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Clock className="h-3 w-3" />
                        <span>{formattedReceipt.formattedTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary-700">
                      {formattedReceipt.formattedAmount}
                    </span>
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(originalReceipt)}
                        className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all"
                        aria-label={t('receipts.card.editAriaLabel', { name: formattedReceipt.name })}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(t('receipts.card.deleteConfirm', { name: formattedReceipt.name }))) {
                            onDelete(formattedReceipt.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all"
                        aria-label={t('receipts.card.deleteAriaLabel', { name: formattedReceipt.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-8">
            <ReceiptIcon className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
            <p className="text-neutral-500">{t('calendar.noReceipts')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
