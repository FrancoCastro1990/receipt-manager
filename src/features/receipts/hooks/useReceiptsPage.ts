import { useReceipts } from './useReceipts';
import { useTabsNavigation, type ReceiptsTabId } from './useTabsNavigation';
import { useFilteredReceipts } from './useFilteredReceipts';
import { useDashboardAnalytics } from './useDashboardAnalytics';
import { useAddReceiptModal, type ModalState, type ModalMode } from './useAddReceiptModal';
import { useSettings } from '@/features/settings';
import type { Receipt, ReceiptsStats, DateRangeStats, ReceiptFormData } from '../types';
import type { DateRangePreset, DateRange } from '@/features/settings';

export interface UseReceiptsPageReturn {
  // Data
  receipts: Receipt[];
  stats: ReceiptsStats;
  isLoading: boolean;
  error: Error | null;

  // Tabs
  activeTab: ReceiptsTabId;
  setActiveTab: (tab: ReceiptsTabId) => void;

  // Filtered receipts (for Tab Boletas)
  filteredReceipts: Receipt[];
  filteredCount: number;
  filteredAmount: number;
  filterPreset: DateRangePreset;
  filterCustomRange?: DateRange;
  handleFilterChange: (preset: DateRangePreset, customRange?: DateRange) => void;

  // Analytics (for Tab Statistics)
  analyticsPreset: DateRangePreset;
  analyticsCustomRange?: DateRange;
  dateRangeStats: DateRangeStats;
  totalProfit: number;
  todayProfit: number;
  profitPercentage: number;
  handleAnalyticsChange: (preset: DateRangePreset, customRange?: DateRange) => void;

  // Modal
  isModalOpen: boolean;
  modalState: ModalState;
  modalMode: ModalMode;
  editingReceipt: Receipt | null;
  modalErrorMessage: string | null;
  isModalSubmitting: boolean;
  openModal: () => void;
  openEditModal: (receipt: Receipt) => void;
  closeModal: () => void;
  handleModalSubmit: (data: ReceiptFormData) => void;
  handleAddAnother: () => void;
  handleFinish: () => void;
  handleRetry: () => void;
  resetFormRef: React.MutableRefObject<(() => void) | null>;

  // Mutations
  deleteReceipt: (id: string) => void;
  isDeleting: boolean;
}

/**
 * useReceiptsPage Hook
 * Orchestrator hook that composes all hooks needed for the receipts page.
 * Combines data fetching, tabs navigation, filtering, analytics, and modal state.
 */
export const useReceiptsPage = (): UseReceiptsPageReturn => {
  // Get settings
  const { settings, isLoading: settingsLoading } = useSettings();

  // Data layer
  const {
    receipts,
    stats,
    isLoading: receiptsLoading,
    error,
    createReceiptAsync,
    updateReceipt,
    deleteReceipt,
    isDeleting,
  } = useReceipts();

  // Combined loading state
  const isLoading = receiptsLoading || settingsLoading;

  // Tabs navigation
  const { activeTab, setActiveTab } = useTabsNavigation();

  // Filtered receipts for Tab Boletas
  const {
    filteredReceipts,
    filteredCount,
    filteredAmount,
    selectedPreset: filterPreset,
    customDateRange: filterCustomRange,
    handlePresetChange: handleFilterChange,
  } = useFilteredReceipts({ receipts, settings });

  // Dashboard analytics for Tab Statistics
  const {
    selectedPreset: analyticsPreset,
    customDateRange: analyticsCustomRange,
    dateRangeStats,
    totalProfit,
    todayProfit,
    handlePresetChange: handleAnalyticsChange,
  } = useDashboardAnalytics({ receipts, stats, settings });

  // Modal for adding/editing receipts
  const {
    isOpen: isModalOpen,
    modalState,
    modalMode,
    editingReceipt,
    errorMessage: modalErrorMessage,
    isSubmitting: isModalSubmitting,
    openModal,
    openEditModal,
    closeModal,
    handleSubmit: handleModalSubmit,
    handleAddAnother,
    handleFinish,
    handleRetry,
    resetFormRef,
  } = useAddReceiptModal({ onReceiptCreated: createReceiptAsync, onReceiptUpdated: updateReceipt });

  return {
    // Data
    receipts,
    stats,
    isLoading,
    error,

    // Tabs
    activeTab,
    setActiveTab,

    // Filtered receipts
    filteredReceipts,
    filteredCount,
    filteredAmount,
    filterPreset,
    filterCustomRange,
    handleFilterChange,

    // Analytics
    analyticsPreset,
    analyticsCustomRange,
    dateRangeStats,
    totalProfit,
    todayProfit,
    profitPercentage: settings.profitPercentage,
    handleAnalyticsChange,

    // Modal
    isModalOpen,
    modalState,
    modalMode,
    editingReceipt,
    modalErrorMessage,
    isModalSubmitting,
    openModal,
    openEditModal,
    closeModal,
    handleModalSubmit,
    handleAddAnother,
    handleFinish,
    handleRetry,
    resetFormRef,

    // Mutations
    deleteReceipt,
    isDeleting,
  };
};
