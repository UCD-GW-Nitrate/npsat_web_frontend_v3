import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './apis/authApi';
import { feedApi } from './apis/feedApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [feedApi.reducerPath]: feedApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(feedApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useLoginMutation, useProtectedMutation } from './apis/authApi';
export { useFetchFeedQuery } from './apis/feedApi';
