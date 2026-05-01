import { Platform } from 'react-native';

/**
 * Base URL for the backend API.
 *
 * Override at build time with:   EXPO_PUBLIC_API_URL=https://api.olivepath.org
 *
 * In dev, Android emulator uses 10.0.2.2 to reach the host machine,
 * iOS simulator and web use localhost. For physical devices, set
 * EXPO_PUBLIC_API_URL to your machine's LAN IP (e.g. http://192.168.1.x:3000/api).
 */
const FROM_ENV = process.env.EXPO_PUBLIC_API_URL;

const DEV_DEFAULT =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api';

export const API_BASE_URL = FROM_ENV || DEV_DEFAULT;

/** Paystack callback URL the app listens for after a payment session. */
export const PAYSTACK_CALLBACK_URL = 'olivepath://payments/callback';
