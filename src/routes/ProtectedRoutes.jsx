import { Navigate } from 'react-router-dom'
import { getStudentToken, getUniversityToken, getAdminToken } from '../services/api'

/**
 * ProtectedRoute component for Student routes
 * Redirects to /login if student is not authenticated
 */
export function ProtectedStudentRoute({ children }) {
  const studentToken = getStudentToken()
  
  if (!studentToken) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

/**
 * ProtectedRoute component for Institute routes
 * Redirects to /login if institute is not authenticated
 */
export function ProtectedInstituteRoute({ children }) {
  const instituteToken = getUniversityToken()
  
  if (!instituteToken) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

/**
 * ProtectedRoute component for Admin routes
 * Redirects to /admin/login if admin is not authenticated
 */
export function ProtectedAdminRoute({ children }) {
  const adminToken = getAdminToken()
  
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />
  }
  
  return children
}
