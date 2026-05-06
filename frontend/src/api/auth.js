import api from "./axios";

export const login        = (data)     => api.post("/auth/login/",   data);
export const refreshToken = (refresh)  => api.post("/auth/refresh/", { refresh });
export const getMe        = ()         => api.get("/auth/me/");
export const updateMe     = (data)     => api.patch("/auth/me/",     data);