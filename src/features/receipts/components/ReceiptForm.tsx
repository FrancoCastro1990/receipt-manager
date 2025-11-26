import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Save } from 'lucide-react';
import { cn } from '@/lib/cn';
import { DatePicker, ImagePicker } from '@/features/shared';
import { useReceiptForm, type ReceiptFormInitialValues } from '../hooks';
import type { ReceiptFormData } from '../types';

export interface ReceiptFormProps {
  onSubmit: (data: ReceiptFormData) => void;
  resetFormRef?: React.MutableRefObject<(() => void) | null>;
  initialValues?: ReceiptFormInitialValues;
  mode?: 'create' | 'edit';
  isSubmitting?: boolean;
  className?: string;
}

/**
 * ReceiptForm Component
 * Form for adding or editing receipts with name, amount, date, and optional image
 */
export const ReceiptForm: React.FC<ReceiptFormProps> = ({
  onSubmit,
  resetFormRef,
  initialValues,
  mode = 'create',
  isSubmitting = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const {
    name,
    amount,
    date,
    imagePreview,
    isValid,
    handleNameChange,
    handleAmountChange,
    handleDateChange,
    handleImagePickerChange,
    handleSubmit,
    resetForm,
  } = useReceiptForm({ onSubmit, initialValues });

  const isEditMode = mode === 'edit';
  const titleKey = isEditMode ? 'receipts.form.editTitle' : 'receipts.form.title';
  const submitKey = isEditMode ? 'receipts.form.save' : 'receipts.form.submit';

  // Expose resetForm function to parent via ref
  useEffect(() => {
    if (resetFormRef) {
      resetFormRef.current = resetForm;
    }
  }, [resetFormRef, resetForm]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('card-base p-6', className)}
    >
      <h2 className="text-lg font-semibold text-primary-900 mb-4">{t(titleKey)}</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="receipt-name" className="block text-sm font-medium text-primary-700 mb-1">
            {t('receipts.form.name')}
          </label>
          <input
            id="receipt-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder={t('receipts.form.namePlaceholder')}
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="receipt-amount" className="block text-sm font-medium text-primary-700 mb-1">
            {t('receipts.form.amount')}
          </label>
          <input
            id="receipt-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder={t('receipts.form.amountPlaceholder')}
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="receipt-date" className="block text-sm font-medium text-primary-700 mb-1">
            {t('receipts.form.date')}
          </label>
          <DatePicker
            id="receipt-date"
            value={date}
            onChange={handleDateChange}
            placeholder={t('receipts.form.datePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">{t('receipts.form.image')}</label>
          <ImagePicker
            imagePreview={imagePreview}
            onImageChange={handleImagePickerChange}
            initialPreview={initialValues?.imageUrl}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-700 hover:bg-primary-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : isEditMode ? (
            <Save className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span>{isSubmitting ? t('common.loading') : t(submitKey)}</span>
        </button>
      </div>
    </form>
  );
};
