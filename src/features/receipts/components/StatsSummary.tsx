import React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { StatCard, formatCurrency } from '@/features/shared';
import type { ReceiptsStats } from '../types';

export interface StatsSummaryProps {
  stats: ReceiptsStats;
  className?: string;
}

/**
 * StatsSummary Component
 * Displays receipt statistics in a grid of cards
 */
export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats, className = '' }) => {
  const { t } = useTranslation();

  const statCards = [
    {
      icon: <Receipt className="h-6 w-6" />,
      label: t('stats.totalReceipts'),
      value: stats.totalReceipts.toString(),
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      label: t('stats.totalAmount'),
      value: formatCurrency(stats.totalAmount),
      bgColor: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      label: t('stats.todayReceipts'),
      value: stats.todayReceipts.toString(),
      bgColor: 'bg-accent-100',
      iconColor: 'text-accent-600',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: t('stats.todayAmount'),
      value: formatCurrency(stats.todayAmount),
      bgColor: 'bg-success-100',
      iconColor: 'text-success-600',
    },
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`.trim()}>
      {statCards.map((card) => (
        <StatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          bgColor={card.bgColor}
          iconColor={card.iconColor}
        />
      ))}
    </div>
  );
};
