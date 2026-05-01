import { api } from './client';
import { Book, BookProgress, BookChapter } from '../types/content';

export interface BookDetailResponse extends Book {
  owned: boolean;
  progress: BookProgress | null;
}

export interface OwnedBookResponse extends Book {
  progress: BookProgress | null;
}

export interface BookContentResponse {
  bookId: number;
  chapters: BookChapter[];
}

export const booksApi = {
  catalog: (params: { search?: string } = {}) =>
    api.get<Book[]>('/books', { query: params }),

  owned: () => api.get<OwnedBookResponse[]>('/books/owned'),

  byId: (id: number) => api.get<BookDetailResponse>(`/books/${id}`),

  content: (id: number) => api.get<BookContentResponse>(`/books/${id}/content`),

  progress: (id: number) => api.get<BookProgress | null>(`/books/${id}/progress`),

  updateProgress: (id: number, currentPage: number) =>
    api.patch<BookProgress>(`/books/${id}/progress`, { currentPage }),
};
