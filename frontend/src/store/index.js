import { configureStore } from '@reduxjs/toolkit';
import { transactionsApi } from './api/transactionsApi';
import { fraudAlertsApi } from './api/fraudAlertsApi';
import { auditTrailApi } from './api/auditTrailApi';
import { metricsApi } from './api/metricsApi';
import { authApi } from './api/authApi';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [fraudAlertsApi.reducerPath]: fraudAlertsApi.reducer,
    [auditTrailApi.reducerPath]: auditTrailApi.reducer,
    [metricsApi.reducerPath]: metricsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      transactionsApi.middleware,
      fraudAlertsApi.middleware,
      auditTrailApi.middleware,
      metricsApi.middleware,
      authApi.middleware
    ),
});

export default store;