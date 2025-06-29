import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from './useApi';
import { useWebSocket } from './useWebSocket';

export const useRealTimeTransactions = (accountId, filters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    nextToken: null,
    hasMore: false,
  });

  const api = useApi();
  const filtersRef = useRef(filters);
  const isInitialLoadRef = useRef(true);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // WebSocket for real-time updates
  const { isConnected: wsConnected, error: wsError } = useWebSocket(
    `/transactions/feed${accountId ? `?accountId=${accountId}` : ''}`,
    {
      onMessage: (message) => {
        if (message.type === 'transaction_update') {
          setTransactions(prevTransactions => {
            const existingIndex = prevTransactions.findIndex(
              t => t.transactionId === message.data.transactionId
            );
            if (existingIndex >= 0) {
              const updated = [...prevTransactions];
              updated[existingIndex] = { ...updated[existingIndex], ...message.data };
              return updated;
            } else {
              return [message.data, ...prevTransactions];
            }
          });
        }
      },
      onConnect: () => {
        console.log('Real-time transaction feed connected');
      },
      onDisconnect: () => {
        console.log('Real-time transaction feed disconnected');
      }
    }
  );

  const fetchTransactions = useCallback(async (params = {}) => {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    try {
      const currentFilters = filtersRef.current;
      const query = new URLSearchParams({
        limit: params.pageSize || params.limit || 10,
        status: currentFilters.status || '',
        type: currentFilters.type || '',
        startDate: currentFilters.startDate || '',
        endDate: currentFilters.endDate || '',
        nextToken: params.nextToken || '',
      });

      // Remove empty parameters
      for (const [key, value] of [...query.entries()]) {
        if (!value) query.delete(key);
      }

      const data = await api.get(`/accounts/${accountId}/transactions?${query.toString()}`);

      if (isInitialLoadRef.current) {
        setTransactions(data.transactions || []);
        isInitialLoadRef.current = false;
      } else {
        setTransactions(prev => [...prev, ...(data.transactions || [])]);
      }

      setPagination(prev => ({
        ...prev,
        nextToken: data.nextToken || null,
        hasMore: !!data.nextToken,
      }));

      return data;
    } catch (error) {
      if (isInitialLoadRef.current) {
        setTransactions([]);
      }
      throw error;
    }
  }, [accountId, api]);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const result = await api.post('/v1/transactions', transactionData);
      // Don't need to manually refresh - WebSocket will provide real-time update
      return result;
    } catch (error) {
      throw error;
    }
  }, [api]);

  const getTransactionDetails = useCallback(async (transactionId) => {
    if (!accountId) {
      throw new Error('Account ID is required');
    }
    try {
      return await api.get(`/v1/transactions/${transactionId}?accountId=${accountId}`);
    } catch (error) {
      throw error;
    }
  }, [accountId, api]);

  const nextPage = useCallback(() => {
    if (pagination.nextToken) {
      fetchTransactions({
        pageSize: pagination.pageSize,
        nextToken: pagination.nextToken
      });
    }
  }, [fetchTransactions, pagination.nextToken, pagination.pageSize]);

  const refresh = useCallback(() => {
    setPagination(prev => ({ ...prev, current: 1, nextToken: null }));
    isInitialLoadRef.current = true;
    fetchTransactions({ pageSize: 10, nextToken: null });
  }, [fetchTransactions]);

  // Auto-fetch when accountId changes
  useEffect(() => {
    if (accountId) {
      isInitialLoadRef.current = true;
      refresh();
    }
  }, [accountId, refresh]);

  // Handle filters change
  useEffect(() => {
    if (accountId) {
      isInitialLoadRef.current = true;
      fetchTransactions({ pageSize: pagination.pageSize, nextToken: null });
    }
  }, [filters, accountId, fetchTransactions, pagination.pageSize]);

  return {
    transactions,
    loading: api.loading,
    error: api.error || wsError,
    pagination,
    wsConnected,
    fetchTransactions,
    createTransaction,
    getTransactionDetails,
    nextPage,
    refresh,
    clearError: api.clearError,
  };
};

export default useRealTimeTransactions;