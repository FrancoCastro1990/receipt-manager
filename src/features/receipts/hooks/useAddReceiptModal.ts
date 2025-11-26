import { useState, useCallback, useRef } from 'react';
import type { Receipt, ReceiptFormData, UpdateReceiptData } from '../types';

export type ModalState = 'form' | 'success' | 'error';
export type ModalMode = 'create' | 'edit';

export interface UseAddReceiptModalProps {
  onReceiptCreated: (data: ReceiptFormData) => Promise<Receipt>;
  onReceiptUpdated: (data: UpdateReceiptData) => void;
}

export interface UseAddReceiptModalReturn {
  // Modal state
  isOpen: boolean;
  modalState: ModalState;
  modalMode: ModalMode;
  editingReceipt: Receipt | null;
  errorMessage: string | null;
  isSubmitting: boolean;

  // Actions
  openModal: () => void;
  openEditModal: (receipt: Receipt) => void;
  closeModal: () => void;

  // Form submission
  handleSubmit: (data: ReceiptFormData) => void;

  // Post-submit actions
  handleAddAnother: () => void;
  handleFinish: () => void;
  handleRetry: () => void;

  // Ref for form reset (will be set by form)
  resetFormRef: React.MutableRefObject<(() => void) | null>;
}

/**
 * useAddReceiptModal Hook
 * Manages the receipt modal state for both create and edit modes
 */
export const useAddReceiptModal = ({
  onReceiptCreated,
  onReceiptUpdated,
}: UseAddReceiptModalProps): UseAddReceiptModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('form');
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resetFormRef = useRef<(() => void) | null>(null);

  const openModal = useCallback(() => {
    setModalMode('create');
    setEditingReceipt(null);
    setErrorMessage(null);
    setIsOpen(true);
    setModalState('form');
  }, []);

  const openEditModal = useCallback((receipt: Receipt) => {
    setModalMode('edit');
    setEditingReceipt(receipt);
    setErrorMessage(null);
    setIsOpen(true);
    setModalState('form');
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalState('form');
    setEditingReceipt(null);
    setErrorMessage(null);
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: ReceiptFormData) => {
      if (modalMode === 'edit' && editingReceipt) {
        const updateData: UpdateReceiptData = {
          id: editingReceipt.id,
          name: data.name,
          amount: data.amount,
          image: data.image,
          date: data.date ?? editingReceipt.createdAt,
          existingImageUrl: data.image ? undefined : editingReceipt.imageUrl,
        };
        onReceiptUpdated(updateData);
        closeModal();
      } else {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
          await onReceiptCreated(data);
          setModalState('success');
        } catch (error) {
          const message =
            error instanceof Error && error.message === 'STORAGE_QUOTA_EXCEEDED'
              ? 'STORAGE_QUOTA_EXCEEDED'
              : 'UNKNOWN_ERROR';
          setErrorMessage(message);
          setModalState('error');
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [modalMode, editingReceipt, onReceiptCreated, onReceiptUpdated, closeModal]
  );

  const handleAddAnother = useCallback(() => {
    setModalState('form');
    setErrorMessage(null);
    resetFormRef.current?.();
  }, []);

  const handleFinish = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const handleRetry = useCallback(() => {
    setModalState('form');
    setErrorMessage(null);
  }, []);

  return {
    isOpen,
    modalState,
    modalMode,
    editingReceipt,
    errorMessage,
    isSubmitting,
    openModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleAddAnother,
    handleFinish,
    handleRetry,
    resetFormRef,
  };
};
