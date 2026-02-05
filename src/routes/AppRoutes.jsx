import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from '../pages/Home/Homepage'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import VerifyPage from '../pages/Verify/VerifyPage'
import StudentLayout from '../layouts/StudentLayout'
import InstituteLayout from '../layouts/InstituteLayout'
import AdminLayout from '../layouts/AdminLayout'
import StudentDashboard from '../pages/Student/StudentDashboard'
import StudentPortfolio from '../pages/Student/StudentPortfolio'
import InstituteDashboard from '../pages/Institute/InstituteDashboard'
import IssueCertificate from '../pages/Institute/IssueCertificate'
import BulkIssue from '../pages/Institute/BulkIssue'
import History from '../pages/Institute/History'
import Wallet from '../pages/Institute/Wallet'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminApprovals from '../pages/Admin/AdminApprovals'
import AdminInstitutes from '../pages/Admin/AdminInstitutes'
import AdminLogin from '../pages/Admin/AdminLogin'
import { ProtectedStudentRoute, ProtectedInstituteRoute, ProtectedAdminRoute } from './ProtectedRoutes'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/studentdashboard" element={<ProtectedStudentRoute><StudentLayout /></ProtectedStudentRoute>}>
        <Route index element={<StudentDashboard />} />
      </Route>

      <Route path="/studentportfolio" element={<ProtectedStudentRoute><StudentPortfolio /></ProtectedStudentRoute>} />

      <Route path="/institute" element={<ProtectedInstituteRoute><InstituteLayout /></ProtectedInstituteRoute>}>
        <Route path="dashboard" element={<InstituteDashboard />} />
        <Route path="issue" element={<IssueCertificate />} />
        <Route path="bulk-issue" element={<BulkIssue />} />
        <Route path="history" element={<History />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>

      <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="approvals" element={<AdminApprovals />} />
        <Route path="institutes" element={<AdminInstitutes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
