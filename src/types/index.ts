/**
 * Olive Path — Shared Types
 */

// ── Auth ──
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  hasOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
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
  SermonDetail: { sermonId: number };
  MotivationDetail: { sermonId: number };
  WeeklyDevotion: { devotionId?: number } | undefined;
  BookDetail: { bookId: number };
  BookReader: { bookId: number };
  Profile: undefined;
  Notifications: undefined;
  PrayerRequest: undefined;
  BookCounselling: undefined;
  BookEric: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Library: undefined;
  Profile: undefined;
};
