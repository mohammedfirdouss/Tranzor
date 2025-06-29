import { useState, useCallback, useEffect } from 'react';
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

  const fetchTransactions = useCallback(async (params = {}) => {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    try {
      const query = new URLSearchParams({
        limit: params.pageSize || pagination.pageSize,
        status: filters.status || '',
        type: filters.type || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
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
  }, [accountId, filters, pagination.pageSize, api]);

  const createTransaction = useCallback(async (transactionData) => {
    try {
      const result = await api.post('/v1/transactions', transactionData);
      // Refresh transactions after creation
      await fetchTransactions();
      return result;
    } catch (error) {
      throw error;
    }
  }, [api, fetchTransactions]);

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
    fetchTransactions({ pageSize: pagination.pageSize, nextToken: null });
  }, [fetchTransactions, pagination.pageSize]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    if (accountId) {
      refresh();
    }
  }, [accountId, filters]);

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