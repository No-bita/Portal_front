import api from './api';

export const startAttempt = async (year, shift) => {
  const response = await api.post('/attempts/start', { year, shift });
  return response.data;
};

export const submitAttempt = async (attemptId, responses) => {
  const response = await api.post(`/attempts/${attemptId}/submit`, { responses });
  return response.data;
};

export const getResults = async (attemptId) => {
  const response = await api.get(`/results/${attemptId}`);
  return response.data;
};

export const getAttempts = async () => {
  const response = await api.get('/attempts');
  return response.data;
};

export const getAvailableExams = async () => {
  const response = await api.get('/exams/available');
  return response.data;
};
