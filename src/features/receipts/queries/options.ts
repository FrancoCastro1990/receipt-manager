import { queryOptions, type MutationOptions } from '@tanstack/react-query';
import type { IReceiptService } from '../services/ReceiptService';
import type { Receipt, ReceiptFormData, UpdateReceiptData } from '../types';
import { receiptKeys } from './keys';
import { queryClient } from '@/lib/queryClient';

/**
 * Query options for fetching receipts list
 */
export const receiptsQueryOptions = (service: IReceiptService) =>
  queryOptions({
    queryKey: receiptKeys.lists(),
    queryFn: () => service.getAll(),
  });

/**
 * Mutation options for creating a receipt
 */
export const createReceiptMutationOptions = (
  service: IReceiptService
): MutationOptions<Receipt, Error, ReceiptFormData> => ({
  mutationFn: (data: ReceiptFormData) => service.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: receiptKeys.all });
  },
});

/**
 * Mutation options for updating a receipt
 */
export const updateReceiptMutationOptions = (
  service: IReceiptService
): MutationOptions<Receipt, Error, UpdateReceiptData> => ({
  mutationFn: (data: UpdateReceiptData) => service.update(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: receiptKeys.all });
  },
});

/**
 * Mutation options for deleting a receipt
 */
export const deleteReceiptMutationOptions = (
  service: IReceiptService
): MutationOptions<void, Error, string> => ({
  mutationFn: (id: string) => service.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: receiptKeys.all });
  },
});
