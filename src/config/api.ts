import { Platform } from 'react-native';

/** The client's live backend. */
const PRODUCTION_API = 'https://sienna-cheetah-741905.hostingersite.com/api';

/**
 * Local backend, used in development so UI work runs against seeded data
 * instead of live client records.
 *
 * The Android emulator cannot see the host's `localhost` — 10.0.2.2 is its
 * alias for the host machine. iOS simulators share the host network.
 *
 * Set USE_LOCAL_API to false to point development at production again.
 */
const USE_LOCAL_API = true;

const LOCAL_API = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  default: 'http://localhost:3000/api',
});

export const API_BASE_URL =
  __DEV__ && USE_LOCAL_API ? (LOCAL_API as string) : PRODUCTION_API;

/** Paystack callback URL the app listens for after a payment session. */
export const PAYSTACK_CALLBACK_URL = 'olivepath://payments/callback';
