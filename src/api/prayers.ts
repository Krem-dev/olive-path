import { api } from './client';

export interface PrayerRequest {
  id: number;
  message: string;
  status: 'pending' | 'praying' | 'answered';
  createdAt: string;
}

export const prayersApi = {
  submit: (message: string) =>
    api.post<PrayerRequest>('/prayers', { message }),
  mine: () => api.get<PrayerRequest[]>('/prayers/me'),
};
