import React from 'react';
import { Receipt, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard, formatCurrency } from '@/features/shared';
import { cn } from '@/lib/cn';

export interface FilteredReceiptsSummaryProps {
  count: number;
  amount: number;
  className?: string;
}

/**
 * FilteredReceiptsSummary Component
 * Displays a 2-card summary showing count and total amount for the filtered period
 */
export const FilteredReceiptsSummary: React.FC<FilteredReceiptsSummaryProps> = ({
  count,
  amount,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <StatCard
        icon={<Receipt className="h-5 w-5" />}
        label={t('receipts.summary.count')}
        value={count.toString()}
        bgColor="bg-primary-100"
        iconColor="text-primary-600"
      />
      <StatCard
        icon={<DollarSign className="h-5 w-5" />}
        label={t('receipts.summary.amount')}
        value={formatCurrency(amount)}
        bgColor="bg-secondary-100"
        iconColor="text-secondary-600"
      />
    </div>
  );
};
