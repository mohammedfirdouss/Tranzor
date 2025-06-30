import { configureStore } from '@reduxjs/toolkit';
import { mockApi } from './api/mockApi';
import { authApi } from './api/authApi';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    [mockApi.reducerPath]: mockApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      mockApi.middleware,
      authApi.middleware
    ),
});

export default store;