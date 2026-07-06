/**
 * TripDekho Unified Authentication Utilities
 * Handles synchronized storage across Cookies (for Middleware) and LocalStorage (for Client Hooks)
 */

export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refreshToken',
  ROLE_KEY: 'role',
  USER_KEY: 'user',
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
};

export const authUtils = {
  /**
   * Sets all authentication data across storage layers
   */
  setAuthData: (data: { token: string; refreshToken?: string; role: string; user: any }) => {
    if (typeof window === 'undefined') return;

    const { token, refreshToken, role, user } = data;

    // 1. LocalStorage (Primary for client-side persistence and API interceptors)
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(AUTH_CONFIG.ROLE_KEY, role);
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));

    // 2. Cookies (Primary for Next.js Middleware and SSR)
    const expires = AUTH_CONFIG.COOKIE_MAX_AGE;
    const cookieBase = `path=/; max-age=${expires}; SameSite=Lax`;
    document.cookie = `${AUTH_CONFIG.TOKEN_KEY}=${token}; ${cookieBase}`;
    document.cookie = `${AUTH_CONFIG.ROLE_KEY}=${role}; ${cookieBase}`;
  },

  /**
   * Performs a "Full Purge" of all authentication data
   */
  clearAuthData: () => {
    if (typeof window === 'undefined') return;

    // 1. Clear LocalStorage completely
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.ROLE_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.clear();

    // 2. Delete cookies by setting them to empty with Max-Age=0
    //    Must match the same path=/ used when they were set
    const cookieKeys = [AUTH_CONFIG.TOKEN_KEY, AUTH_CONFIG.ROLE_KEY];
    cookieKeys.forEach(key => {
      document.cookie = `${key}=; path=/; Max-Age=0; SameSite=Lax`;
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    });
  },


  /**
   * Gets tokens and validation status
   */
  getAuthStatus: () => {
    if (typeof window === 'undefined') return { hasToken: false };

    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    
    return {
      hasToken: !!(token || refreshToken),
      token,
      refreshToken,
      role: localStorage.getItem(AUTH_CONFIG.ROLE_KEY)
    };
  }
};
