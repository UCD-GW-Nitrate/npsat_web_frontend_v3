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

const fetchAllWells = async (params: any) => {
  const baseQuery = fetchBaseQuery({ baseUrl: apiRoot });
  let url = `api/well/?${paramsSerializer({ ...params, page: 1 })}`;
  let allResults: any[] = [];

  while (url) {
    const result = await baseQuery({ url, method: 'GET' }, {}, {});
    if ('data' in result) {
      const data = result.data as any;
      allResults.push(...data.results);
      url = data.next ? data.next.replace(apiRoot, '') : null; // relative path
    } else {
      console.error('Error fetching wells:', result.error);
      break;
    }
  }
  console.log("ENFDDDDD")
  return allResults;
};


export const { useGetWellsQuery } = wellApi;
export { wellApi };
export { fetchAllWells };
