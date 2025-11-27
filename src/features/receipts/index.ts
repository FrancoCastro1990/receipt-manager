export { Receipts } from './pages/Receipts';

// Types
export type {
  Receipt,
  ReceiptFormData,
  UpdateReceiptData,
  ReceiptsStats,
  ReceiptStorageData,
  DateRangeStats,
} from './types';

// Hooks
export {
  useDashboardAnalytics,
  type UseDashboardAnalyticsProps,
  type UseDashboardAnalyticsReturn,
} from './hooks';

export {
  useAddReceiptModal,
  type ModalState,
  type ModalMode,
  type UseAddReceiptModalProps,
  type UseAddReceiptModalReturn,
} from './hooks';

export {
  useReceipts,
  type UseReceiptsReturn,
} from './hooks';

// Components
export { AddReceiptModal, type AddReceiptModalProps } from './components';

// Utils
export {
  calculateProfit,
  calculateDateRangeStats,
  filterReceiptsByDateRange,
} from './utils';
