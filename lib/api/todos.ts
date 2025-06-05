import axios from 'axios';
import { Todo } from '@/types';
import { API_CONFIG } from '@/config';

export const todoApi = {
  getTodos: async (page?: number, limit?: number) => {
    // If no page and limit are provided, fetch all todos
    if (!page && !limit) {
      const response = await axios.get<Todo[]>(`${API_CONFIG.BASE_URL}/todos`);
      return response.data;
    }
    // Otherwise use pagination
    const params = `?_page=${page}&_limit=${limit}`;
    const response = await axios.get<Todo[]>(`${API_CONFIG.BASE_URL}/todos${params}`);
    return response.data;
  },

  getTodoById: async (id: string) => {
    const response = await axios.get<Todo>(`${API_CONFIG.BASE_URL}/todos/${id}`);
    return response.data;
  },

  createTodo: async (todo: Omit<Todo, 'id'>) => {
    const response = await axios.post<Todo>(`${API_CONFIG.BASE_URL}/todos`, todo);
    return response.data;
  },

  updateTodo: async (id: number, todo: Partial<Todo>) => {
    const response = await axios.put<Todo>(`${API_CONFIG.BASE_URL}/todos/${id}`, todo);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    await axios.delete(`${API_CONFIG.BASE_URL}/todos/${id}`);
    return id;
  }
}; 