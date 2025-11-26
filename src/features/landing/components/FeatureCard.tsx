import type React from 'react';
import { cn } from '@/lib/cn';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor?: string;
  iconColor?: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  bgColor = 'bg-primary-100',
  iconColor = 'text-primary-600',
  className = '',
}) => {
  return (
    <div className={cn('card-base card-hover p-6', className)}>
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
          bgColor,
          iconColor
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-primary-900 mb-2">{title}</h3>
      <p className="text-primary-500 text-sm">{description}</p>
    </div>
  );
};
