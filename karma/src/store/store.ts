import { configureStore } from "@reduxjs/toolkit";
import { electionsApi } from "../services/electionsApi";

export default configureStore({
 reducer: {
    [electionsApi.reducerPath]: electionsApi.reducer,
 },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(electionsApi.middleware),
});
