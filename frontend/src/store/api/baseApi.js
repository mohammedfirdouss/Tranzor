import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create base query with common configuration
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    // Add authentication token if available
    const token = localStorage.getItem('tranzor_auth_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Add content type
    headers.set('content-type', 'application/json');
    
    return headers;
  },
});

// Base API with common configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Transaction', 'FraudAlert', 'AuditLog', 'Metrics'],
  endpoints: () => ({}),
  // Global error handling
  keepUnusedDataFor: 300, // Keep data for 5 minutes
});