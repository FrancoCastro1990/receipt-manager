import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, DollarSign, Clock, Receipt as ReceiptIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useSelectedDayDetails } from '../hooks/useSelectedDayDetails';
import type { Receipt } from '@/features/receipts';

export interface SelectedDayDetailsProps {
  selectedDate: Date | null;
  receipts: Receipt[];
  className?: string;
}

/**
 * SelectedDayDetails Component
 * Shows receipts for the selected day
 */
export const SelectedDayDetails: React.FC<SelectedDayDetailsProps> = ({
  selectedDate,
  receipts,
  className = '',
}) => {
  const { t } = useTranslation();
  const { formattedDate, formattedReceipts, totalAmount, hasReceipts } =
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
          <div className="flex items-center gap-2 mt-2 text-primary-100">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">{t('calendar.total')}: {totalAmount}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {hasReceipts ? (
          <ul className="space-y-3">
            {formattedReceipts.map((receipt) => (
              <li
                key={receipt.id}
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
                    <p className="font-medium text-primary-900">{receipt.name}</p>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <Clock className="h-3 w-3" />
                      <span>{receipt.formattedTime}</span>
                    </div>
                  </div>
                </div>
                <span className="font-semibold text-primary-700">
                  {receipt.formattedAmount}
                </span>
              </li>
            ))}
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
