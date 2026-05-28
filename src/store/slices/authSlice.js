import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'helixta_auth';

const loadStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

const saveStoredAuth = (auth) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
};

const storedAuth = loadStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedAuth?.user ?? null,
    accessToken: storedAuth?.accessToken ?? null,
    refreshToken: storedAuth?.refreshToken ?? null,
    tokenType: storedAuth?.tokenType ?? null,
    isAuthenticated: Boolean(storedAuth?.accessToken),
  },
  reducers: {
    login(state, { payload }) {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.tokenType = payload.tokenType;
      state.isAuthenticated = true;

      saveStoredAuth({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenType: state.tokenType,
      });
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.isAuthenticated = false;
      clearStoredAuth();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (s) => s.auth.user;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;
export const selectAccessToken = (s) => s.auth.accessToken;
