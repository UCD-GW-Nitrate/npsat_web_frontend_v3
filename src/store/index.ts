import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './apis/authApi';
import { cropApi } from './apis/cropApi';
import { feedApi } from './apis/feedApi';
import { modelApi } from './apis/modelApi';
import { regionApi } from './apis/regionApi';
import { userApi } from './apis/userApi';
import { wellApi } from './apis/wellApi';
import authReducer from './slices/authSlice';
import { modelReducer } from './slices/modelSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
    [modelApi.reducerPath]: modelApi.reducer,
    [cropApi.reducerPath]: cropApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [wellApi.reducerPath]: wellApi.reducer,
    auth: authReducer,
    model: modelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(feedApi.middleware)
      .concat(regionApi.middleware)
      .concat(modelApi.middleware)
      .concat(cropApi.middleware)
      .concat(userApi.middleware)
      .concat(wellApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {
  useLoginMutation,
  useRegisterMutation,
  useUnauthorizedVerifyCodeMutation,
  useUnauthorizedVerifyEmailMutation,
} from './apis/authApi';
export {
  useGetAllCropsByFlowScenarioQuery,
  useGetAllCropsQuery,
  useGetCropQuery,
} from './apis/cropApi';
export { useFetchFeedQuery } from './apis/feedApi';
export {
  useDeleteModelMutation,
  useGetAllModelDetailQuery,
  useGetModelandBaseModelDetailQuery,
  useGetModelDetailByIdsQuery,
  useGetModelDetailQuery,
  useGetModelResultsQuery,
  useGetModelStatusQuery,
  useGetModificationDetailQuery,
  usePatchModelMutation,
  usePutModelMutation,
  useRunModelMutation,
} from './apis/modelApi';
export {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchRegionQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
  useGetRegionByIdsQuery,
  useGetRegionDetailQuery,
} from './apis/regionApi';
export {
  useSendVerificationEmailMutation,
  useSetPasswordMutation,
  useVerifyUserMutation,
} from './apis/userApi';
export { useGetWellsQuery } from './apis/wellApi';
