import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { AuthState, User } from '@/types/user/User';
import type { UserResponse } from '@/types/user/UserResponse';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  email?: string;
  username?: string;
}

export interface VerifyCode {
  email?: string;
  verification_code?: string;
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
          isVerified: response.is_verified,
        };

        const authState: AuthState = {
          token: response.token,
          user,
        };

        localStorage.setItem('npsat_user_info', JSON.stringify(authState));

        return authState;
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (user) => ({
        url: 'register-user/',
        method: 'POST',
        body: user,
      }),
    }),
    unauthorizedVerifyEmail: builder.mutation<void, string>({
      query: (email) => ({
        url: 'unauthorized-verify/',
        method: 'PUT',
        body: { email },
      }),
    }),
    unauthorizedVerifyCode: builder.mutation<AuthState, VerifyCode>({
      query: (verifyCode) => ({
        url: 'verify-code/',
        method: 'PUT',
        body: verifyCode,
      }),
      transformResponse: (response: UserResponse) => {
        const user: User = {
          userId: response.user_id,
          username: response.username,
          isStaff: response.is_staff,
          isSuperuser: response.is_superuser,
          email: response.email,
          isVerified: response.is_verified,
        };

        const authState: AuthState = {
          token: response.token,
          user,
        };

        localStorage.setItem('npsat_user_info', JSON.stringify(authState));

        return authState;
      },
    }),
  }),
});

export const { 
  useLoginMutation,
  useRegisterMutation,
  useUnauthorizedVerifyEmailMutation,
  useUnauthorizedVerifyCodeMutation 
} = authApi;
