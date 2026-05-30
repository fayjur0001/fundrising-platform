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

// ── Domain types ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  story: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  category: string;
  // API returns UPPERCASE ('ACTIVE', 'PAUSED' etc.)
  status: 'ACTIVE' | 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' | 'PAUSED' | 'SUSPENDED';
  coverImage: string | null;
  images: string[];
  beneficiaryName: string;
  beneficiaryInfo: string | null;
  deadline: string | null;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: Pick<UserProfile, 'id' | 'name' | 'avatar'>;
  // Convenience aliases — populated from creator when components need flat fields
  creatorName?: string;
  creatorAvatar?: string;
}

export interface Donation {
  id: string;
  amount: number;
  message: string | null;
  isAnonymous: boolean;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  donorId: string;
  campaignId: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  donor?: Pick<UserProfile, 'id' | 'name' | 'avatar'>;
  campaign?: Pick<Campaign, 'id' | 'slug' | 'title' | 'coverImage'>;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

export interface CreateCampaignInput {
  title: string;
  description: string;
  story: string;
  goalAmount: number;
  category: string;
  beneficiaryName: string;
  beneficiaryInfo?: string;
  deadline?: string;
  images?: string[];
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {}

// ── Token refresh ─────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
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
    credentials: 'include',
  });

  // Silent token refresh on 401
  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      return request<T>(endpoint, options, false);
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

  // ── NEW: multipart/form-data PATCH (for avatar upload) ─────────────────
  patchForm: <T>(endpoint: string, formData: FormData) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: formData,
      headers: {},
    }),
};

// ── Auth API ──────────────────────────────────────────────────────────────

interface LoginResponse {
  user: Pick<UserProfile, 'id' | 'name' | 'email' | 'role' | 'avatar'>;
  accessToken: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const authApi = {
  // rememberMe param backend-এ পাঠানো হচ্ছে যাতে cookie maxAge ঠিক হয়
  login: async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<ApiResponse<LoginResponse>> => {
    const result = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
      rememberMe,
    });
    if (result.success && result.data.accessToken) {
      setAccessToken(result.data.accessToken);
    }
    return result;
  },

  register: (data: RegisterData) =>
    api.post<{ message: string }>('/auth/register', data),

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    clearAccessToken();
  },

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),

  refreshToken: () => refreshAccessToken(),

  verifyEmail: (token: string) =>
    api.post<{ message: string }>('/auth/verify-email', { token }),
};

// ── User API ──────────────────────────────────────────────────────────────

export const userApi = {
  getMe: () => api.get<UserProfile>('/users/me'),

  updateMe: (data: Partial<Pick<UserProfile, 'name' | 'phone' | 'address'>>) =>
    api.put<UserProfile>('/users/me', data),

  // ── NEW: upload avatar via PATCH /users/avatar ──────────────────────────
  uploadAvatar: (file: File): Promise<ApiResponse<UserProfile>> => {
    const formData = new FormData();
    formData.append('image', file);
    return api.patchForm<UserProfile>('/users/avatar', formData);
  },
};

// ── Campaign API ──────────────────────────────────────────────────────────

export const campaignApi = {
  getAll: (params?: string) =>
    api.get<Campaign[]>(`/campaigns${params ? `?${params}` : ''}`),

  getBySlug: (slug: string) =>
    api.get<Campaign>(`/campaigns/${slug}`),

  getMy: (params?: string) =>
    api.get<Campaign[]>(`/campaigns/my${params ? `?${params}` : ''}`),

  create: (data: CreateCampaignInput) =>
    api.post<Campaign>('/campaigns', data),

  update: (id: string, data: UpdateCampaignInput) =>
    api.put<Campaign>(`/campaigns/${id}`, data),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/campaigns/${id}`),

  uploadCover: (slug: string, formData: FormData) =>
    request<Campaign>(`/campaigns/${slug}/cover`, {
      method: 'PATCH',
      body: formData,
      headers: {},
    }),

  getUpdates: (campaignId: string) =>
    api.get<CampaignUpdate[]>(`/campaigns/${campaignId}/updates`),
};

export interface CampaignUpdate {
  id?: string;
  date: string;
  title: string;
  content: string;
}

// ── Donation API ──────────────────────────────────────────────────────────

export const donationApi = {
  create: (data: { campaignId: string; amount: number; message?: string; isAnonymous?: boolean }) =>
    api.post<Donation>('/donations', data),

  getMy: (params?: string) =>
    api.get<Donation[]>(`/donations/my${params ? `?${params}` : ''}`),

  getCampaignDonations: (campaignId: string, params?: string) =>
    api.get<Donation[]>(
      `/donations/campaign/${campaignId}${params ? `?${params}` : ''}`
    ),

  initiatePayment: (donationId: string) =>
    api.post<{ gatewayUrl: string }>('/payments/initiate', { donationId }),
};

// ── Notification API ──────────────────────────────────────────────────────

export const notificationApi = {
  getAll: (params?: string) =>
    api.get<Notification[]>(`/notifications${params ? `?${params}` : ''}`),

  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    api.patch<Notification>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<{ count: number }>('/notifications/read-all'),
};