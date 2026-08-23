/**
 * Olive Path — Content Types (matches backend response shapes)
 */

export interface Devotion {
  id: number;
  title: string;
  weekStart: string;       // YYYY-MM-DD
  weekEnd: string;
  scripture: string;
  scriptureRef: string;
  encouragement: string;
  reflection: string;
  prayer?: string | null;
  pastor: {
    name: string;
    title: string | null;
  };
}

export type ContentType = 'video' | 'audio' | 'reading';

export interface Sermon {
  id: number;
  title: string;
  scripture: string;
  summary: string;
  thumbnailUrl: string;
  audioUrl?: string | null;
  videoId?: string | null;
  duration: string;
  publishedAt: string;     // ISO date
  category: 'preaching' | 'motivation';
  contentType: ContentType;
  viewCount?: number;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

export interface QAItem {
  id: number;
  question: string;
  answer: string;
  scripture: string;
  category: string;
}

// ── Books ──
export interface Book {
  id: number;
  title: string;
  subtitle?: string | null;
  author: string;
  authorTitle?: string | null;
  description: string;
  coverUrl: string;
  pdfUrl?: string | null;
  pages: number;
  price: number;          // 0 = free; major units (e.g. ₵40)
  currency: string;
  categories: string[];   // backend returns split array
  publishedAt: string;
}

export interface BookProgress {
  currentPage: number;
  progress: number;       // 0..1
  lastOpenedAt: string;
}

export interface BookChapter {
  id: number;
  number: number;
  title: string;
  paragraphs: string[];
}
