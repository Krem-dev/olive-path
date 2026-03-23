/**
 * Olive Path — Content Types
 */

export interface Devotion {
  id: string;
  date: string;
  scripture: string;
  scriptureRef: string;
  encouragement: string;
}

export type ContentType = 'video' | 'audio' | 'reading';

export interface Sermon {
  id: string;
  title: string;
  scripture: string;
  summary: string;
  thumbnailUrl: string;
  audioUrl?: string;
  videoId?: string; // YouTube video ID
  duration: string;
  date: string;
  category: 'preaching' | 'motivation';
  contentType: ContentType;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  scripture: string;
  category: string;
}
