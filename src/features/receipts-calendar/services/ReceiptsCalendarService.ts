import type { Receipt, ReceiptStorageData } from '@/features/receipts';

const STORAGE_KEY = 'receipts';

/**
 * Receipts Calendar Service Interface
 * Defines the contract for calendar-specific receipt operations
 */
export interface IReceiptsCalendarService {
  getReceiptsByMonth(year: number, month: number): Promise<Receipt[]>;
  getReceiptsByDate(date: Date): Promise<Receipt[]>;
}

/**
 * MockReceiptsCalendarService
 * Implementation using localStorage for persistence
 * Shares the same storage key as the main receipts feature
 */
export class MockReceiptsCalendarService implements IReceiptsCalendarService {
  /**
   * Retrieves all receipts for a specific month
   */
  async getReceiptsByMonth(year: number, month: number): Promise<Receipt[]> {
    const allReceipts = await this.getAllReceipts();

    return allReceipts.filter((receipt) => {
      const receiptDate = receipt.createdAt;
      return (
        receiptDate.getFullYear() === year && receiptDate.getMonth() === month
      );
    });
  }

  /**
   * Retrieves all receipts for a specific date
   */
  async getReceiptsByDate(date: Date): Promise<Receipt[]> {
    const allReceipts = await this.getAllReceipts();

    return allReceipts.filter((receipt) => {
      const receiptDate = receipt.createdAt;
      return (
        receiptDate.getFullYear() === date.getFullYear() &&
        receiptDate.getMonth() === date.getMonth() &&
        receiptDate.getDate() === date.getDate()
      );
    });
  }

  /**
   * Retrieves all receipts from localStorage
   */
  private async getAllReceipts(): Promise<Receipt[]> {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const receipts: ReceiptStorageData[] = JSON.parse(data);

    return receipts.map(this.parseReceipt);
  }

  /**
   * Parses stored receipt data to Receipt type
   */
  private parseReceipt(data: ReceiptStorageData): Receipt {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  }
}

export default MockReceiptsCalendarService;
