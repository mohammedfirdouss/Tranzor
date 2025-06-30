import { useState, useCallback } from 'react';
import { authHelpers } from '../config/cognito';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = useCallback(async () => {
    try {
      const token = await authHelpers.getAccessToken();
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
    } catch (error) {
      console.error('Failed to get auth token:', error);
      // Return headers without auth token - API will handle 401
      return {
        'Content-Type': 'application/json',
      };
    }
  }, []);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        mode: 'cors', // Explicitly enable CORS
        credentials: 'omit', // Don't send cookies for cross-origin requests
      });

      if (!response.ok) {
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          authHelpers.signOut();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('API request failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const get = useCallback((endpoint) => {
    return request(endpoint, { method: 'GET' });
  }, [request]);

  const post = useCallback((endpoint, body) => {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, [request]);

  const put = useCallback((endpoint, body) => {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }, [request]);

  const del = useCallback((endpoint) => {
    return request(endpoint, { method: 'DELETE' });
  }, [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  };
};

export default useApi;