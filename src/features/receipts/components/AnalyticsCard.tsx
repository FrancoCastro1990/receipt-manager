import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AnalyticsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  percentage?: number;
  percentageLabel?: string;
  bgColor: string;
  iconColor: string;
  className?: string;
}

/**
 * AnalyticsCard Component
 * Extended StatCard with percentage comparison display
 *
 * Features:
 * - Icon with customizable background and color
 * - Main value display
 * - Optional percentage with directional arrow
 * - Responsive and accessible design
 */
export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  icon,
  label,
  value,
  percentage,
  percentageLabel,
  bgColor,
  iconColor,
  className,
}) => {
  const showPercentage = percentage !== undefined && percentageLabel;
  const isPositive = percentage !== undefined && percentage >= 0;

  return (
    <div className={cn('card-base card-hover p-4', className)}>
      <div className="flex items-start gap-3">
        {/* Icon Container */}
        <div className={cn('p-3 rounded-xl shrink-0', bgColor)}>
          <div className={iconColor}>{icon}</div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-primary-500 truncate">
            {label}
          </p>
          <p className="text-xl font-bold text-primary-900 truncate">
            {value}
          </p>

          {/* Percentage Display */}
          {showPercentage && (
            <div
              className={cn(
                'flex items-center gap-1 mt-1',
                'text-sm font-medium',
                isPositive
                  ? 'text-primary-600'
                  : 'text-neutral-500'
              )}
            >
              {isPositive ? (
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>
                {Math.abs(percentage)}% {percentageLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
