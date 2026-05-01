import { api } from './client';
import { QAItem } from '../types/content';

export const qaApi = {
  list: (params: { category?: string; search?: string } = {}) =>
    api.get<QAItem[]>('/qa', { query: params }),
  categories: () => api.get<string[]>('/qa/categories'),
};
