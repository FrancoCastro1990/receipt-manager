import { fileToBase64 } from '@/lib/fileUtils';
import type { Receipt, ReceiptFormData, ReceiptStorageData, UpdateReceiptData } from '../types';

const STORAGE_KEY = 'receipts';

/**
 * Receipt Service Interface
 * Defines the contract for receipt data operations
 */
export interface IReceiptService {
  getAll(): Promise<Receipt[]>;
  create(data: ReceiptFormData): Promise<Receipt>;
  update(data: UpdateReceiptData): Promise<Receipt>;
  delete(id: string): Promise<void>;
}

/**
 * MockReceiptService
 * Implementation using localStorage for persistence
 */
export class MockReceiptService implements IReceiptService {
  /**
   * Retrieves all receipts from localStorage
   */
  async getAll(): Promise<Receipt[]> {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const receipts: ReceiptStorageData[] = JSON.parse(data);

    return receipts.map(this.parseReceipt);
  }

  /**
   * Creates a new receipt and persists to localStorage
   */
  async create(data: ReceiptFormData): Promise<Receipt> {
    const receipts = await this.getAll();

    let imageUrl: string | undefined;

    if (data.image) {
      imageUrl = await fileToBase64(data.image);
    }

    const newReceipt: Receipt = {
      id: crypto.randomUUID(),
      name: data.name,
      amount: data.amount,
      imageUrl,
      createdAt: new Date(),
    };

    const updatedReceipts = [newReceipt, ...receipts];
    this.saveToStorage(updatedReceipts);

    return newReceipt;
  }

  /**
   * Updates an existing receipt
   */
  async update(data: UpdateReceiptData): Promise<Receipt> {
    const receipts = await this.getAll();
    const index = receipts.findIndex((receipt) => receipt.id === data.id);

    if (index === -1) {
      throw new Error(`Receipt with id ${data.id} not found`);
    }

    let imageUrl: string | undefined = data.existingImageUrl;

    if (data.image) {
      imageUrl = await fileToBase64(data.image);
    }

    const updatedReceipt: Receipt = {
      id: data.id,
      name: data.name,
      amount: data.amount,
      imageUrl,
      createdAt: data.date,
    };

    receipts[index] = updatedReceipt;
    this.saveToStorage(receipts);

    return updatedReceipt;
  }

  /**
   * Deletes a receipt by ID
   */
  async delete(id: string): Promise<void> {
    const receipts = await this.getAll();
    const updatedReceipts = receipts.filter((receipt) => receipt.id !== id);
    this.saveToStorage(updatedReceipts);
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

  /**
   * Saves receipts array to localStorage
   * Throws an error if storage quota is exceeded
   */
  private saveToStorage(receipts: Receipt[]): void {
    const storageData: ReceiptStorageData[] = receipts.map((receipt) => ({
      ...receipt,
      createdAt: receipt.createdAt.toISOString(),
    }));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('STORAGE_QUOTA_EXCEEDED');
      }
      throw error;
    }
  }
}

export default MockReceiptService;
