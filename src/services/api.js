import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
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

  resendStudentVerification: (email) =>
    api.post('/auth/student/resend-verification', { email }),

  resendInstituteVerification: (email) =>
    api.post('/university/resend-verification', { email }),

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
  
  updatePortfolioVisibility: (isPublic) => 
    api.patch('/student/portfolio/visibility', { isPublic }),

  updateProfile: (formData) => 
    api.patch('/student/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// ==================== UNIVERSITY APIs ====================

export const universityAPI = {
  getProfile: () => 
    api.get('/university/profile'),
  
  getDashboard: () => 
    api.get('/university/dashboard'),
  
  issueCertificate: (data) => 
    api.post('/university/certificate/issue', data),

  getSignPayload: (data) =>
    api.post('/university/certificate/sign-payload', data),

  issueSignedCertificate: (data) =>
    api.post('/university/certificate/issue-signed', data),
  
  bulkIssueCertificates: (data) => 
    api.post('/university/certificates/bulk', data),

  getBulkAuthMessage: (data) =>
    api.post('/university/certificate/bulk-auth', data),

  bulkIssueSigned: (data) =>
    api.post('/university/certificate/bulk-issue-signed', data),
  
  getCertificates: () => 
    api.get('/university/certificates'),

  searchStudents: (query, limit = 10) =>
    api.get(`/university/students/search?query=${encodeURIComponent(query)}&limit=${limit}`),
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

  revokeInstitute: (instituteId, data) =>
    api.post(`/admin/institutes/${instituteId}/revoke`, data),
  
  getIssuerStatus: (instituteId) => 
    api.get(`/admin/institutes/${instituteId}/issuer-status`),
  
  getStatistics: () => 
    api.get('/admin/statistics'),

  getBlockchainStatus: () =>
    api.get('/admin/blockchain/status'),

  getBalance: (address) =>
    api.get(`/payment/balance?address=${address}`),
};

// ==================== VERIFY APIs (Public) ====================

export const verifyAPI = {
  verifyCertificate: (certificateId) => 
    api.get(`/verify/certificate/${certificateId}`),
  
  getUserCertificates: (userId) => 
    api.get(`/verify/user/${userId}`),
};

// ==================== CONTACT APIs ====================

export const contactAPI = {
  sendContactMessage: (data) =>
    api.post('/contact/send-message', data),
};

// ==================== PAYMENT APIs ====================

export const paymentAPI = {
  getGasCost: () =>
    api.get('/payment/gas-cost'),

  getBalance: (address) =>
    api.get(`/payment/balance?address=${address}`),

  issueWithMetamask: (data) =>
    api.post('/payment/issue-with-metamask', data),

  bulkIssue: (data) =>
    api.post('/payment/bulk-issue', data),
};

// ==================== METAMASK APIs ====================

export const metamaskAPI = {
  getStatus: () =>
    api.get('/metamask/status'),
};

// ==================== CERTIFICATE APIs (MetaMask) ====================

export const certificateAPI = {
  issueWithMetamask: (data) =>
    api.post('/certificates/issue-with-metamask', data),
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
