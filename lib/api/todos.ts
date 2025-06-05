import axios from 'axios';
import { Todo } from '@/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const todoApi = {
  getTodos: async (page?: number, limit?: number) => {
    const params = page && limit ? `?_page=${page}&_limit=${limit}` : '';
    const response = await axios.get<Todo[]>(`${BASE_URL}/todos${params}`);
    return response.data;
  },

  getTodoById: async (id: string) => {
    const response = await axios.get<Todo>(`${BASE_URL}/todos/${id}`);
    return response.data;
  },

  createTodo: async (todo: Omit<Todo, 'id'>) => {
    const response = await axios.post<Todo>(`${BASE_URL}/todos`, todo);
    return response.data;
  },

  updateTodo: async (id: number, todo: Partial<Todo>) => {
    const response = await axios.put<Todo>(`${BASE_URL}/todos/${id}`, todo);
    return response.data;
  },

  deleteTodo: async (id: number) => {
    await axios.delete(`${BASE_URL}/todos/${id}`);
    return id;
  }
}; 