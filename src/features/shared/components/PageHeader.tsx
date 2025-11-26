import React from 'react';
import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

/**
 * PageHeader Component
 * Reusable page header with icon, title, and description
 * Following the established pattern from Receipts page
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  className,
}) => (
  <div className={cn('mb-8', className)}>
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-primary-100 rounded-xl">
        <div className="h-8 w-8 text-primary-600">
          {icon}
        </div>
      </div>
      <h1 className="text-3xl font-bold text-primary-900">{title}</h1>
    </div>
    <p className="text-primary-500">{description}</p>
  </div>
);
