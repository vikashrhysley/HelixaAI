import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    login(state, { payload }) {
      state.user = payload;         // { name, email }
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser            = (s) => s.auth.user;
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated;
