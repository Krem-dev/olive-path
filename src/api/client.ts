import { API_BASE_URL } from '../config/api';

/**
 * Auth token getter — set once at boot from the auth store so every request
 * carries the latest token without circular imports.
 */
let getAuthToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export function configureApi(opts: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}): void {
  getAuthToken = opts.getToken;
  onUnauthorized = opts.onUnauthorized;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

interface RequestOpts {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Object whose values become URL query params. Strings, numbers, and booleans only. */
  query?: object;
  /** Skip the auth header (e.g. for /auth/login). */
  noAuth?: boolean;
  signal?: AbortSignal;
}

interface SuccessEnvelope<T> {
  success: true;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ErrorEnvelope {
  error: string;
  details?: unknown;
}

function buildUrl(path: string, query?: object): string {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query as Record<string, unknown>).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(
  path: string,
  opts: RequestOpts = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (!opts.noAuth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, opts.query), {
      method: opts.method || 'GET',
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
    });
  } catch (e) {
    throw new ApiError(0, 'Network error. Check your connection and try again.');
  }

  if (response.status === 401) onUnauthorized();

  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const err = json as ErrorEnvelope | null;
    throw new ApiError(
      response.status,
      err?.error || 'Request failed',
      err?.details,
    );
  }

  const env = json as SuccessEnvelope<T>;
  return env.data;
}

/** Same as request, but returns the full envelope (for paginated endpoints). */
async function requestEnvelope<T>(
  path: string,
  opts: RequestOpts = {},
): Promise<SuccessEnvelope<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (!opts.noAuth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, opts.query), {
      method: opts.method || 'GET',
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
    });
  } catch {
    throw new ApiError(0, 'Network error. Check your connection and try again.');
  }

  if (response.status === 401) onUnauthorized();

  const json = (await response.json().catch(() => null)) as
    | SuccessEnvelope<T>
    | ErrorEnvelope
    | null;

  if (!response.ok) {
    const err = json as ErrorEnvelope | null;
    throw new ApiError(
      response.status,
      err?.error || 'Request failed',
      err?.details,
    );
  }

  return json as SuccessEnvelope<T>;
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOpts, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOpts, 'method'>) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOpts, 'method'>) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOpts, 'method'>) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  delete: <T>(path: string, opts?: Omit<RequestOpts, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
  /** For endpoints with `pagination` envelope. */
  paginated: <T>(path: string, opts?: Omit<RequestOpts, 'method' | 'body'>) =>
    requestEnvelope<T[]>(path, { ...opts, method: 'GET' }),
};
