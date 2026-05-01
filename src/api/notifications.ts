import { api } from './client';

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  type: 'new_teaching' | 'devotion' | 'general' | 'prayer';
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  list: () => api.get<ApiNotification[]>('/notifications'),
  markRead: (id: number) =>
    api.patch<ApiNotification>(`/notifications/${id}/read`),
  markAllRead: () =>
    api.patch<{ message: string }>('/notifications/read-all'),
};
