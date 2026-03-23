/**
 * Olive Path — Shared Types
 */

// ── Auth ──
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

// ── Navigation ──
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  SermonDetail: { sermonId: string };
  MotivationDetail: { sermonId: string };
  PlaylistDetail: { playlistId: string };
  Profile: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Library: undefined;
  Profile: undefined;
};
