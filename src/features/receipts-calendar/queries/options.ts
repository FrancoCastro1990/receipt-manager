import { queryOptions } from '@tanstack/react-query';
import type { IReceiptsCalendarService } from '../services/ReceiptsCalendarService';
import { receiptsCalendarKeys } from './keys';

/**
 * Query options for fetching receipts by month
 */
export const receiptsMonthQueryOptions = (
  service: IReceiptsCalendarService,
  year: number,
  month: number
) =>
  queryOptions({
    queryKey: receiptsCalendarKeys.month(year, month),
    queryFn: () => service.getReceiptsByMonth(year, month),
  });

/**
 * Query options for fetching receipts by date
 */
export const receiptsDateQueryOptions = (
  service: IReceiptsCalendarService,
  date: Date
) =>
  queryOptions({
    queryKey: receiptsCalendarKeys.date(date.toISOString().split('T')[0]),
    queryFn: () => service.getReceiptsByDate(date),
  });
