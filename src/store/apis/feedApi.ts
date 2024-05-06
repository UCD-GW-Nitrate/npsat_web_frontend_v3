import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';

import getAuth from '../getAuth';

interface Result {
  id: number;
  percentile: number;
  values: number[];
}

export interface PlotModel {
  dateCompleted: string;
  dateCreated: string;
  description: string;
  id: number;
  isBase: boolean;
  numWells: number;
  name: string;
  public: boolean;
  reductionEndYear: number;
  reductionStartYear: number;
  simEndYear: string;
  status: number;
  statusMessage: string;
  unsatZoneTravelTime: number;
  user: number;
  waterContent: string;
  loadScenario: string;
  flowScenario: string;
  unsatScenario: string;
  wellTypeScenario: string;
}

interface PlotModelResponse {
  date_completed: string;
  date_submitted: string;
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
  load_scenario: Scenario;
  flow_scenario: Scenario;
  unsat_scenario: Scenario;
  welltype_scenario: Scenario;
}

interface Scenario {
  name: string;
  description: string;
}

export interface Feed {
  recentCompletedModels: PlotModel[];
}

interface FeedResponse {
  recent_completed_models: PlotModelResponse[];
}

console.log('api route', apiRoot);

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
          const plotModels: PlotModel[] = response.recent_completed_models.map(
            (model) => {
              return {
                dateCompleted: new Date(model.date_completed)
                  .toISOString()
                  .substring(0, 10),
                dateCreated: new Date(model.date_submitted)
                  .toISOString()
                  .substring(0, 10),
                description: model.description,
                id: model.id,
                isBase: model.is_base,
                numWells: model.n_wells,
                name: model.name,
                public: model.public,
                reductionEndYear: model.reduction_end_year,
                reductionStartYear: model.reduction_start_year,
                simEndYear: `1945 - ${model.sim_end_year}`,
                status: model.status,
                statusMessage: model.status_message,
                unsatZoneTravelTime: model.unsaturated_zone_travel_time,
                user: model.user,
                waterContent: `${(
                  Number(model.water_content) * 100
                ).toFixed()}%`,
                loadScenario: model.load_scenario.name,
                flowScenario: model.flow_scenario.name,
                wellTypeScenario: model.welltype_scenario.name,
                unsatScenario: model.unsat_scenario.name,
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
