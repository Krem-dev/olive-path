import { api } from './client';
import { StoredUser } from '../storage/tokenStorage';

export const usersApi = {
  updateMe: (input: {
    name?: string;
    notificationsEnabled?: boolean;
    avatarUrl?: string;
  }) => api.patch<StoredUser>('/users/me', input),
};
