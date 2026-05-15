import api from './axios';

export const registerUser = (data) =>
  api.post('/auth/register', data).then((r) => r.data);

export const loginUser = (data) =>
  api.post('/auth/login', data).then((r) => r.data);

export const getMe = () =>
  api.get('/auth/me').then((r) => r.data);

export const updatePassword = (data) =>
  api.put('/auth/password', data).then((r) => r.data);

export const deleteAccount = () =>
  api.delete('/auth/account').then((r) => r.data);
