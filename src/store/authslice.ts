import { createSlice } from '@reduxjs/toolkit';

const storedAuthState = localStorage.getItem('authState');
const initialState = {
  isAuthenticated: storedAuthState ? JSON.parse(storedAuthState) : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
      localStorage.setItem('authState', 'true');
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.setItem('authState', 'false');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
