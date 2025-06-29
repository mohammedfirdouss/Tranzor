import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('tranzor_auth_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const metricsApi = createApi({
  reducerPath: 'metricsApi',
  baseQuery,
  tagTypes: ['Metrics', 'SystemMetrics'],
  keepUnusedDataFor: 60, // Keep metrics for 1 minute (frequently updated)
  endpoints: (builder) => ({
    // Get system metrics
    getSystemMetrics: builder.query({
      query: ({ accountId, timeRange = '1h' }) => {
        const params = new URLSearchParams();
        if (accountId) params.append('accountId', accountId);
        if (timeRange) params.append('timeRange', timeRange);
        
        return {
          url: `/metrics/system?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['SystemMetrics'],
      transformResponse: (response) => ({
        tps: response.tps || 0,
        averageLatency: response.averageLatency || 0,
        successRate: response.successRate || 0,
        errorRate: response.errorRate || 0,
        activeConnections: response.activeConnections || 0,
        memoryUsage: response.memoryUsage || 0,
        cpuUsage: response.cpuUsage || 0,
        timestamp: response.timestamp || new Date().toISOString(),
      }),
    }),

    // Get transaction metrics
    getTransactionMetrics: builder.query({
      query: ({ accountId, startDate, endDate, groupBy = 'hour' }) => {
        const params = new URLSearchParams();
        if (accountId) params.append('accountId', accountId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (groupBy) params.append('groupBy', groupBy);
        
        return {
          url: `/metrics/transactions?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Metrics'],
      transformResponse: (response) => ({
        data: response.data || [],
        totalTransactions: response.totalTransactions || 0,
        totalVolume: response.totalVolume || 0,
        averageAmount: response.averageAmount || 0,
      }),
    }),

    // Get fraud metrics
    getFraudMetrics: builder.query({
      query: ({ accountId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (accountId) params.append('accountId', accountId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return {
          url: `/metrics/fraud?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Metrics'],
      transformResponse: (response) => ({
        totalAlerts: response.totalAlerts || 0,
        openAlerts: response.openAlerts || 0,
        resolvedAlerts: response.resolvedAlerts || 0,
        falsePositives: response.falsePositives || 0,
        truePositives: response.truePositives || 0,
        averageRiskScore: response.averageRiskScore || 0,
        detectionRate: response.detectionRate || 0,
      }),
    }),

    // Get real-time metrics (for dashboard)
    getRealtimeMetrics: builder.query({
      query: ({ accountId }) => {
        const params = new URLSearchParams();
        if (accountId) params.append('accountId', accountId);
        
        return {
          url: `/metrics/realtime?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Metrics'],
      // Poll every 5 seconds for real-time updates
      pollingInterval: 5000,
      transformResponse: (response) => ({
        currentTps: response.currentTps || 0,
        averageLatency: response.averageLatency || 0,
        successRate: response.successRate || 0,
        activeAlerts: response.activeAlerts || 0,
        lastUpdate: response.timestamp || new Date().toISOString(),
      }),
    }),
  }),
});

export const {
  useGetSystemMetricsQuery,
  useGetTransactionMetricsQuery,
  useGetFraudMetricsQuery,
  useGetRealtimeMetricsQuery,
} = metricsApi; 