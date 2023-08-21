import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import getAuth from '../getAuth';

export interface UserResponse {
  token: string;
  user_id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  email: string;
}

export interface User {
  userId: number;
  username: string;
  isStaff: boolean;
  isSuperuser: boolean;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8010',
    prepareHeaders: (headers, { getState }) => {
      return getAuth(headers, getState);
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthState, LoginRequest>({
      query: (credentials) => ({
        url: 'api-token-auth/',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: UserResponse) => {
        return {
          token: response.token,
          user: {
            userId: response.user_id,
            username: response.username,
            isStaff: response.is_staff,
            isSuperuser: response.is_superuser,
            email: response.email,
          },
        };
      },
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected',
    }),
  }),
});

export const { useLoginMutation, useProtectedMutation } = authApi;
