import { useState, useCallback, type ChangeEvent, type FormEvent } from 'react';
import type { ReceiptFormData } from '../types';
import { useReceiptAnalyzer } from './useReceiptAnalyzer';

export interface ReceiptFormInitialValues {
  name: string;
  amount: number;
  imageUrl?: string;
  date: Date;
}

export interface UseReceiptFormProps {
  onSubmit: (data: ReceiptFormData) => void;
  initialValues?: ReceiptFormInitialValues;
}

export interface UseReceiptFormReturn {
  name: string;
  amount: string;
  date: Date | null;
  imagePreview: string | null;
  isValid: boolean;
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (date: Date | null) => void;
  handleImagePickerChange: (file: File | null, preview: string | null) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
  // AI Analysis
  isAnalyzing: boolean;
  analysisError: string | null;
  clearAnalysisError: () => void;
  retryAnalysis: () => void;
  hasApiKey: boolean;
}

/**
 * Creates a unique key from initialValues to detect when they change
 */
const getInitialValuesKey = (values?: ReceiptFormInitialValues): string => {
  if (!values) return '';
  return `${values.name}-${values.amount}-${values.date.getTime()}-${values.imageUrl ?? ''}`;
};

/**
 * useReceiptForm Hook
 * Manages form state and validation for creating and editing receipts
 */
export const useReceiptForm = ({ onSubmit, initialValues }: UseReceiptFormProps): UseReceiptFormReturn => {
  // Use a key to track when initialValues change and reset state
  const initialValuesKey = getInitialValuesKey(initialValues);

  const [name, setName] = useState(initialValues?.name ?? '');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() ?? '');
  const [date, setDate] = useState<Date | null>(initialValues?.date ?? new Date());
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.imageUrl ?? null);
  const [lastInitialValuesKey, setLastInitialValuesKey] = useState(initialValuesKey);
  const [pendingAnalysisPreview, setPendingAnalysisPreview] = useState<string | null>(null);

  // AI Analysis
  const {
    analyze,
    isAnalyzing,
    error: analysisError,
    clearError: clearAnalysisError,
    hasApiKey,
  } = useReceiptAnalyzer();

  // Sync state when initialValues change (detected by key change)
  if (initialValuesKey !== lastInitialValuesKey) {
    setLastInitialValuesKey(initialValuesKey);
    if (initialValues) {
      setName(initialValues.name);
      setAmount(initialValues.amount.toString());
      setDate(initialValues.date);
      setImagePreview(initialValues.imageUrl ?? null);
      setImage(null);
    } else {
      setName('');
      setAmount('');
      setDate(new Date());
      setImagePreview(null);
      setImage(null);
    }
  }

  const isValid = name.trim().length > 0 && parseFloat(amount) > 0 && date !== null;

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  }, []);

  const handleDateChange = useCallback((newDate: Date | null) => {
    setDate(newDate);
  }, []);

  const handleImagePickerChange = useCallback(
    async (file: File | null, preview: string | null) => {
      setImage(file);
      setImagePreview(preview);

      // If we have a new image and API key is configured, analyze it
      if (preview && hasApiKey) {
        setPendingAnalysisPreview(preview);
        clearAnalysisError();

        const result = await analyze(preview);

        if (result) {
          // Pre-fill form fields with extracted data
          if (result.name) {
            setName(result.name);
          }
          if (result.amount !== null) {
            setAmount(result.amount.toString());
          }
        }
      }
    },
    [hasApiKey, analyze, clearAnalysisError]
  );

  const retryAnalysis = useCallback(async () => {
    if (pendingAnalysisPreview && hasApiKey) {
      clearAnalysisError();

      const result = await analyze(pendingAnalysisPreview);

      if (result) {
        if (result.name) {
          setName(result.name);
        }
        if (result.amount !== null) {
          setAmount(result.amount.toString());
        }
      }
    }
  }, [pendingAnalysisPreview, hasApiKey, analyze, clearAnalysisError]);

  const resetImageState = useCallback(() => {
    setImage(null);
    setImagePreview(null);
  }, []);

  const resetForm = useCallback(() => {
    setName(initialValues?.name ?? '');
    setAmount(initialValues?.amount?.toString() ?? '');
    setDate(initialValues?.date ?? new Date());
    if (initialValues?.imageUrl) {
      setImagePreview(initialValues.imageUrl);
    } else {
      resetImageState();
    }
    setImage(null);
    setPendingAnalysisPreview(null);
    clearAnalysisError();
  }, [initialValues, resetImageState, clearAnalysisError]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isValid || !date) {
        return;
      }

      const formData: ReceiptFormData = {
        name: name.trim(),
        amount: parseFloat(amount),
        image: image ?? undefined,
        date,
      };

      onSubmit(formData);
      resetForm();
    },
    [name, amount, date, image, isValid, onSubmit, resetForm]
  );

  return {
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
    // AI Analysis
    isAnalyzing,
    analysisError,
    clearAnalysisError,
    retryAnalysis,
    hasApiKey,
  };
};
