import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'op.auth.token';
const REFRESH_KEY = 'op.auth.refreshToken';
const USER_KEY = 'op.auth.user';

export interface StoredUser {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export const tokenStorage = {
  async get(): Promise<{
    token: string | null;
    refreshToken: string | null;
    user: StoredUser | null;
  }> {
    const [[, token], [, refreshToken], [, userJson]] =
      await AsyncStorage.multiGet([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
    let user: StoredUser | null = null;
    try {
      user = userJson ? (JSON.parse(userJson) as StoredUser) : null;
    } catch {
      user = null;
    }
    return { token, refreshToken, user };
  },

  async save(
    token: string,
    refreshToken: string,
    user: StoredUser,
  ): Promise<void> {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [REFRESH_KEY, refreshToken],
      [USER_KEY, JSON.stringify(user)],
    ]);
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
  },
};
