import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from './useApi';

export const useTransactions = (accountId, filters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    nextToken: null,
    hasMore: false,
  });
  
  const api = useApi();
  const filtersRef = useRef(filters);
  
  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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
      
      setTransactions(data.transactions || []);
      setPagination(prev => ({
        ...prev,
        nextToken: data.nextToken || null,
        hasMore: !!data.nextToken,
      }));

      return data;
    } catch (error) {
      setTransactions([]);
      throw error;
    }
  }, [accountId, api]);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const result = await api.post('/v1/transactions', transactionData);
      // Refresh transactions after creation
      await fetchTransactions({ pageSize: pagination.pageSize });
      return result;
    } catch (error) {
      throw error;
    }
  }, [api, fetchTransactions, pagination.pageSize]);

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
    fetchTransactions({ pageSize: 10, nextToken: null });
  }, [fetchTransactions]);

  // Auto-fetch when accountId changes or filters change
  useEffect(() => {
    if (accountId) {
      refresh();
    }
  }, [accountId, refresh]);

  // Handle filters change separately to avoid infinite loops
  useEffect(() => {
    if (accountId) {
      fetchTransactions({ pageSize: pagination.pageSize, nextToken: null });
    }
  }, [filters, accountId, fetchTransactions, pagination.pageSize]);

  return {
    transactions,
    loading: api.loading,
    error: api.error,
    pagination,
    fetchTransactions,
    createTransaction,
    getTransactionDetails,
    nextPage,
    refresh,
    clearError: api.clearError,
  };
};

export default useTransactions;