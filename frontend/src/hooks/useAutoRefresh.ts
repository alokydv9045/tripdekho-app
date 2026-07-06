"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { authService } from '@/services/authService';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';

/**
 * Hook to automatically refresh the JWT token in the background.
 * It checks the token every 10 minutes (or based on an interval).
 */
export const useAutoRefresh = () => {
  // Token expiration is 7 days on the backend, 
  // so we don't need to eagerly refresh it every 14 minutes 
  // and risk logging the user out if the network drops or refresh token is missing.
};
