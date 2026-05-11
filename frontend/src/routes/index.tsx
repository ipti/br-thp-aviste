import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AppLayout } from '../components/ui/Layout/AppLayout';

const LoginPage            = lazy(() => import('../pages/login/LoginPage').then((m) => ({ default: m.LoginPage })));
const SchoolListPage       = lazy(() => import('../pages/schools/SchoolListPage').then((m) => ({ default: m.SchoolListPage })));
const SchoolDetailPage     = lazy(() => import('../pages/schools/SchoolDetailPage').then((m) => ({ default: m.SchoolDetailPage })));
const ClassroomListPage    = lazy(() => import('../pages/classrooms/ClassroomListPage').then((m) => ({ default: m.ClassroomListPage })));
const ClassroomDetailPage  = lazy(() => import('../pages/classrooms/ClassroomDetailPage').then((m) => ({ default: m.ClassroomDetailPage })));
const StudentDetailPage    = lazy(() => import('../pages/students/StudentDetailPage').then((m) => ({ default: m.StudentDetailPage })));
const RegistrationWizard   = lazy(() => import('../pages/students/components/wizard/RegistrationWizard').then((m) => ({ default: m.RegistrationWizard })));
const ConsultationListPage = lazy(() => import('../pages/consultations/ConsultationListPage').then((m) => ({ default: m.ConsultationListPage })));
const ReportsDashboard     = lazy(() => import('../pages/reports/ReportsDashboard').then((m) => ({ default: m.ReportsDashboard })));
const UserListPage         = lazy(() => import('../pages/users/UserListPage').then((m) => ({ default: m.UserListPage })));

const Loader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: 'var(--color-brand-primary)' }} />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/escolas" replace />} />
          <Route path="/escolas" element={<SchoolListPage />} />
          <Route path="/escolas/:schoolId" element={<SchoolDetailPage />} />
          <Route path="/turmas" element={<ClassroomListPage />} />
          <Route path="/turmas/:classroomId" element={<ClassroomDetailPage />} />
          <Route path="/turmas/:classroomId/criar-aluno" element={<RegistrationWizard />} />
          <Route path="/alunos/:studentId" element={<StudentDetailPage />} />
          <Route path="/consultas" element={<ConsultationListPage />} />
          <Route path="/relatorios" element={<ReportsDashboard />} />
          <Route path="/usuarios" element={<UserListPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);
