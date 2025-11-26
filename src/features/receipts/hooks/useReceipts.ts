import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MockReceiptService } from '../services/ReceiptService';
import {
  receiptsQueryOptions,
  createReceiptMutationOptions,
  updateReceiptMutationOptions,
  deleteReceiptMutationOptions,
} from '../queries/options';
import { calculateStats } from '../utils/stats';
import type { Receipt, ReceiptFormData, ReceiptsStats, UpdateReceiptData } from '../types';

export interface UseReceiptsReturn {
  receipts: Receipt[];
  stats: ReceiptsStats;
  isLoading: boolean;
  error: Error | null;
  createReceipt: (data: ReceiptFormData) => void;
  createReceiptAsync: (data: ReceiptFormData) => Promise<Receipt>;
  updateReceipt: (data: UpdateReceiptData) => void;
  deleteReceipt: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

/**
 * useReceipts Hook
 * Main hook for receipts feature - handles all data fetching and mutations
 */
export const useReceipts = (): UseReceiptsReturn => {
  const service = useMemo(() => new MockReceiptService(), []);

  const {
    data: receipts = [],
    isLoading,
    error,
  } = useQuery(receiptsQueryOptions(service));

  const createMutation = useMutation(createReceiptMutationOptions(service));
  const updateMutation = useMutation(updateReceiptMutationOptions(service));
  const deleteMutation = useMutation(deleteReceiptMutationOptions(service));

  const stats = useMemo(() => calculateStats(receipts), [receipts]);

  return {
    receipts,
    stats,
    isLoading,
    error: error ?? null,
    createReceipt: createMutation.mutate,
    createReceiptAsync: createMutation.mutateAsync,
    updateReceipt: updateMutation.mutate,
    deleteReceipt: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
