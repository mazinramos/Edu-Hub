import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import RoleRedirect from './pages/RoleRedirect'
import LandingPage from './pages/LandingPage'
import { studentNavItems, teacherNavItems, parentNavItems } from './navItems'

const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const StudentCoursesPage = lazy(() => import('./pages/StudentCoursesPage'))
const StudentCourseDetailPage = lazy(() => import('./pages/StudentCourseDetailPage'))
const StudentTestsPage = lazy(() => import('./pages/StudentTestsPage'))
const StudentProfilePage = lazy(() => import('./pages/ProfileSettingsPage'))
const TeacherProfilePage = lazy(() => import('./pages/ProfileSettingsPage'))
const ParentProfilePage = lazy(() => import('./pages/ProfileSettingsPage'))
const TeachersDirectoryPage = lazy(() => import('./pages/TeachersDirectoryPage'))
const StudentCertificatesPage = lazy(() => import('./pages/StudentCertificatesPage'))
const CertificatePage = lazy(() => import('./pages/CertificatePage'))

const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'))
const TeacherCoursesPage = lazy(() => import('./pages/TeacherCoursesPage'))
const TeacherLessonsPage = lazy(() => import('./pages/TeacherLessonsPage'))
const TeacherTestsPage = lazy(() => import('./pages/TeacherTestsPage'))
const TeacherStudentsPage = lazy(() => import('./pages/TeacherStudentsPage'))
const TeacherEarningsPage = lazy(() => import('./pages/TeacherEarningsPage'))
const TeacherRatingsPage = lazy(() => import('./pages/TeacherRatingsPage'))
const TeacherMessagesPage = lazy(() => import('./pages/TeacherMessagesPage'))

const ParentDashboard = lazy(() => import('./pages/ParentDashboard'))
const ParentChildrenPage = lazy(() => import('./pages/ParentChildrenPage'))
const ParentProgressPage = lazy(() => import('./pages/ParentProgressPage'))
const ParentTestsPage = lazy(() => import('./pages/ParentTestsPage'))
const ParentContactPage = lazy(() => import('./pages/ParentContactPage'))

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminTeachersPage = lazy(() => import('./pages/AdminTeachersPage'))
const AdminStudentsPage = lazy(() => import('./pages/AdminStudentsPage'))
const AdminParentsPage = lazy(() => import('./pages/AdminParentsPage'))
const AdminCoursesPage = lazy(() => import('./pages/AdminCoursesPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
      جاري التحميل...
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/redirecting" element={<RoleRedirect />} />

            {/* الطالب */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute allowRoles={['student']}>
                  <StudentCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/course/:courseId"
              element={
                <ProtectedRoute allowRoles={['student']}>
                  <StudentCourseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/tests"
              element={
                <ProtectedRoute allowRoles={['student']}>
                  <StudentTestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowRoles={['student']}>
                  <StudentProfilePage navItems={studentNavItems} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certs"
              element={
                <ProtectedRoute allowRoles={['student']}>
                  <StudentCertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificate/:courseId"
              element={
                <ProtectedRoute allowRoles={['student']}>
                  <CertificatePage />
                </ProtectedRoute>
              }
            />

            {/* المدرس */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/lessons"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherLessonsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tests"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherTestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/earnings"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherEarningsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/ratings"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherRatingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/messages"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherMessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/profile"
              element={
                <ProtectedRoute allowRoles={['teacher']}>
                  <TeacherProfilePage navItems={teacherNavItems} />
                </ProtectedRoute>
              }
            />

            {/* ولي الأمر */}
            <Route
              path="/parent"
              element={
                <ProtectedRoute allowRoles={['parent']}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/children"
              element={
                <ProtectedRoute allowRoles={['parent']}>
                  <ParentChildrenPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/progress"
              element={
                <ProtectedRoute allowRoles={['parent']}>
                  <ParentProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/tests"
              element={
                <ProtectedRoute allowRoles={['parent']}>
                  <ParentTestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/contact"
              element={
                <ProtectedRoute allowRoles={['parent']}>
                  <ParentContactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/profile"
              element={
                <ProtectedRoute allowRoles={['parent']}>
                  <ParentProfilePage navItems={parentNavItems} />
                </ProtectedRoute>
              }
            />

            {/* صفحة عامة لتصفح المدرسين - متاحة بدون تسجيل دخول */}
            <Route path="/teachers" element={<TeachersDirectoryPage />} />

            {/* الإدارة */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teachers"
              element={
                <ProtectedRoute allowRoles={['admin']}>
                  <AdminTeachersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowRoles={['admin']}>
                  <AdminStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/parents"
              element={
                <ProtectedRoute allowRoles={['admin']}>
                  <AdminParentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowRoles={['admin']}>
                  <AdminCoursesPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
