import { api } from './client';
import { StoredUser } from '../storage/tokenStorage';

export interface AuthResponse {
  user: StoredUser & {
    notificationsEnabled?: boolean;
    authProvider?: 'email' | 'google';
  };
  token: string;
  refreshToken: string;
}

export const authApi = {
  register: (input: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', input, { noAuth: true }),

  login: (input: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', input, { noAuth: true }),

  google: (input: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) => api.post<AuthResponse>('/auth/google', input, { noAuth: true }),

  forgotPassword: (input: { email: string }) =>
    api.post<{ message: string }>('/auth/forgot-password', input, {
      noAuth: true,
    }),

  me: () => api.get<StoredUser>('/auth/me'),
};
