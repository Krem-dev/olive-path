import { create } from 'zustand';
import { AuthState, User } from '../types';
import { authApi } from '../api/auth';
import { configureApi } from '../api/client';
import { tokenStorage } from '../storage/tokenStorage';

interface AuthStore extends AuthState {
  /** In-memory token cache so the API client can read it synchronously. */
  token: string | null;
  refreshToken: string | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrating: true,
  hasOnboarded: false,

  hydrate: async () => {
    const stored = await tokenStorage.get();
    set({
      token: stored.token,
      refreshToken: stored.refreshToken,
      user: stored.user as User | null,
      isAuthenticated: !!stored.token && !!stored.user,
      isHydrating: false,
    });
  },

  login: async (email, password) => {
    const result = await authApi.login({ email, password });
    await tokenStorage.save(result.token, result.refreshToken, result.user);
    set({
      user: result.user as User,
      token: result.token,
      refreshToken: result.refreshToken,
      isAuthenticated: true,
    });
  },

  signup: async (name, email, password) => {
    const result = await authApi.register({ name, email, password });
    await tokenStorage.save(result.token, result.refreshToken, result.user);
    set({
      user: result.user as User,
      token: result.token,
      refreshToken: result.refreshToken,
      isAuthenticated: true,
    });
  },

  forgotPassword: async (email) => {
    await authApi.forgotPassword({ email });
  },

  logout: async () => {
    await tokenStorage.clear();
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  completeOnboarding: () => set({ hasOnboarded: true }),
}));

// Wire the api client so every request reads the live token and a 401
// triggers a clean logout.
configureApi({
  getToken: () => useAuthStore.getState().token,
  onUnauthorized: () => {
    const { isAuthenticated, logout } = useAuthStore.getState();
    if (isAuthenticated) void logout();
  },
});
