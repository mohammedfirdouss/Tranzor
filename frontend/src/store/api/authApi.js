import { createApi } from '@reduxjs/toolkit/query/react';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (user) => ({
        url: '/auth/register', // correct
        method: 'POST',
        body: user,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
