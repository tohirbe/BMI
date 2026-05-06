import { createSlice } from "@reduxjs/toolkit";

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: { items: [], loaded: false },
  reducers: {
    setPermissions(state, { payload }) {
      state.items  = payload;
      state.loaded = true;
    },
    clearPermissions(state) {
      state.items  = [];
      state.loaded = false;
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;

export const selectMenuItems  = (s) => s.permissions.items;
export const selectPermLoaded = (s) => s.permissions.loaded;