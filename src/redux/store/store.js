import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../slice/dataSlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
      immutableCheck: true,
    }),
  devTools: import.meta.env.DEV,
});
