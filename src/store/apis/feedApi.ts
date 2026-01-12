import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import apiRoot from '@/config/apiRoot';
import type { Feed, PlotModel } from '@/types/feed/Feed';
import type { FeedResponse } from '@/types/feed/FeedResponse';

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
          const plotModels: PlotModel[] = response.recent_models.map(
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
                porosity: `${Number(model.porosity).toFixed()}%`,
                loadScenario: model.load_scenario.name,
                flowScenario: model.flow_scenario.name,
                wellTypeScenario: model.welltype_scenario.name,
                unsatScenario: model.unsat_scenario.name,
                mantisVersion: model.mantis_version,
              };
            },
          );
          return {
            recentModels: plotModels,
            pending_model_ids: response.pending_model_ids,
          };
        },
      }),
    };
  },
});

export const { useFetchFeedQuery } = feedApi;
export { feedApi };
