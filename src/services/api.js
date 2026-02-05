import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studentToken') || 
                  localStorage.getItem('instituteToken') || 
                  localStorage.getItem('adminToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired token
      localStorage.removeItem('studentToken');
      localStorage.removeItem('instituteToken');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================

export const authAPI = {
  // Student Auth
  registerStudent: (data) => 
    api.post('/auth/student/register', data),
  
  loginStudent: (data) => 
    api.post('/auth/student/login', data),
  
  getStudentProfile: () => 
    api.get('/auth/student/profile'),

  // University Auth
  registerUniversity: (formData) => 
    api.post('/university/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  loginUniversity: (data) => 
    api.post('/university/login', data),
  
  getUniversityProfile: () => 
    api.get('/university/profile'),

  // Admin Auth
  loginAdmin: (data) => 
    api.post('/admin/login', data),
  
  getAdminProfile: () => 
    api.get('/admin/profile'),
};

// ==================== STUDENT APIs ====================

export const studentAPI = {
  getDashboard: () => 
    api.get('/student/dashboard'),
  
  getCertificates: () => 
    api.get('/student/certificates'),
  
  getCertificateDetails: (certificateId) => 
    api.get(`/student/certificates/${certificateId}`),
  
  verifyCertificate: (certificateId) => 
    api.get(`/student/certificates/${certificateId}/verify`),
  
  getCareerInsights: (regenerate = false) => 
    api.post('/student/career-insights', { regenerate }),
};

// ==================== UNIVERSITY APIs ====================

export const universityAPI = {
  getProfile: () => 
    api.get('/university/profile'),
  
  getDashboard: () => 
    api.get('/university/dashboard'),
  
  issueCertificate: (data) => 
    api.post('/university/certificate/issue', data),
  
  bulkIssueCertificates: (data) => 
    api.post('/university/certificates/bulk', data),
  
  getCertificates: () => 
    api.get('/university/certificates'),
};

// ==================== ADMIN APIs ====================

export const adminAPI = {
  getProfile: () => 
    api.get('/admin/profile'),
  
  getDashboard: () => 
    api.get('/admin/dashboard'),
  
  getInstitutes: () => 
    api.get('/admin/institutes'),
  
  getPendingInstitutes: () => 
    api.get('/admin/institutes/pending'),
  
  approveInstitute: (instituteId, data) => 
    api.post(`/admin/institutes/${instituteId}/approve`, data),
  
  rejectInstitute: (instituteId, data) => 
    api.post(`/admin/institutes/${instituteId}/reject`, data),
  
  getIssuerStatus: (instituteId) => 
    api.get(`/admin/institutes/${instituteId}/issuer-status`),
  
  getStatistics: () => 
    api.get('/admin/statistics'),
};

// ==================== VERIFY APIs (Public) ====================

export const verifyAPI = {
  verifyCertificate: (certificateId) => 
    api.get(`/verify/certificate/${certificateId}`),
  
  getUserCertificates: (userId) => 
    api.get(`/verify/user/${userId}`),
};

// ==================== UTILITY FUNCTIONS ====================

export const setStudentToken = (token) => {
  localStorage.setItem('studentToken', token);
};

export const setUniversityToken = (token) => {
  localStorage.setItem('instituteToken', token);
};

export const setAdminToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const clearAllTokens = () => {
  localStorage.removeItem('studentToken');
  localStorage.removeItem('instituteToken');
  localStorage.removeItem('adminToken');
};

export const getStudentToken = () => localStorage.getItem('studentToken');
export const getUniversityToken = () => localStorage.getItem('instituteToken');
export const getAdminToken = () => localStorage.getItem('adminToken');

export default api;
