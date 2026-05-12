import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'leetcode' | 'multifile' | 'acm';
  tags: string[];
  inputFormat: string;
  outputFormat: string;
  testCases: { input: string; output: string; score?: number }[];
  templateCode: { language: string; code: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  _id: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit' | 'memory_limit' | 'runtime_error' | 'compile_error';
  score: number;
  judgeMode: 'acm' | 'oi';
  testResults: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    score: number;
    time: number;
    memory: number;
  }[];
  createdAt: string;
}

export interface Exam {
  _id: string;
  title: string;
  description: string;
  problems: { problemId: string; score: number; order: number }[];
  startTime: string;
  endTime: string;
  judgeMode: 'acm' | 'oi';
  createdAt: string;
}

export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () => api.get('/auth/me'),
};

export const problemAPI = {
  getAll: (params?: { page?: number; limit?: number; difficulty?: string; type?: string; tag?: string }) =>
    api.get('/problems', { params }),
  
  getById: (id: string) => api.get(`/problems/${id}`),
  
  create: (data: Omit<Problem, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post('/problems', data),
  
  update: (id: string, data: Partial<Problem>) =>
    api.put(`/problems/${id}`, data),
  
  delete: (id: string) => api.delete(`/problems/${id}`),
};

export const judgeAPI = {
  submit: (problemId: string, code: string, language: string, judgeMode: 'acm' | 'oi') =>
    api.post('/judge/submit', { problemId, code, language, judgeMode }),
  
  getResult: (id: string) => api.get(`/judge/${id}`),
  
  getSubmissions: (params?: { page?: number; limit?: number; problemId?: string }) =>
    api.get('/judge/submissions', { params }),
};

export const aiAPI = {
  generateTestCases: (description: string, inputFormat: string, outputFormat: string, examples: { input: string; output: string }[], count: number) =>
    api.post('/ai/generate-testcases', { description, inputFormat, outputFormat, examples, count }),
};

export const examAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/exams', { params }),
  
  getById: (id: string) => api.get(`/exams/${id}`),
  
  create: (data: Omit<Exam, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post('/exams', data),
  
  update: (id: string, data: Partial<Exam>) =>
    api.put(`/exams/${id}`, data),
  
  delete: (id: string) => api.delete(`/exams/${id}`),
  
  addProblem: (id: string, problemId: string, score: number, order: number) =>
    api.post(`/exams/${id}/add-problem`, { problemId, score, order }),
};

export const importAPI = {
  fromOJ: (url: string) => api.post('/import/oj', { url }),
  
  fromPDF: (pdfBase64: string) => api.post('/import/pdf', { pdfBase64 }),
};

export default api;