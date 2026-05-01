import { api } from './client';
import { Program, Announcement } from '../types/content';

export const programsApi = {
  upcoming: () => api.get<Program[]>('/programs'),
};

export const announcementsApi = {
  list: () => api.get<Announcement[]>('/announcements'),
};
