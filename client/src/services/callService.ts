import api from './api';
import type { CallRequest } from '../types';

export const startCall = async (callData: CallRequest) => {
  const response = await api.post('/call/start', callData);
  return response.data;
};

export const getCallHistory = async () => {
  const response = await api.get('/call/history');
  return response.data;
};

export const uploadPhoneNumbers = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/call/upload-numbers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};