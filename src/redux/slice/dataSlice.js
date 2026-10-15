import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byDivision: {},
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setDivisionData: (state, action) => {
      const { division, data } = action.payload;
      state.byDivision[division] = data;
    },
  },
});

export const { setDivisionData } = dataSlice.actions;

export default dataSlice.reducer;
