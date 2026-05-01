import { api } from './client';
import { Devotion } from '../types/content';

export const devotionsApi = {
  current: () => api.get<Devotion>('/devotions/current'),
  list: (params: { page?: number; limit?: number } = {}) =>
    api.paginated<Devotion>('/devotions', { query: params }),
  byId: (id: number) => api.get<Devotion>(`/devotions/${id}`),
};
