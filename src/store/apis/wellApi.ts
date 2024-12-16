import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { WellRequest } from '@/types/well/Well';
import type { WellDetail } from '@/types/well/WellDetail';

import { paramsSerializer } from './paramsSerializer';

const wellApi = createApi({
  reducerPath: 'well',
  baseQuery: fetchBaseQuery({
    baseUrl: apiRoot,
  }),
  endpoints(builder) {
    return {
      getWells: builder.query<WellDetail, Partial<WellRequest>>({
        query: (params) => {
          return {
            url: `api/well/?${paramsSerializer(params)}`,
            method: 'GET',
          };
        },
      }),
    };
  },
});

export const { useGetWellsQuery } = wellApi;
export { wellApi };
