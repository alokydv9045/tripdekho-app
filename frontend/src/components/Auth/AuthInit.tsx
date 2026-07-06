'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { authService } from '@/services/index';
import { setCredentials, clearCredentials, setLoading, setPlatformSettings } from '@/store/slices/authSlice';
import { authUtils } from '@/lib/authUtils';
import { axiosPublic } from '@/lib/axios';

export default function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      // Use unified check logic
      const { hasToken, token } = authUtils.getAuthStatus();
      
      if (!hasToken) {
        authUtils.clearAuthData(); // Clean wipe
        try {
          const settingsRes = await axiosPublic.get('/cms/settings');
          if (settingsRes.data.success) {
            dispatch(setPlatformSettings(settingsRes.data.data));
          }
        } catch (e) {
          console.error("Failed to fetch public platform settings");
        }
        dispatch(setLoading(false));
        return;
      }

      try {
        const response = await authService.getMe();
        const userData = response.data || response.user || response;
        if (response.success && userData && userData.id) {
          dispatch(setCredentials({ user: userData }));
          
          // Fetch the freshest token from storage in case an interceptor refreshed it
          const currentToken = localStorage.getItem('token') || token;

          // Re-sync data just in case
          authUtils.setAuthData({
             token: currentToken!,
             role: userData.role,
             user: userData
          });

          if (token) {
            const { socketService } = await import('@/services/socketService');
            socketService.connect(token);
          }

          // Fetch platform settings for dynamic permissions
          const settingsRes = await axiosPublic.get('/cms/settings');
          if (settingsRes.data.success) {
            dispatch(setPlatformSettings(settingsRes.data.data));
          }
        }

      } catch (error: any) {
        const isAuthError = error.response?.status === 401 || error.response?.status === 403;
        const isNoToken = error.message?.includes('No refresh token') || error.message?.includes('Invalid refresh token');
        
        if (!isAuthError && !isNoToken) {
          console.error('Auth initialization failed due to network or server error:', error);
          // Do not log the user out on network/500 errors!
        } else {
          // Only clear credentials if it's explicitly an unauthorized/forbidden error
          dispatch(clearCredentials());
          authUtils.clearAuthData();
          
          const { socketService } = await import('@/services/socketService');
          socketService.disconnect();
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
