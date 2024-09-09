import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { AuthState, User } from '@/types/user/User';
import type { UserResponse } from '@/types/user/UserResponse';

export interface LoginRequest {
  username: string;
  password: string;
}

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthState, LoginRequest>({
      query: (credentials) => ({
        url: 'api-token-auth/',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: UserResponse) => {
        const user: User = {
          userId: response.user_id,
          username: response.username,
          isStaff: response.is_staff,
          isSuperuser: response.is_superuser,
          email: response.email,
        };

        const authState: AuthState = {
          token: response.token,
          user,
        };

        localStorage.setItem('npsat_user_info', JSON.stringify(authState));

        return authState;
      },
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected',
    }),
  }),
});

export const { useLoginMutation, useProtectedMutation } = authApi;
