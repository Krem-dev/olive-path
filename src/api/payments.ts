import { api } from './client';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type InitializeResponse =
  | { type: 'free'; purchaseId: number }
  | { type: 'paid'; reference: string; authorizationUrl: string };

export const paymentsApi = {
  initialize: (bookId: number) =>
    api.post<InitializeResponse>('/payments/initialize', { bookId }),

  verify: (reference: string) =>
    api.get<{ status: PaymentStatus | 'free'; bookId: number }>(
      `/payments/verify/${encodeURIComponent(reference)}`,
    ),
};
