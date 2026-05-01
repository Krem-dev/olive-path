import { api } from './client';

export interface CounsellingPayload {
  fullName: string;
  phone: string;
  email?: string;
  type: string;
  preferredDate?: string;
  concern?: string;
}

export interface PastorPayload {
  fullName: string;
  church: string;
  phone: string;
  email: string;
  programDate?: string;
  location?: string;
  message?: string;
}

export const bookingsApi = {
  counselling: (payload: CounsellingPayload) =>
    api.post<{ id: number }>('/bookings/counselling', payload),
  pastor: (payload: PastorPayload) =>
    api.post<{ id: number }>('/bookings/pastor', payload),
};
