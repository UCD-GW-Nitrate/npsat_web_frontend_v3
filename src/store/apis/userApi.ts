import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
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
    sendVerificationEmail: builder.mutation<void, void>({
      query: () => ({
        url: 'api/user/verify/',
        method: 'PUT',
      }),
    }),
    verifyUser: builder.mutation<void, string>({
      query: (verification_code) => ({
        url: 'api/user/me/',
        method: 'PATCH',
        body: { verification_code },
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
