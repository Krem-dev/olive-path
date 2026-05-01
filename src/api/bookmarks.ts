import { api } from './client';
import { Sermon } from '../types/content';

export interface Bookmark {
  id: number;
  sermonId: number;
  createdAt: string;
  sermon?: Sermon;
}

export const bookmarksApi = {
  list: () => api.get<Bookmark[]>('/bookmarks'),
  toggle: (sermonId: number) =>
    api.post<{ bookmarked: boolean }>('/bookmarks/toggle', { sermonId }),
};
