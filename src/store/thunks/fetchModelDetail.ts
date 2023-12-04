import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '..';

export const fetchModelDetail = createAsyncThunk(
  'users/fetch',
  async (percentile: number, { getState }) => {
    const { token } = (getState() as RootState).auth;
    const response = await axios.get(
      `http://localhost:8010/api/model_result/${percentile}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );

    return response.data;
  },
);
