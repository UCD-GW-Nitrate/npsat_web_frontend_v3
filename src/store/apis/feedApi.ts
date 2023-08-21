import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import getAuth from '../getAuth';

const feedApi = createApi({
  reducerPath: 'feed',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8010',
    prepareHeaders: (headers, { getState }) => {
      return getAuth(headers, getState);
    },
  }),
  endpoints(builder) {
    return {
      fetchFeed: builder.query({
        query: () => {
          return {
            url: 'api/feed/',
            method: 'GET',
          };
        },
      }),
    };
  },
});

export const { useFetchFeedQuery } = feedApi;
export { feedApi };
