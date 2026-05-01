import { api } from './client';
import { Sermon } from '../types/content';

export interface SermonListParams {
  category?: 'preaching' | 'motivation';
  contentType?: 'video' | 'audio' | 'reading';
  search?: string;
  sort?: 'recent' | 'popular' | 'title';
  page?: number;
  limit?: number;
}

export const sermonsApi = {
  list: (params: SermonListParams = {}) =>
    api.paginated<Sermon>('/sermons', { query: params }),

  recent: () => api.get<Sermon[]>('/sermons/recent'),

  byId: (id: number) => api.get<Sermon>(`/sermons/${id}`),
};
