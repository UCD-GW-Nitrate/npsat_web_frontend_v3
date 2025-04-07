import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { VerifyCode } from '@/types/auth/VerifiyCode';
import type { UserResponse } from '@/types/user/UserResponse';

import getAuth from '../getAuth';

export const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
    prepareHeaders: (headers, { getState }) => {
      return getAuth(headers, getState);
    },
  }),
  endpoints: (builder) => ({
    sendVerificationEmail: builder.mutation<void, string>({
      query: (email) => ({
        url: 'unauthorized-verify/',
        method: 'PUT',
        body: { email },
      }),
    }),
    verifyUser: builder.mutation<void, VerifyCode>({
      query: (verifyObj) => ({
        url: 'verify-code/',
        method: 'PUT',
        body: verifyObj,
      }),
    }),
    setPassword: builder.mutation<void, string>({
      query: (password) => ({
        url: 'api/user/me/',
        method: 'PATCH',
        body: { password },
      }),
    }),
    getUser: builder.mutation<UserResponse, void>({
      query: () => ({
        url: 'api/user/me/',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSendVerificationEmailMutation,
  useVerifyUserMutation,
  useSetPasswordMutation,
} = userApi;
