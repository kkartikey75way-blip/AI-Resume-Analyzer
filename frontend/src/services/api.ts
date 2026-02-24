import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Resume API
export const resumeAPI = {
    analyzeText: (text: string) =>
        api.post('/resume/analyze', { text }),
    analyzeFile: (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.post('/resume/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getHistory: () => api.get('/resume/history'),
    getAnalysis: (id: string) => api.get(`/resume/${id}`),
    deleteAnalysis: (id: string) => api.delete(`/resume/${id}`),
    generateResume: (id: string) => api.post(`/resume/${id}/generate`),
    generateRoadmap: (id: string) => api.post(`/resume/${id}/roadmap`),
};

export default api;
