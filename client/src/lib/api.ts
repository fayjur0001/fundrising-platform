'use client';

// client/src/lib/api.ts
import { getAccessToken, setAccessToken, clearAccessToken } from './auth-store';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

// ── Types ─────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// ── Token refresh ─────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // sends httpOnly refreshToken cookie automatically
    });

    if (!response.ok) {
      clearAccessToken();
      return null;
    }

    const data = (await response.json()) as ApiResponse<{ accessToken: string }>;
    setAccessToken(data.data.accessToken);
    return data.data.accessToken;
  } catch {
    clearAccessToken();
    return null;
  }
}

// ── Core request ──────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options?: RequestInit,
  retry = true
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // ensures cookie is sent on every request
  });

  // Silent token refresh on 401
  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      return request<T>(endpoint, options, false); // retry once with new token
    }

    clearAccessToken();
    window.location.href = '/auth/login';
    throw new Error('Session expired. Redirecting to login.');
  }

  const data = (await response.json()) as ApiResponse<T>;
  return data;
}

// ── HTTP verb helpers ─────────────────────────────────────────────────────

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

// ── Auth API ──────────────────────────────────────────────────────────────

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
  };
  accessToken: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> => {
    const result = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    if (result.success && result.data.accessToken) {
      setAccessToken(result.data.accessToken); // store in memory only
    }
    return result;
  },

  register: (data: RegisterData) =>
    api.post<{ message: string }>('/auth/register', data),

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    clearAccessToken(); // wipe memory token; server clears the cookie
  },

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),

  refreshToken: () => refreshAccessToken(),
};

// ── Campaign API ──────────────────────────────────────────────────────────

export const campaignApi = {
  getAll: (params?: string) =>
    api.get<unknown[]>(`/campaigns${params ? `?${params}` : ''}`),

  getBySlug: (slug: string) =>
    api.get<unknown>(`/campaigns/${slug}`),

  getMy: (params?: string) =>
    api.get<unknown[]>(`/campaigns/my${params ? `?${params}` : ''}`),

  create: (data: unknown) =>
    api.post<unknown>('/campaigns', data),

  update: (id: string, data: unknown) =>
  api.put<unknown>(`/campaigns/${id}`, data),

  delete: (id: string) =>
  api.delete<unknown>(`/campaigns/${id}`),

  uploadCover: (slug: string, formData: FormData) =>
    // Content-Type omitted — browser sets multipart/form-data with boundary
    request<unknown>(`/campaigns/${slug}/cover`, {
      method: 'PATCH',
      body: formData,
      headers: {},
    }),
};

// ── Donation API ──────────────────────────────────────────────────────────

export const donationApi = {
  create: (data: { campaignId: string; amount: number }) =>
    api.post<unknown>('/donations', data),

  getMy: (params?: string) =>
    api.get<unknown[]>(`/donations/my${params ? `?${params}` : ''}`),

  getCampaignDonations: (campaignId: string, params?: string) =>
    api.get<unknown[]>(
      `/donations/campaign/${campaignId}${params ? `?${params}` : ''}`
    ),

  initiatePayment: (donationId: string) =>
    api.post<{ gatewayUrl: string }>('/payments/initiate', { donationId }),
};

// ── Notification API ──────────────────────────────────────────────────────

export const notificationApi = {
  getAll: (params?: string) =>
    api.get<unknown[]>(`/notifications${params ? `?${params}` : ''}`),

  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    api.patch<unknown>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<{ count: number }>('/notifications/read-all'),
};