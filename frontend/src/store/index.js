import { configureStore } from "@reduxjs/toolkit";
import authReducer        from "./authSlice";
import permissionsReducer from "./permissionsSlice";

export const store = configureStore({
  reducer: {
    auth:        authReducer,
    permissions: permissionsReducer,
  },
});