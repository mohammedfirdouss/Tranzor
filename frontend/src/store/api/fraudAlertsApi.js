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

export const fraudAlertsApi = createApi({
  reducerPath: 'fraudAlertsApi',
  baseQuery,
  tagTypes: ['FraudAlert', 'FraudAlerts'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    // Get open fraud alerts
    getOpenFraudAlerts: builder.query({
      query: ({ accountId, limit = 50, nextToken }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (nextToken) params.append('nextToken', nextToken);
        if (accountId) params.append('accountId', accountId);
        
        return {
          url: `/fraud/alerts/open?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { accountId }) => 
        result 
          ? [
              ...result.alerts.map(({ alertId }) => ({ type: 'FraudAlert', id: alertId })),
              { type: 'FraudAlerts', id: accountId || 'all' }
            ]
          : [{ type: 'FraudAlerts', id: accountId || 'all' }],
      transformResponse: (response) => ({
        alerts: response.alerts || [],
        nextToken: response.nextToken,
        hasMore: !!response.nextToken,
      }),
    }),

    // Get fraud alert details
    getFraudAlert: builder.query({
      query: ({ alertId }) => ({
        url: `/fraud/alerts/${alertId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { alertId }) => [{ type: 'FraudAlert', id: alertId }],
    }),

    // Submit decision on fraud alert
    submitFraudDecision: builder.mutation({
      query: ({ alertId, decision, reason, analystId }) => ({
        url: `/fraud/alerts/${alertId}/decision`,
        method: 'POST',
        body: { decision, reason, analystId },
      }),
      invalidatesTags: (result, error, { alertId }) => [
        { type: 'FraudAlert', id: alertId },
        { type: 'FraudAlerts', id: 'all' },
      ],
    }),

    // Get fraud statistics
    getFraudStats: builder.query({
      query: ({ accountId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (accountId) params.append('accountId', accountId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return {
          url: `/fraud/stats?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['FraudStats'],
      transformResponse: (response) => ({
        totalAlerts: response.totalAlerts || 0,
        openAlerts: response.openAlerts || 0,
        resolvedAlerts: response.resolvedAlerts || 0,
        falsePositives: response.falsePositives || 0,
        truePositives: response.truePositives || 0,
        averageRiskScore: response.averageRiskScore || 0,
      }),
    }),
  }),
});

export const {
  useGetOpenFraudAlertsQuery,
  useGetFraudAlertQuery,
  useSubmitFraudDecisionMutation,
  useGetFraudStatsQuery,
} = fraudAlertsApi; 