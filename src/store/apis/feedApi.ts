import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import getAuth from '../getAuth';

interface Result {
  id: number;
  percentile: number;
  values: number[];
}

export interface PlotModel {
  dateCompleted: Date;
  dateCreated: Date;
  description: string;
  id: number;
  isBase: boolean;
  numWells: number;
  name: string;
  public: boolean;
  reductionEndYear: number;
  reductionStartYear: number;
  simEndYear: number;
  status: number;
  statusMessage: string;
  unsatZoneTravelTime: number;
  user: number;
  waterContent: string;
}

interface PlotModelResponse {
  date_completed: Date;
  date_submitted: Date;
  description: string;
  id: number;
  is_base: boolean;
  n_wells: number;
  name: string;
  public: boolean;
  reduction_end_year: number;
  reduction_start_year: number;
  results: Result[];
  sim_end_year: number;
  status: number;
  status_message: string;
  unsaturated_zone_travel_time: number;
  user: number;
  water_content: string;
}

export interface Feed {
  recentCompletedModels: PlotModel[];
}

interface FeedResponse {
  recent_completed_models: PlotModelResponse[];
}

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
      fetchFeed: builder.query<Feed, void>({
        query: () => {
          return {
            url: 'api/feed/',
            method: 'GET',
          };
        },
        transformResponse: (response: FeedResponse) => {
          const plotModels: PlotModel[] = response.recent_completed_models.map(
            (model) => {
              return {
                dateCompleted: model.date_completed,
                dateCreated: model.date_submitted,
                description: model.description,
                id: model.id,
                isBase: model.is_base,
                numWells: model.n_wells,
                name: model.name,
                public: model.public,
                reductionEndYear: model.reduction_end_year,
                reductionStartYear: model.reduction_start_year,
                simEndYear: model.sim_end_year,
                status: model.status,
                statusMessage: model.status_message,
                unsatZoneTravelTime: model.unsaturated_zone_travel_time,
                user: model.user,
                waterContent: model.water_content,
              };
            },
          );
          return {
            recentCompletedModels: plotModels,
          };
        },
      }),
    };
  },
});

export const { useFetchFeedQuery } = feedApi;
export { feedApi };
