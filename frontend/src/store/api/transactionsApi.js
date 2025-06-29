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

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery,
  tagTypes: ['Transaction', 'AccountTransactions'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    // Get transactions for an account with pagination and filtering
    getAccountTransactions: builder.query({
      query: ({ accountId, limit = 10, nextToken, status, type, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (nextToken) params.append('nextToken', nextToken);
        if (status) params.append('status', status);
        if (type) params.append('type', type);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return {
          url: `/accounts/${accountId}/transactions?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { accountId }) => 
        result 
          ? [
              ...result.transactions.map(({ transactionId }) => ({ type: 'Transaction', id: transactionId })),
              { type: 'AccountTransactions', id: accountId }
            ]
          : [{ type: 'AccountTransactions', id: accountId }],
      // Transform response to include pagination info
      transformResponse: (response) => ({
        transactions: response.transactions || [],
        nextToken: response.nextToken,
        hasMore: !!response.nextToken,
      }),
    }),

    // Get a specific transaction by ID
    getTransaction: builder.query({
      query: ({ transactionId, accountId }) => ({
        url: `/v1/transactions/${transactionId}${accountId ? `?accountId=${accountId}` : ''}`,
        method: 'GET',
      }),
      providesTags: (result, error, { transactionId }) => [{ type: 'Transaction', id: transactionId }],
    }),

    // Create a new transaction
    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: '/v1/transactions',
        method: 'POST',
        body: transactionData,
      }),
      // Invalidate account transactions cache to refetch
      invalidatesTags: (result, error, transactionData) => [
        { type: 'AccountTransactions', id: transactionData.senderAccountId },
        { type: 'AccountTransactions', id: transactionData.receiverAccountId },
      ],
      // Optimistically update the cache
      async onQueryStarted(transactionData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          transactionsApi.util.updateQueryData(
            'getAccountTransactions',
            { accountId: transactionData.senderAccountId },
            (draft) => {
              if (draft) {
                draft.transactions.unshift({
                  ...transactionData,
                  transactionId: `temp-${Date.now()}`,
                  status: 'Pending',
                  receivedTimestamp: new Date().toISOString(),
                });
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Update transaction status (for real-time updates)
    updateTransaction: builder.mutation({
      query: ({ transactionId, updates }) => ({
        url: `/v1/transactions/${transactionId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { transactionId }) => [
        { type: 'Transaction', id: transactionId },
      ],
    }),

    // Get latest transactions (for dashboard)
    getLatestTransactions: builder.query({
      query: ({ accountId, limit = 10 }) => ({
        url: `/accounts/${accountId}/transactions?limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (result, error, { accountId }) => 
        result 
          ? [
              ...result.transactions.map(({ transactionId }) => ({ type: 'Transaction', id: transactionId })),
              { type: 'AccountTransactions', id: `${accountId}-latest` }
            ]
          : [{ type: 'AccountTransactions', id: `${accountId}-latest` }],
      transformResponse: (response) => ({
        transactions: response.transactions || [],
      }),
    }),

    // Get real-time metrics for dashboard
    getRealtimeMetrics: builder.query({
      query: ({ accountId }) => ({
        url: `/accounts/${accountId}/metrics/realtime`,
        method: 'GET',
      }),
      transformResponse: (response) => response || {},
    }),
  }),
});

export const {
  useGetAccountTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useGetLatestTransactionsQuery,
  useGetRealtimeMetricsQuery,
} = transactionsApi;