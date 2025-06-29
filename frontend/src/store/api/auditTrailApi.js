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

export const auditTrailApi = createApi({
  reducerPath: 'auditTrailApi',
  baseQuery,
  tagTypes: ['AuditLog', 'AuditLogs'],
  keepUnusedDataFor: 600, // Keep audit logs longer (10 minutes)
  endpoints: (builder) => ({
    // Search audit trail
    searchAuditTrail: builder.query({
      query: ({ 
        transactionId, 
        accountId, 
        userId, 
        eventType, 
        startDate, 
        endDate, 
        limit = 50, 
        nextToken 
      }) => {
        const params = new URLSearchParams();
        if (transactionId) params.append('transactionId', transactionId);
        if (accountId) params.append('accountId', accountId);
        if (userId) params.append('userId', userId);
        if (eventType) params.append('eventType', eventType);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (limit) params.append('limit', limit);
        if (nextToken) params.append('nextToken', nextToken);
        
        return {
          url: `/audit?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { transactionId, accountId }) => 
        result 
          ? [
              ...result.logs.map(({ logId }) => ({ type: 'AuditLog', id: logId })),
              { type: 'AuditLogs', id: transactionId || accountId || 'search' }
            ]
          : [{ type: 'AuditLogs', id: transactionId || accountId || 'search' }],
      transformResponse: (response) => ({
        logs: response.logs || [],
        nextToken: response.nextToken,
        hasMore: !!response.nextToken,
        totalCount: response.totalCount || 0,
      }),
    }),

    // Get audit log details
    getAuditLog: builder.query({
      query: ({ logId }) => ({
        url: `/audit/${logId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { logId }) => [{ type: 'AuditLog', id: logId }],
    }),

    // Get audit log for a specific transaction
    getTransactionAuditLog: builder.query({
      query: ({ transactionId }) => ({
        url: `/audit/transaction/${transactionId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { transactionId }) => [
        { type: 'AuditLogs', id: `transaction-${transactionId}` },
        ...(result?.logs?.map(({ logId }) => ({ type: 'AuditLog', id: logId })) || []),
      ],
      transformResponse: (response) => ({
        logs: response.logs || [],
        transactionId: response.transactionId,
      }),
    }),

    // Export audit logs
    exportAuditLogs: builder.mutation({
      query: ({ 
        transactionId, 
        accountId, 
        userId, 
        eventType, 
        startDate, 
        endDate,
        format = 'json' 
      }) => {
        const params = new URLSearchParams();
        if (transactionId) params.append('transactionId', transactionId);
        if (accountId) params.append('accountId', accountId);
        if (userId) params.append('userId', userId);
        if (eventType) params.append('eventType', eventType);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (format) params.append('format', format);
        
        return {
          url: `/audit/export?${params.toString()}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
    }),
  }),
});

export const {
  useSearchAuditTrailQuery,
  useGetAuditLogQuery,
  useGetTransactionAuditLogQuery,
  useExportAuditLogsMutation,
} = auditTrailApi; 