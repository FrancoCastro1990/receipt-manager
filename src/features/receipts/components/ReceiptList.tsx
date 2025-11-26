import React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt as ReceiptIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ReceiptCard } from './ReceiptCard';
import type { Receipt } from '../types';

export interface ReceiptListProps {
  receipts: Receipt[];
  onEdit?: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
  className?: string;
}

/**
 * ReceiptList Component
 * Displays a grid of receipt cards or an empty state
 */
export const ReceiptList: React.FC<ReceiptListProps> = ({
  receipts,
  onEdit,
  onDelete,
  className = '',
}) => {
  const { t } = useTranslation();

  if (receipts.length === 0) {
    return (
      <div className={cn('card-base p-12 text-center', className)}>
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-100 rounded-full">
            <ReceiptIcon className="h-12 w-12 text-primary-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-primary-900 mb-2">{t('receipts.empty.title')}</h3>
        <p className="text-primary-500">
          {t('receipts.empty.message')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {receipts.map((receipt) => (
        <ReceiptCard key={receipt.id} receipt={receipt} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
