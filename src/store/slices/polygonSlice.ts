import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState: { polygons: [number, number][][]; } = {
  polygons: [],
};

const polygonSlice = createSlice({
  name: 'polygons',
  initialState,
  reducers: {
    setPolygons(state, action: PayloadAction<[number, number][][]>) {
      state.polygons = action.payload;
    },
  },
});

export const { setPolygons } = polygonSlice.actions;
export const polygonsReducer = polygonSlice.reducer;
export const selectCurrentPolygons = (state: RootState) => state.polygons.polygons;
