import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { Feed } from '@/types/feed/Feed';
import type { FeedResponse } from '@/types/feed/FeedResponse';
import { mapModelRunToPlotModel } from '@/utils/utils';

import getAuth from '../getAuth';

const feedApi = createApi({
  reducerPath: 'feed',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
    prepareHeaders: (headers, { getState }) => {
      return getAuth(headers, getState);
    },
  }),
  endpoints(builder) {
    return {
      fetchFeed: builder.query<Feed, void>({
        query: () => {
          return {
            url: 'api/feed/',
            method: 'GET',
          };
        },
        transformResponse: (response: FeedResponse) => {
          return {
            recentModels: response.recent_models.map(mapModelRunToPlotModel),
            pending_model_ids: response.pending_model_ids,
          };
        },
      }),
    };
  },
});

export const { useFetchFeedQuery } = feedApi;
export { feedApi };
