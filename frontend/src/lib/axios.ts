import axios from 'axios';
import { clearCredentials } from '@/store/slices/authSlice';
import { store } from '@/store/store';
import { toast } from 'sonner';

import { AUTH_CONFIG } from './authUtils';

// Direct connection to the unified backend
const IS_SERVER = typeof window === 'undefined';

const getBrowserUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/v2`;
  }
  return 'http://127.0.0.1:5001/api/v2';
};

const BASE_URL = IS_SERVER 
  ? process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || (process.env.DOCKER === 'true' ? 'http://backend:5001/api/v2' : 'http://127.0.0.1:5001/api/v2')
  : getBrowserUrl(); // Always prioritize dynamic domain on the client side

// Basic utility to extract CSRF token from cookies if we have it
const getCsrfToken = () => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )csrf-token=([^;]+)'));
    if (match) return match[2];
  }
  return '';
};

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach fresh CSRF token on every public request
axiosPublic.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  config.params = { ...config.params, cb: Date.now() }; return config;
});

// Global Error Handler for public requests
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status !== 401) {
      if (error.response.status === 503 && error.response.data?.error === 'MAINTENANCE_MODE') {
        if (typeof window !== 'undefined') {
          window.location.href = '/maintenance';
        }
        return Promise.reject(error);
      }
      let message = error.response.data?.message || 'An unexpected error occurred';
      if (Array.isArray(message)) message = message[0];
      if (typeof window !== 'undefined') {
         toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach the token + fresh CSRF to private requests
axiosPrivate.interceptors.request.use(
  (config) => {
    // Fresh CSRF token
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Get token from localStorage (optional with cookies, but keeping for compatibility)
    let token = null;
    if (typeof window !== 'undefined') {
       token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
       if (token === 'undefined' || token === 'null') token = null;
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.params = { ...config.params, cb: Date.now() }; return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s specifically global auth failures
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Specifically handle token expiry vs network errors
    if (error?.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosPrivate(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let refreshToken = typeof window !== 'undefined' ? localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY) : null;
        if (refreshToken === 'undefined' || refreshToken === 'null') refreshToken = null;
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axiosPublic.post('/auth/refresh-token', { refreshToken });
        
        if (!response.data.success || !response.data.data) {
          throw new Error('Invalid refresh token');
        }

        const { token: newToken, refreshToken: newRefreshToken } = response.data.data;

        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, newToken);
          if (newRefreshToken) {
            localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);
          }
          const expires = AUTH_CONFIG.COOKIE_MAX_AGE;
          document.cookie = `${AUTH_CONFIG.TOKEN_KEY}=${newToken}; path=/; max-age=${expires}; SameSite=Lax`;
        }

        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // ONLY clear credentials if it's a definitive 401/403 from the refresh attempt
        // or if there is no refresh token available at all or if the refresh token is invalid.
        // Avoid clearing on 500s or timeouts during refresh.
        const isAuthError = (refreshError as any)?.response?.status === 401 || (refreshError as any)?.response?.status === 403;
        const isNoTokenError = (refreshError as Error)?.message === 'No refresh token available' || (refreshError as Error)?.message === 'Invalid refresh token';

        if (isAuthError || isNoTokenError) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
              localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
              localStorage.removeItem(AUTH_CONFIG.ROLE_KEY);
              document.cookie = `${AUTH_CONFIG.TOKEN_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
              document.cookie = `${AUTH_CONFIG.ROLE_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
            }
            
            try {
              if (store) {
                 store.dispatch(clearCredentials());
              }
            } catch (e) {
              console.error("Failed to dispatch clearCredentials");
            }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response && error.response.status !== 401) {
      if (error.response.status === 503 && error.response.data?.error === 'MAINTENANCE_MODE') {
        if (typeof window !== 'undefined') {
          window.location.href = '/maintenance';
        }
        return Promise.reject(error);
      }
      // Global error toast for non-401 private errors
      let message = error.response.data?.message || 'An unexpected error occurred';
      if (Array.isArray(message)) message = message[0];
      if (typeof window !== 'undefined') {
         toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);
