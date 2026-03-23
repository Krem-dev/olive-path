import { create } from 'zustand';
import { AuthState } from '../types';

/**
 * Mock auth store — no backend, just local state.
 * Will be replaced with real API calls later.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasOnboarded: false,

  login: (_email: string, _password: string) => {
    // Mock: instantly "log in" with a fake user
    set({
      user: {
        id: '1',
        name: 'Guest User',
        email: _email,
      },
      isAuthenticated: true,
    });
  },

  signup: (name: string, email: string, _password: string) => {
    set({
      user: {
        id: '1',
        name,
        email,
      },
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  completeOnboarding: () => {
    set({ hasOnboarded: true });
  },
}));
