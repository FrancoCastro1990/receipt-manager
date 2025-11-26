import { useState, useCallback, useRef } from 'react';
import type { Receipt, ReceiptFormData, UpdateReceiptData } from '../types';

export type ModalState = 'form' | 'success';
export type ModalMode = 'create' | 'edit';

export interface UseAddReceiptModalProps {
  onReceiptCreated: (data: ReceiptFormData) => void;
  onReceiptUpdated: (data: UpdateReceiptData) => void;
}

export interface UseAddReceiptModalReturn {
  // Modal state
  isOpen: boolean;
  modalState: ModalState;
  modalMode: ModalMode;
  editingReceipt: Receipt | null;

  // Actions
  openModal: () => void;
  openEditModal: (receipt: Receipt) => void;
  closeModal: () => void;

  // Form submission
  handleSubmit: (data: ReceiptFormData) => void;

  // Post-submit actions
  handleAddAnother: () => void;
  handleFinish: () => void;

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
  const resetFormRef = useRef<(() => void) | null>(null);

  const openModal = useCallback(() => {
    setModalMode('create');
    setEditingReceipt(null);
    setIsOpen(true);
    setModalState('form');
  }, []);

  const openEditModal = useCallback((receipt: Receipt) => {
    setModalMode('edit');
    setEditingReceipt(receipt);
    setIsOpen(true);
    setModalState('form');
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalState('form');
    setEditingReceipt(null);
  }, []);

  const handleSubmit = useCallback(
    (data: ReceiptFormData) => {
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
        onReceiptCreated(data);
        setModalState('success');
      }
    },
    [modalMode, editingReceipt, onReceiptCreated, onReceiptUpdated, closeModal]
  );

  const handleAddAnother = useCallback(() => {
    setModalState('form');
    resetFormRef.current?.();
  }, []);

  const handleFinish = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return {
    isOpen,
    modalState,
    modalMode,
    editingReceipt,
    openModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleAddAnother,
    handleFinish,
    resetFormRef,
  };
};
