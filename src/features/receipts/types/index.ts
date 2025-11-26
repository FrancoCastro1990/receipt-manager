/**
 * Receipt Types
 * Type definitions for the receipts feature
 */

export interface Receipt {
  id: string;
  name: string;
  amount: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface ReceiptFormData {
  name: string;
  amount: number;
  image?: File;
  date?: Date;
}

export interface UpdateReceiptData {
  id: string;
  name: string;
  amount: number;
  image?: File;
  date: Date;
  /** Existing image URL to preserve if no new image is provided */
  existingImageUrl?: string;
}

export interface ReceiptsStats {
  totalReceipts: number;
  totalAmount: number;
  todayReceipts: number;
  todayAmount: number;
}

/**
 * Raw receipt data as stored in localStorage
 * Dates are stored as ISO strings
 */
export interface ReceiptStorageData {
  id: string;
  name: string;
  amount: number;
  imageUrl?: string;
  createdAt: string;
}

/**
 * Date range analytics statistics
 */
export interface DateRangeStats {
  receiptsInRange: number;
  amountInRange: number;
  profitInRange: number;
  percentageOfTotal: number;
  percentageOfToday: number;
}
