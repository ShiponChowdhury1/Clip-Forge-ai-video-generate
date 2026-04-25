import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import { videosApi } from "./features/videos/videosApi";
import { adminApi } from "./features/admin/adminApi";
import { billingApi } from "./features/billing/billingApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      auth: authReducer,
      [videosApi.reducerPath]: videosApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer,
      [billingApi.reducerPath]: billingApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: process.env.NODE_ENV !== "production",
      }).concat(authApi.middleware, videosApi.middleware, adminApi.middleware, billingApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
