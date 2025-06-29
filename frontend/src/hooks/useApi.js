import { useState, useCallback } from 'react';
import { message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      if (!options.silent) {
        message.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint, options = {}) => {
    return apiCall(endpoint, { method: 'GET', ...options });
  }, [apiCall]);

  const post = useCallback((endpoint, data, options = {}) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }, [apiCall]);

  const put = useCallback((endpoint, data, options = {}) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }, [apiCall]);

  const del = useCallback((endpoint, options = {}) => {
    return apiCall(endpoint, { method: 'DELETE', ...options });
  }, [apiCall]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    clearError: () => setError(null),
  };
};

export default useApi;