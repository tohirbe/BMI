import api from "./axios";

// ── University ──────────────────────────────────────────────────────────────
export const faculties     = {
  list:   (p)   => api.get("/faculties/",         { params: p }),
  get:    (id)  => api.get(`/faculties/${id}/`),
  create: (d)   => api.post("/faculties/",        d),
  update: (id, d) => api.patch(`/faculties/${id}/`, d),
  delete: (id)  => api.delete(`/faculties/${id}/`),
};

export const departments   = {
  list:   (p)   => api.get("/departments/",       { params: p }),
  get:    (id)  => api.get(`/departments/${id}/`),
  create: (d)   => api.post("/departments/",      d),
  update: (id, d) => api.patch(`/departments/${id}/`, d),
  delete: (id)  => api.delete(`/departments/${id}/`),
};

export const academicYears = {
  list:   ()    => api.get("/academic-years/"),
  get:    (id)  => api.get(`/academic-years/${id}/`),
  create: (d)   => api.post("/academic-years/",   d),
  update: (id, d) => api.patch(`/academic-years/${id}/`, d),
};

export const groups        = {
  list:   (p)   => api.get("/groups/",            { params: p }),
  get:    (id)  => api.get(`/groups/${id}/`),
  create: (d)   => api.post("/groups/",           d),
  update: (id, d) => api.patch(`/groups/${id}/`,  d),
  delete: (id)  => api.delete(`/groups/${id}/`),
};

export const studentProfiles = {
  list:   (p)   => api.get("/student-profiles/",  { params: p }),
  get:    (id)  => api.get(`/student-profiles/${id}/`),
  create: (d)   => api.post("/student-profiles/", d),
  update: (id, d) => api.patch(`/student-profiles/${id}/`, d),
};

export const teacherProfiles = {
  list:   (p)   => api.get("/teacher-profiles/",  { params: p }),
  get:    (id)  => api.get(`/teacher-profiles/${id}/`),
  update: (id, d) => api.patch(`/teacher-profiles/${id}/`, d),
};

// ── Academic ─────────────────────────────────────────────────────────────────
export const subjects      = {
  list:   (p)   => api.get("/subjects/",          { params: p }),
  get:    (id)  => api.get(`/subjects/${id}/`),
  create: (d)   => api.post("/subjects/",         d),
  update: (id, d) => api.patch(`/subjects/${id}/`, d),
  delete: (id)  => api.delete(`/subjects/${id}/`),
};

export const grades        = {
  list:         (p)    => api.get("/grades/",              { params: p }),
  get:          (id)   => api.get(`/grades/${id}/`),
  create:       (d)    => api.post("/grades/",             d),
  update:       (id, d) => api.patch(`/grades/${id}/`,     d),
  delete:       (id)   => api.delete(`/grades/${id}/`),
  bulkUpload:   (form) => api.post("/grades/bulk-upload/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

export const attendance    = {
  list:         (p)    => api.get("/attendance/",              { params: p }),
  get:          (id)   => api.get(`/attendance/${id}/`),
  create:       (d)    => api.post("/attendance/",             d),
  update:       (id, d) => api.patch(`/attendance/${id}/`,     d),
  delete:       (id)   => api.delete(`/attendance/${id}/`),
  bulkUpload:   (form) => api.post("/attendance/bulk-upload/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

// ── RBAC ─────────────────────────────────────────────────────────────────────
export const rbac          = {
  myPermissions:     ()       => api.get("/rbac/my-permissions/"),
  roles:             ()       => api.get("/rbac/roles/"),
  rolePerms:         (id)     => api.get(`/rbac/roles/${id}/permissions/`),
  saveRolePerm:      (id, d)  => api.post(`/rbac/roles/${id}/permissions/`, d),
  menuItems:         ()       => api.get("/rbac/menu-items/"),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notifications = {
  list:        (p)   => api.get("/notifications/",          { params: p }),
  create:      (d)   => api.post("/notifications/",         d),
  markRead:    (id)  => api.patch(`/notifications/${id}/read/`),
  unreadCount: ()    => api.get("/notifications/unread-count/"),
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analytics     = {
  university:  (p)   => api.get("/analytics/university/",        { params: p }),
  faculty:     (id, p) => api.get(`/analytics/faculty/${id}/`,   { params: p }),
  department:  (id, p) => api.get(`/analytics/department/${id}/`,{ params: p }),
  group:       (id, p) => api.get(`/analytics/group/${id}/`,     { params: p }),
  subject:     (id, p) => api.get(`/analytics/subject/${id}/`,   { params: p }),
  student:     (id, p) => api.get(`/analytics/student/${id}/`,   { params: p }),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const users         = {
  list:   (p)    => api.get("/users/",         { params: p }),
  get:    (id)   => api.get(`/users/${id}/`),
  create: (d)    => api.post("/users/",        d),
  update: (id, d) => api.patch(`/users/${id}/`, d),
  delete: (id)   => api.delete(`/users/${id}/`),
};