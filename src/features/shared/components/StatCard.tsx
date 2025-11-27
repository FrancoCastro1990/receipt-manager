import React from 'react';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  bgColor,
  iconColor,
  className = '',
}) => (
  <div
    className={cn('card-base card-hover p-3 sm:p-4', className)}
  >
    <div className="flex items-center gap-2 sm:gap-3">
      <div className={cn('p-2 sm:p-3 rounded-xl shrink-0', bgColor)}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-primary-500 truncate">{label}</p>
        <p className="text-lg sm:text-xl font-bold text-primary-900 truncate">{value}</p>
      </div>
    </div>
  </div>
);
