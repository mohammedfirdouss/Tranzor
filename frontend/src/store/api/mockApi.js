import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockDataService } from '../../services/mockData';

// Mock API slice that mimics the real API structure
export const mockApi = createApi({
  reducerPath: 'mockApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/mock' }), // This won't actually be used
  tagTypes: ['Transactions', 'FraudAlerts', 'AuditLogs', 'Metrics', 'Users'],
  endpoints: (builder) => ({
    // Transactions
    getLatestTransactions: builder.query({
      queryFn: async ({ accountId, limit = 10 }) => {
        try {
          const data = await mockDataService.getTransactions(accountId, limit);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['Transactions'],
    }),

    getTransaction: builder.query({
      queryFn: async ({ transactionId, accountId }) => {
        try {
          const data = await mockDataService.getTransaction(transactionId, accountId);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['Transactions'],
    }),

    createTransaction: builder.mutation({
      queryFn: async (transactionData) => {
        try {
          const data = await mockDataService.createTransaction(transactionData);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      invalidatesTags: ['Transactions'],
    }),

    updateTransaction: builder.mutation({
      queryFn: async ({ transactionId, updates }) => {
        try {
          const data = await mockDataService.updateTransaction(transactionId, updates);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      invalidatesTags: ['Transactions'],
    }),

    // Fraud Alerts
    getFraudAlerts: builder.query({
      queryFn: async ({ limit = 20 }) => {
        try {
          const data = await mockDataService.getFraudAlerts(limit);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['FraudAlerts'],
    }),

    createFraudAlert: builder.mutation({
      queryFn: async (alertData) => {
        try {
          const data = await mockDataService.createFraudAlert(alertData);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      invalidatesTags: ['FraudAlerts'],
    }),

    updateFraudAlert: builder.mutation({
      queryFn: async ({ alertId, updates }) => {
        try {
          const data = await mockDataService.updateFraudAlert(alertId, updates);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      invalidatesTags: ['FraudAlerts'],
    }),

    // Audit Logs
    getAuditLogs: builder.query({
      queryFn: async ({ limit = 50 }) => {
        try {
          const data = await mockDataService.getAuditLogs(limit);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['AuditLogs'],
    }),

    // Metrics
    getRealtimeMetrics: builder.query({
      queryFn: async ({ accountId }) => {
        try {
          const data = await mockDataService.getMetrics(accountId);
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['Metrics'],
    }),

    // Users
    getUsers: builder.query({
      queryFn: async () => {
        try {
          const data = await mockDataService.getUsers();
          return { data };
        } catch (error) {
          return { error: { status: 500, data: error.message } };
        }
      },
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useGetLatestTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useGetFraudAlertsQuery,
  useCreateFraudAlertMutation,
  useUpdateFraudAlertMutation,
  useGetAuditLogsQuery,
  useGetRealtimeMetricsQuery,
  useGetUsersQuery,
} = mockApi; 