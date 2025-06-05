import axios from 'axios';
import { User } from '@/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const userApi = {
  getUsers: async () => {
    const response = await axios.get<User[]>(`${BASE_URL}/users`);
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await axios.get<User>(`${BASE_URL}/users/${id}`);
    return response.data;
  }
}; 