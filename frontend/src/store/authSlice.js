import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('tranzor_auth_token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('tranzor_auth_token', payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('tranzor_auth_token');
    },
    setSignUp: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('tranzor_auth_token', payload.token);
    },
  },
});

export const { setCredentials, logout, setSignUp } = authSlice.actions;
export default authSlice.reducer;
