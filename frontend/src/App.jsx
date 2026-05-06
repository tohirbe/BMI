import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector }   from "react-redux";
import { Toaster }       from "react-hot-toast";
import { selectUser }    from "./store/authSlice";
import { getDashboardPath } from "./utils/helpers";

import MainLayout         from "./components/layout/MainLayout";
import ProtectedRoute     from "./components/layout/ProtectedRoute";

import LoginPage          from "./pages/auth/LoginPage";

import RectorDashboard    from "./pages/dashboard/RectorDashboard";
import DeanDashboard      from "./pages/dashboard/DeanDashboard";
import HeadDashboard      from "./pages/dashboard/HeadDashboard";
import TeacherDashboard   from "./pages/dashboard/TeacherDashboard";
import StudentDashboard   from "./pages/dashboard/StudentDashboard";

import GradeListPage      from "./pages/grades/GradeListPage";
import GradeFormPage      from "./pages/grades/GradeFormPage";
import GradeBulkPage      from "./pages/grades/GradeBulkPage";
import AttendanceListPage  from "./pages/attendance/AttendanceListPage";
import AttendanceDailyPage from "./pages/attendance/AttendanceDailyPage";
import AttendanceBulkPage  from "./pages/attendance/AttendanceBulkPage";

import UniversityAnalytics from "./pages/analytics/UniversityAnalytics";
import FacultyAnalytics    from "./pages/analytics/FacultyAnalytics";
import DepartmentAnalytics from "./pages/analytics/DepartmentAnalytics";
import GroupAnalytics      from "./pages/analytics/GroupAnalytics";
import StudentAnalytics    from "./pages/analytics/StudentAnalytics";
import SubjectAnalytics    from "./pages/analytics/SubjectAnalytics";

import NotifPage           from "./pages/notifications/NotifPage";
import NotifCompose        from "./pages/notifications/NotifCompose";

import StudentsPage        from "./pages/university/StudentsPage";
import GroupsPage          from "./pages/university/GroupsPage";
import SubjectsPage        from "./pages/university/SubjectsPage";

import UsersPage           from "./pages/admin/UsersPage";
import RolesPage           from "./pages/admin/RolesPage";
import PermissionMatrix    from "./pages/admin/PermissionMatrix";

import Page403             from "./pages/Page403";

function DashboardRedirect() {
  const user = useSelector(selectUser);
  return <Navigate to={getDashboardPath(user?.role)} replace />;
}

function CatchAll() {
  const user = useSelector(selectUser);
  return <Navigate to={user ? getDashboardPath(user.role) : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403"   element={<Page403 />} />

        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Dashboard */}
          <Route path="/dashboard"         element={<DashboardRedirect />} />
          <Route path="/dashboard/rector"  element={<ProtectedRoute menuKey="dashboard"><RectorDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/dean"    element={<ProtectedRoute menuKey="dashboard"><DeanDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/head"    element={<ProtectedRoute menuKey="dashboard"><HeadDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/teacher" element={<ProtectedRoute menuKey="dashboard"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/student" element={<ProtectedRoute menuKey="dashboard"><StudentDashboard /></ProtectedRoute>} />

          {/* Grades */}
          <Route path="/grades"           element={<ProtectedRoute menuKey="grades"><GradeListPage /></ProtectedRoute>} />
          <Route path="/grades/new"       element={<ProtectedRoute menuKey="grades"><GradeFormPage /></ProtectedRoute>} />
          <Route path="/grades/:id/edit"  element={<ProtectedRoute menuKey="grades"><GradeFormPage /></ProtectedRoute>} />
          <Route path="/grades/bulk"      element={<ProtectedRoute menuKey="grades"><GradeBulkPage /></ProtectedRoute>} />

          {/* Attendance */}
          <Route path="/attendance"       element={<ProtectedRoute menuKey="attendance"><AttendanceListPage /></ProtectedRoute>} />
          <Route path="/attendance/daily" element={<ProtectedRoute menuKey="attendance"><AttendanceDailyPage /></ProtectedRoute>} />
          <Route path="/attendance/bulk"  element={<ProtectedRoute menuKey="attendance"><AttendanceBulkPage /></ProtectedRoute>} />

          {/* Analytics */}
          <Route path="/analytics"                element={<ProtectedRoute menuKey="analytics"><UniversityAnalytics /></ProtectedRoute>} />
          <Route path="/analytics/faculty/:id"    element={<ProtectedRoute menuKey="analytics"><FacultyAnalytics /></ProtectedRoute>} />
          <Route path="/analytics/department/:id" element={<ProtectedRoute menuKey="analytics"><DepartmentAnalytics /></ProtectedRoute>} />
          <Route path="/analytics/group/:id"      element={<ProtectedRoute menuKey="analytics"><GroupAnalytics /></ProtectedRoute>} />
          <Route path="/analytics/student/:id"    element={<ProtectedRoute menuKey="analytics"><StudentAnalytics /></ProtectedRoute>} />
          <Route path="/analytics/subject/:id"    element={<ProtectedRoute menuKey="analytics"><SubjectAnalytics /></ProtectedRoute>} />

          {/* Notifications */}
          <Route path="/notifications"         element={<ProtectedRoute menuKey="notifications"><NotifPage /></ProtectedRoute>} />
          <Route path="/notifications/compose" element={<ProtectedRoute menuKey="notifications"><NotifCompose /></ProtectedRoute>} />

          {/* University */}
          <Route path="/students" element={<ProtectedRoute menuKey="students"><StudentsPage /></ProtectedRoute>} />
          <Route path="/groups"   element={<ProtectedRoute menuKey="groups"><GroupsPage /></ProtectedRoute>} />
          <Route path="/subjects" element={<ProtectedRoute menuKey="subjects"><SubjectsPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/users"       element={<ProtectedRoute menuKey="users"><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/roles"       element={<ProtectedRoute menuKey="roles"><RolesPage /></ProtectedRoute>} />
          <Route path="/admin/permissions" element={<ProtectedRoute menuKey="permissions"><PermissionMatrix /></ProtectedRoute>} />
        </Route>

        <Route path="/" element={<CatchAll />} />
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </BrowserRouter>
  );
}