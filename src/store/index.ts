import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './apis/authApi';
import { feedApi } from './apis/feedApi';
import { modelApi } from './apis/modelApi';
import { regionApi } from './apis/regionApi';
import authReducer from './slices/authSlice';
import { modelReducer } from './slices/modelSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
    [modelApi.reducerPath]: modelApi.reducer,
    auth: authReducer,
    model: modelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(feedApi.middleware)
      .concat(regionApi.middleware)
      .concat(modelApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useLoginMutation, useProtectedMutation } from './apis/authApi';
export { useFetchFeedQuery } from './apis/feedApi';
export { useRunModelMutation } from './apis/modelApi';
export {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from './apis/regionApi';
