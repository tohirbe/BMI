import { createSlice } from "@reduxjs/toolkit";

function load() {
  try {
    const s = localStorage.getItem("auth");
    return s ? JSON.parse(s) : { user: null, access: null, refresh: null };
  } catch {
    return { user: null, access: null, refresh: null };
  }
}

function save(user, access, refresh) {
  localStorage.setItem("auth", JSON.stringify({ user, access, refresh }));
}

const authSlice = createSlice({
  name: "auth",
  initialState: load(),
  reducers: {
    setCredentials(state, { payload }) {
      state.user    = payload.user;
      state.access  = payload.access;
      state.refresh = payload.refresh;
      save(state.user, state.access, state.refresh);
    },
    updateAccess(state, { payload }) {
      state.access  = payload.access;
      if (payload.refresh) state.refresh = payload.refresh;
      save(state.user, state.access, state.refresh);
    },
    logout(state) {
      state.user    = null;
      state.access  = null;
      state.refresh = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, updateAccess, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectUser    = (s) => s.auth.user;
export const selectAccess  = (s) => s.auth.access;
export const selectRefresh = (s) => s.auth.refresh;