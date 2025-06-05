import axios from 'axios';
import { User } from '@/types';
import { API_CONFIG } from '@/config';

export const userApi = {
  getUsers: async () => {
    const response = await axios.get<User[]>(`${API_CONFIG.BASE_URL}/users`);
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await axios.get<User>(`${API_CONFIG.BASE_URL}/users/${id}`);
    return response.data;
  }
}; 