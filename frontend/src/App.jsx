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

import ReportsPage      from "./pages/reports/ReportsPage";
import ProfilePage      from "./pages/auth/ProfilePage";
import SettingsPage     from "./pages/auth/SettingsPage";
import CurriculumPage   from "./pages/academic/CurriculumPage";
import SchedulePage     from "./pages/academic/SchedulePage";
import ExamSchedulePage from "./pages/academic/ExamSchedulePage";
import SubjectResourcesPage from "./pages/academic/SubjectResourcesPage";
import AttendanceReportPage from "./pages/academic/AttendanceReportPage";
import ExamsPage        from "./pages/academic/ExamsPage";
import RatingBookPage   from "./pages/academic/RatingBookPage";
import SubjectSelectionPage from "./pages/academic/SubjectSelectionPage";
import RetakeApplicationPage from "./pages/academic/RetakeApplicationPage";
import RetakeSchedulePage from "./pages/academic/RetakeSchedulePage";
import StudentResumePage from "./pages/student/StudentResumePage";
import StudentOrdersPage from "./pages/student/StudentOrdersPage";
import StudentCertificatesPage from "./pages/student/StudentCertificatesPage";
import StudentDocumentsPage from "./pages/student/StudentDocumentsPage";
import GraduationSheetPage from "./pages/student/GraduationSheetPage";
import ThesisPage from "./pages/student/ThesisPage";
import SocialActivityPage from "./pages/student/SocialActivityPage";
import PlagiarismInfoPage from "./pages/student/PlagiarismInfoPage";
import StudentGPAPage from "./pages/student/StudentGPAPage";
import SubjectCertificatesListPage from "./pages/student/SubjectCertificatesListPage";
import ScholarshipPage from "./pages/finance/ScholarshipPage";
import MessageListPage from "./pages/messages/MessageListPage";
import MessageComposePage from "./pages/messages/MessageComposePage";
import LoginHistoryPage from "./pages/auth/LoginHistoryPage";
import SurveyPage from "./pages/system/SurveyPage";
import PersonalRecordPage from "./pages/academic/PersonalRecordPage";
import FinanceContractsPage from "./pages/finance/FinanceContractsPage";
import ComingSoonPage   from "./pages/ComingSoonPage";
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

          {/* Reports */}
          <Route path="/reports" element={<ProtectedRoute menuKey="reports"><ReportsPage /></ProtectedRoute>} />

          {/* Academic (HEMIS style) */}
          <Route path="/academic/curriculum" element={<ProtectedRoute menuKey="curriculum"><CurriculumPage /></ProtectedRoute>} />
          <Route path="/academic/schedule"   element={<ProtectedRoute menuKey="schedule"><SchedulePage /></ProtectedRoute>} />
          <Route path="/academic/exams/schedule" element={<ProtectedRoute menuKey="exam_schedule"><ExamSchedulePage /></ProtectedRoute>} />
          <Route path="/academic/resources"      element={<ProtectedRoute menuKey="resources"><SubjectResourcesPage /></ProtectedRoute>} />
          <Route path="/academic/attendance" element={<ProtectedRoute menuKey="attendance"><AttendanceListPage /></ProtectedRoute>} />
          <Route path="/academic/attendance/report" element={<ProtectedRoute menuKey="attendance_report"><AttendanceReportPage /></ProtectedRoute>} />
          <Route path="/academic/grades"     element={<ProtectedRoute menuKey="grades"><GradeListPage /></ProtectedRoute>} />
          <Route path="/academic/personal-record" element={<ProtectedRoute menuKey="personal_record"><PersonalRecordPage /></ProtectedRoute>} />
          <Route path="/academic/exams"           element={<ProtectedRoute menuKey="exams"><ExamsPage /></ProtectedRoute>} />
          <Route path="/academic/rating-book"     element={<ProtectedRoute menuKey="rating_book"><RatingBookPage /></ProtectedRoute>} />
          <Route path="/academic/subject-selection" element={<ProtectedRoute menuKey="subject_selection"><SubjectSelectionPage /></ProtectedRoute>} />

          {/* Retake */}
          <Route path="/academic/retake/app"      element={<ProtectedRoute menuKey="retake_app"><RetakeApplicationPage /></ProtectedRoute>} />
          <Route path="/academic/retake/schedule" element={<ProtectedRoute menuKey="retake_schedule"><RetakeSchedulePage /></ProtectedRoute>} />
          <Route path="/academic/retake/exams"    element={<ProtectedRoute menuKey="retake_exams"><ExamSchedulePage /></ProtectedRoute>} />
          <Route path="/academic/retake/grades"   element={<ProtectedRoute menuKey="retake_grades"><RatingBookPage /></ProtectedRoute>} />

          {/* Student Info */}
          <Route path="/student/resume"           element={<ProtectedRoute menuKey="resume"><StudentResumePage /></ProtectedRoute>} />
          <Route path="/student/orders"           element={<ProtectedRoute menuKey="orders"><StudentOrdersPage /></ProtectedRoute>} />
          <Route path="/student/contracts"        element={<ProtectedRoute menuKey="contracts"><FinanceContractsPage /></ProtectedRoute>} />
          <Route path="/student/certificates"     element={<ProtectedRoute menuKey="certificates"><StudentCertificatesPage /></ProtectedRoute>} />
          <Route path="/student/documents"        element={<ProtectedRoute menuKey="documents"><StudentDocumentsPage /></ProtectedRoute>} />
          <Route path="/student/grad-sheet"       element={<ProtectedRoute menuKey="grad_sheet"><GraduationSheetPage /></ProtectedRoute>} />
          <Route path="/student/gpa"              element={<ProtectedRoute menuKey="gpa"><StudentGPAPage /></ProtectedRoute>} />
          <Route path="/student/certificates-list" element={<ProtectedRoute menuKey="cert_list"><SubjectCertificatesListPage /></ProtectedRoute>} />
          <Route path="/student/plagiarism"       element={<ProtectedRoute menuKey="plagiarism"><PlagiarismInfoPage /></ProtectedRoute>} />
          <Route path="/student/personal-info"    element={<PersonalRecordPage />} />
          <Route path="/student/thesis"           element={<ProtectedRoute menuKey="thesis"><ThesisPage /></ProtectedRoute>} />
          <Route path="/student/social"           element={<ProtectedRoute menuKey="social"><SocialActivityPage /></ProtectedRoute>} />
          
          {/* Finance */}
          <Route path="/finance/contracts"        element={<ProtectedRoute menuKey="fin_contracts"><FinanceContractsPage /></ProtectedRoute>} />
          <Route path="/finance/scholarship"      element={<ProtectedRoute menuKey="scholarship"><ScholarshipPage /></ProtectedRoute>} />

          {/* Messaging */}
          <Route path="/messages/list"            element={<ProtectedRoute menuKey="my_messages"><MessageListPage /></ProtectedRoute>} />
          <Route path="/messages/create"          element={<ProtectedRoute menuKey="create_message"><MessageComposePage /></ProtectedRoute>} />

          {/* System */}
          <Route path="/system/hemis-survey"      element={<ProtectedRoute menuKey="hemis_survey"><SurveyPage titleKey="system.hemis_survey_title" /></ProtectedRoute>} />
          <Route path="/system/global-survey"     element={<ProtectedRoute menuKey="global_survey"><SurveyPage titleKey="system.global_survey_title" /></ProtectedRoute>} />
          <Route path="/system/login-history"     element={<ProtectedRoute menuKey="login_history"><LoginHistoryPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/users"       element={<ProtectedRoute menuKey="users"><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/roles"       element={<ProtectedRoute menuKey="roles"><RolesPage /></ProtectedRoute>} />
          <Route path="/admin/permissions" element={<ProtectedRoute menuKey="permissions"><PermissionMatrix /></ProtectedRoute>} />

          {/* University */}
          <Route path="/university/students" element={<ProtectedRoute menuKey="students"><StudentsPage /></ProtectedRoute>} />
          <Route path="/university/groups"   element={<ProtectedRoute menuKey="groups"><GroupsPage /></ProtectedRoute>} />
          <Route path="/university/subjects" element={<ProtectedRoute menuKey="subjects"><SubjectsPage /></ProtectedRoute>} />

          {/* Account */}
          <Route path="/profile"  element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/" element={<CatchAll />} />
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </BrowserRouter>
  );
}