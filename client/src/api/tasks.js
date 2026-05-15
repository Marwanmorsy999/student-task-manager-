import api from './axios';

export const fetchTasks = (params = {}) =>
  api.get('/tasks', { params }).then((r) => r.data);

export const fetchStats = () =>
  api.get('/tasks/stats').then((r) => r.data);

export const fetchTimeStats = (params = {}) =>
  api.get('/tasks/time-stats', { params }).then((r) => r.data);

export const createTask = (data) =>
  api.post('/tasks', data).then((r) => r.data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then((r) => r.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((r) => r.data);

export const startTimer = (id) =>
  api.post(`/tasks/${id}/start-timer`).then((r) => r.data);

export const stopTimer = (id) =>
  api.post(`/tasks/${id}/stop-timer`).then((r) => r.data);
