import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/features/shared';
import { ReceiptForm } from './ReceiptForm';
import type { ReceiptFormData, Receipt } from '../types';
import type { ReceiptFormInitialValues } from '../hooks';

export type ModalState = 'form' | 'success';
export type ModalMode = 'create' | 'edit';

export interface AddReceiptModalProps {
  isOpen: boolean;
  modalState: ModalState;
  modalMode?: ModalMode;
  editingReceipt?: Receipt | null;
  onClose: () => void;
  onSubmit: (data: ReceiptFormData) => void;
  onAddAnother: () => void;
  onFinish: () => void;
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
  onClose,
  onSubmit,
  onAddAnother,
  onFinish,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {modalState === 'form' ? (
        <ReceiptForm
          onSubmit={onSubmit}
          resetFormRef={resetFormRef}
          initialValues={initialValues}
          mode={modalMode}
        />
      ) : (
        <div className="flex flex-col items-center py-6">
          <div className="success-checkmark">
            <Check className="h-8 w-8 text-white" />
          </div>
          <p className="mt-4 text-lg font-medium text-primary-900">
            {t('receipts.modal.success')}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onFinish}
              className="btn-secondary"
            >
              {t('receipts.modal.finish')}
            </button>
            <button
              type="button"
              onClick={onAddAnother}
              className="btn-primary"
            >
              {t('receipts.modal.addAnother')}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
