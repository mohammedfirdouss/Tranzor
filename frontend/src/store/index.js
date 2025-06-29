import { configureStore } from '@reduxjs/toolkit';
import { transactionsApi } from './api/transactionsApi';
import { fraudAlertsApi } from './api/fraudAlertsApi';
import { auditTrailApi } from './api/auditTrailApi';
import { metricsApi } from './api/metricsApi';

export const store = configureStore({
  reducer: {
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [fraudAlertsApi.reducerPath]: fraudAlertsApi.reducer,
    [auditTrailApi.reducerPath]: auditTrailApi.reducer,
    [metricsApi.reducerPath]: metricsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      transactionsApi.middleware,
      fraudAlertsApi.middleware,
      auditTrailApi.middleware,
      metricsApi.middleware
    ),
});

export default store;