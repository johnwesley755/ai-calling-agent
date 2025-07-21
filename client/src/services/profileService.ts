import api from './api';
import type { User } from '../types';

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
}

export const getProfile = async (): Promise<User> => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData: ProfileUpdateData): Promise<User> => {
  const response = await api.put('/profile', profileData);
  return response.data;
};