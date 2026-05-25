import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { VerifyCode } from '@/types/auth/VerifiyCode';
import type { UserPreferences } from '@/types/user/UserPreferences';
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
    getUserPreferences: builder.query<UserPreferences, void>({
      query: () => ({
        url: 'api/user/preferences/',
        method: 'GET',
      }),
    }),
    updateUserPreferences: builder.mutation<void, UserPreferences>({
      query: (preferences) => ({
        url: 'api/user/preferences/',
        method: 'PUT',
        body: preferences,
      }),
    }),
    sendUserFeedback: builder.mutation<
      void,
      {
        feedback_type: string | null;
        message: string;
        name: string | null;
        email: string | null;
      }
    >({
      query: ({ feedback_type, message, name, email }) => ({
        url: 'send-feedback/',
        method: 'PUT',
        body: { feedback_type, message, name, email },
      }),
    }),
  }),
});

export const {
  useSendVerificationEmailMutation,
  useVerifyUserMutation,
  useSetPasswordMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  useSendUserFeedbackMutation,
} = userApi;
