import axios from 'axios';

// Base API URL configured via environment variable with fallback to local backend port 5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Backend returned an error response (4xx, 5xx)
      message = error.response.data?.message || `Server error: ${error.response.statusText}`;
    } else if (error.request) {
      // Backend server is not reachable
      message = 'Cannot connect to backend server. Make sure the Express server is running on http://localhost:5000 and MongoDB is connected.';
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

/**
 * Service methods for Student REST API
 */
export const studentService = {
  // Check backend server health
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Get all students with optional search, branch, and semester filters
  getAllStudents: async (params = {}) => {
    const res = await apiClient.get('/students', { params });
    return res.data;
  },

  // Get aggregated dashboard statistics
  getDashboardStats: async () => {
    const res = await apiClient.get('/students/stats');
    return res.data;
  },

  // Get single student by ID
  getStudentById: async (id) => {
    const res = await apiClient.get(`/students/${id}`);
    return res.data;
  },

  // Create a new student
  createStudent: async (studentData) => {
    const res = await apiClient.post('/students', studentData);
    return res.data;
  },

  // Update an existing student
  updateStudent: async (id, studentData) => {
    const res = await apiClient.put(`/students/${id}`, studentData);
    return res.data;
  },

  // Delete a student
  deleteStudent: async (id) => {
    const res = await apiClient.delete(`/students/${id}`);
    return res.data;
  },
};

export default apiClient;
