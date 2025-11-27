import { useState, useCallback, useMemo } from 'react';
import { useSettings } from '@/features/settings';
import {
  GeminiReceiptAnalyzerService,
  type ReceiptAnalysisResult,
} from '../services/ReceiptAnalyzerService';

export interface UseReceiptAnalyzerReturn {
  /** Analyze a receipt image and return extracted data */
  analyze: (imageBase64: string) => Promise<ReceiptAnalysisResult | null>;
  /** Whether analysis is in progress */
  isAnalyzing: boolean;
  /** Error message if analysis failed */
  error: string | null;
  /** Clear the error state */
  clearError: () => void;
  /** Whether the API key is configured */
  hasApiKey: boolean;
}

/**
 * useReceiptAnalyzer Hook
 * Manages receipt image analysis using Google Gemini API
 */
export const useReceiptAnalyzer = (): UseReceiptAnalyzerReturn => {
  const { settings } = useSettings();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasApiKey = Boolean(settings.googleApiKey);

  const service = useMemo(() => {
    if (!settings.googleApiKey) return null;
    return new GeminiReceiptAnalyzerService(settings.googleApiKey);
  }, [settings.googleApiKey]);

  const analyze = useCallback(
    async (imageBase64: string): Promise<ReceiptAnalysisResult | null> => {
      if (!service) {
        return null;
      }

      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await service.analyze(imageBase64);

        // Check if we got at least one field
        if (result.name === null && result.amount === null) {
          setError('receipts.analysis.noDataFound');
          return null;
        }

        return result;
      } catch (err) {
        console.error('Receipt analysis error:', err);

        // Handle specific error types
        if (err instanceof SyntaxError) {
          setError('receipts.analysis.parseError');
        } else if (err instanceof Error && err.message.includes('API_KEY')) {
          setError('receipts.analysis.invalidApiKey');
        } else {
          setError('receipts.analysis.error');
        }

        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [service]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyze,
    isAnalyzing,
    error,
    clearError,
    hasApiKey,
  };
};
