import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '..';

export type PolygonsDict = {
  [key: string]: [number, number][];
};

const initialState: { polygonsDict: PolygonsDict } = {
  polygonsDict: {},
};

const polygonSlice = createSlice({
  name: 'polygons',
  initialState,
  reducers: {
    setPolygons(state, action: PayloadAction<PolygonsDict>) {
      state.polygonsDict = action.payload;
    },
    upsertPolygon(
      state,
      action: PayloadAction<{ id: number; polygon: [number, number][] }>,
    ) {
      const { id, polygon } = action.payload;
      state.polygonsDict[id] = polygon;
    },
    deletePolygon(state, action: PayloadAction<number>) {
      delete state.polygonsDict[action.payload];
    },
  },
});

export const { setPolygons, upsertPolygon, deletePolygon } =
  polygonSlice.actions;
export const polygonsReducer = polygonSlice.reducer;
export const selectCurrentPolygons = (state: RootState) =>
  Object.values(state.polygons.polygonsDict);
export const selectCurrentPolygonsDict = (state: RootState) =>
  state.polygons.polygonsDict;
