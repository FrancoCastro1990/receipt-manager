import React from 'react';
import { DateRangeSelector } from '@/features/shared';
import { cn } from '@/lib/cn';
import { FilteredReceiptsSummary } from './FilteredReceiptsSummary';
import { ReceiptList } from './ReceiptList';
import type { Receipt } from '../types';
import type { DateRangePreset, DateRange } from '@/features/settings';

export interface ReceiptsTabProps {
  receipts: Receipt[];
  filteredCount: number;
  filteredAmount: number;
  selectedPreset: DateRangePreset;
  customRange?: DateRange;
  onPresetChange: (preset: DateRangePreset, customRange?: DateRange) => void;
  onEditReceipt?: (receipt: Receipt) => void;
  onDeleteReceipt: (id: string) => void;
  className?: string;
}

/**
 * ReceiptsTab Component
 * Main tab content displaying date filter, summary stats, and receipt list
 */
export const ReceiptsTab: React.FC<ReceiptsTabProps> = ({
  receipts,
  filteredCount,
  filteredAmount,
  selectedPreset,
  customRange,
  onPresetChange,
  onEditReceipt,
  onDeleteReceipt,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Date filter */}
      <DateRangeSelector
        value={selectedPreset}
        customRange={customRange}
        onChange={onPresetChange}
      />

      {/* Summary */}
      <FilteredReceiptsSummary count={filteredCount} amount={filteredAmount} />

      {/* Receipts list */}
      <ReceiptList receipts={receipts} onEdit={onEditReceipt} onDelete={onDeleteReceipt} />
    </div>
  );
};
