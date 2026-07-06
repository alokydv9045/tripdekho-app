import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | { url: string; publicId?: string };
  phone?: string;
  nickname?: string;
  dateOfBirth?: string;
  gender?: string;
  mustChangePassword?: boolean;
  location?: {
    city?: string;
    state?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  platformSettings: any | null;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'signup';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  platformSettings: null,
  isAuthModalOpen: false,
  authModalView: 'login',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPlatformSettings: (state, action: PayloadAction<any>) => {
      state.platformSettings = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string | { url: string; publicId?: string }>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
    openAuthModal: (state, action: PayloadAction<'login' | 'signup'>) => {
      state.isAuthModalOpen = true;
      state.authModalView = action.payload;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalView: (state, action: PayloadAction<'login' | 'signup'>) => {
      state.authModalView = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setLoading, setError, setPlatformSettings, updateAvatar, openAuthModal, closeAuthModal, setAuthModalView } = authSlice.actions;

export default authSlice.reducer;
