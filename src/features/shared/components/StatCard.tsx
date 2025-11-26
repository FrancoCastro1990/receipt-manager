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
    className={cn('card-base card-hover p-4', className)}
  >
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div>
        <p className="text-sm text-primary-500">{label}</p>
        <p className="text-xl font-bold text-primary-900">{value}</p>
      </div>
    </div>
  </div>
);
