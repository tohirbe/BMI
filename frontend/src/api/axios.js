import axios from "axios";
import { store }                   from "../store";
import { updateAccess, logout }    from "../store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request: har so'rovga Bearer token qo'shish
api.interceptors.request.use((config) => {
  const access = store.getState().auth.access;
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Response: 401 da token yangilash
let isRefreshing = false;
let queue        = [];

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((e) => Promise.reject(e));
      }

      original._retry  = true;
      isRefreshing     = true;

      const refresh = store.getState().auth.refresh;
      if (!refresh) {
        store.dispatch(logout());
        return Promise.reject(err);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh/`,
          { refresh }
        );
        const newAccess = data.access;
        store.dispatch(updateAccess({ access: data.access, refresh: data.refresh }));
        processQueue(null, newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;