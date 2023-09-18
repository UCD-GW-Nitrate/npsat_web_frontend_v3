import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './apis/authApi';
import { feedApi } from './apis/feedApi';
import { regionApi } from './apis/regionApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    [regionApi.reducerPath]: regionApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(feedApi.middleware)
      .concat(regionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useLoginMutation, useProtectedMutation } from './apis/authApi';
export { useFetchFeedQuery } from './apis/feedApi';
export {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
} from './apis/regionApi';
