import React, { useMemo } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/features/shared';
import { ReceiptForm } from './ReceiptForm';
import type { ReceiptFormData, Receipt } from '../types';
import type { ReceiptFormInitialValues } from '../hooks';

export type ModalState = 'form' | 'success' | 'error';
export type ModalMode = 'create' | 'edit';

export interface AddReceiptModalProps {
  isOpen: boolean;
  modalState: ModalState;
  modalMode?: ModalMode;
  editingReceipt?: Receipt | null;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: ReceiptFormData) => void;
  onAddAnother: () => void;
  onFinish: () => void;
  onRetry?: () => void;
  resetFormRef: React.MutableRefObject<(() => void) | null>;
}

/**
 * AddReceiptModal Component
 * Modal dialog for adding or editing receipts with form and success states
 */
export const AddReceiptModal: React.FC<AddReceiptModalProps> = ({
  isOpen,
  modalState,
  modalMode = 'create',
  editingReceipt,
  errorMessage,
  isSubmitting = false,
  onClose,
  onSubmit,
  onAddAnother,
  onFinish,
  onRetry,
  resetFormRef,
}) => {
  const { t } = useTranslation();
  const isEditMode = modalMode === 'edit';

  const title = isEditMode ? t('receipts.modal.editTitle') : t('receipts.modal.title');

  const initialValues = useMemo<ReceiptFormInitialValues | undefined>(() => {
    if (!editingReceipt) return undefined;
    return {
      name: editingReceipt.name,
      amount: editingReceipt.amount,
      imageUrl: editingReceipt.imageUrl,
      date: editingReceipt.createdAt,
    };
  }, [editingReceipt]);

  const renderContent = () => {
    if (modalState === 'error') {
      const errorText =
        errorMessage === 'STORAGE_QUOTA_EXCEEDED'
          ? t('receipts.error.storageQuotaExceeded')
          : t('common.error');

      return (
        <div className="flex flex-col items-center py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
            <AlertTriangle className="h-8 w-8 text-error-600" />
          </div>
          <p className="mt-4 text-center text-lg font-medium text-primary-900">
            {errorText}
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onFinish} className="btn-secondary">
              {t('receipts.modal.finish')}
            </button>
            {onRetry && (
              <button type="button" onClick={onRetry} className="btn-primary">
                {t('receipts.modal.retry')}
              </button>
            )}
          </div>
        </div>
      );
    }

    if (modalState === 'success') {
      return (
        <div className="flex flex-col items-center py-6">
          <div className="success-checkmark">
            <Check className="h-8 w-8 text-white" />
          </div>
          <p className="mt-4 text-lg font-medium text-primary-900">
            {t('receipts.modal.success')}
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onFinish} className="btn-secondary">
              {t('receipts.modal.finish')}
            </button>
            <button type="button" onClick={onAddAnother} className="btn-primary">
              {t('receipts.modal.addAnother')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <ReceiptForm
        onSubmit={onSubmit}
        resetFormRef={resetFormRef}
        initialValues={initialValues}
        mode={modalMode}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {renderContent()}
    </Modal>
  );
};
