"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, usePathname } from 'next/navigation';
import { RootState } from '@/store/store';
import { openAuthModal } from '@/store/slices/authSlice';
import AuthModal from './AuthModal';

const AuthModalManager = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isAuthenticated, isAuthModalOpen } = useSelector((state: RootState) => state.auth);

  // Handle URL triggers (e.g., /?auth=login)
  useEffect(() => {
    if (!isAuthenticated) {
      const authQuery = searchParams.get('auth');
      if (authQuery === 'login') {
        dispatch(openAuthModal('login'));
      } else if (authQuery === 'signup') {
        dispatch(openAuthModal('signup'));
      }
    }
  }, [searchParams, isAuthenticated, dispatch]);

  // Handle Auto-Popup on any page load after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isAuthenticated) {
      const hasSeenPopup = sessionStorage.getItem('authPopupShown');
      
      if (!hasSeenPopup && !isAuthModalOpen) {
        timer = setTimeout(() => {
          // Double check authentication state before showing
          const stillUnauthenticated = !localStorage.getItem('token');
          if (stillUnauthenticated && !sessionStorage.getItem('authPopupShown')) {
            dispatch(openAuthModal('login'));
            sessionStorage.setItem('authPopupShown', 'true');
          }
        }, 5000); // 5 seconds
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, pathname, dispatch, isAuthModalOpen]);

  return <AuthModal />;
};

export default AuthModalManager;
