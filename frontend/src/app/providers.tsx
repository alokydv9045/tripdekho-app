'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import AuthInit from '@/components/Auth/AuthInit';
import AuthModalManager from '@/components/Auth/AuthModalManager';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { ThemeProvider } from 'next-themes';

import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import GlobalNotificationListener from '@/components/shared/GlobalNotificationListener';
import ProfileCompletionModal from '@/components/Auth/ProfileCompletionModal';

function RefreshHandler() {
  useAutoRefresh();
  return null;
}

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';

// Global flag to prevent multiple initializations
let isGoogleInitialized = false;

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = React.useMemo(() => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '', []);
  const isValidClient = googleClientId && !googleClientId.includes('placeholder');

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
        <Provider store={store}>
          {isValidClient ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              <RefreshHandler />
              <AuthInit>
                {children}
              </AuthInit>
            </GoogleOAuthProvider>
          ) : (
            <>
              <RefreshHandler />
              <AuthInit>
                {children}
              </AuthInit>
            </>
          )}
          <React.Suspense fallback={null}>
            <AuthModalManager />
          </React.Suspense>
          <ToastContainer position="top-right" autoClose={3000} />
          <Toaster position="top-right" closeButton richColors />
          <GlobalNotificationListener />
          <ProfileCompletionModal />
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
