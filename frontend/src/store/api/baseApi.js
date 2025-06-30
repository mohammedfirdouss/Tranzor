import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authHelpers } from '../../config/cognito';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Base API with common configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const token = await authHelpers.getAccessToken();
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Failed to get auth token:', error);
        // Continue without token - API will handle 401
      }
      
      headers.set('content-type', 'application/json');
      return headers;
    },
    responseHandler: async (response) => {
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        authHelpers.signOut();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
  }),
  tagTypes: ['Transaction', 'FraudAlert', 'AuditLog', 'Metrics'],
  endpoints: () => ({}),
  // Global error handling
  keepUnusedDataFor: 300, // Keep data for 5 minutes
});