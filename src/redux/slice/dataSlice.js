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

      const divisionKey = String(division || "")
        .trim()
        .toLowerCase();

      if (!divisionKey || data === undefined) {
        return;
      }

      state.byDivision[divisionKey] = data;
    },

    clearDivisionData: (state, action) => {
      const divisionKey = String(action.payload || "")
        .trim()
        .toLowerCase();

      if (divisionKey) {
        delete state.byDivision[divisionKey];
      }
    },

    clearAllDivisionData: (state) => {
      state.byDivision = {};
    },
  },
});

export const { setDivisionData, clearDivisionData, clearAllDivisionData } =
  dataSlice.actions;

export default dataSlice.reducer;
