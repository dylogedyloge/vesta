import axios from 'axios';
import { todoApi } from '../todos';
import { API_CONFIG } from '@/config';
import { Todo } from '@/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('todoApi', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should fetch all todos when no pagination params are provided', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockTodo] });

      const result = await todoApi.getTodos();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/todos`);
      expect(result).toEqual([mockTodo]);
    });

    it('should fetch todos with pagination when params are provided', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockTodo] });

      const page = 1;
      const limit = 10;
      const result = await todoApi.getTodos(page, limit);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/todos?_page=${page}&_limit=${limit}`
      );
      expect(result).toEqual([mockTodo]);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(todoApi.getTodos()).rejects.toThrow('Network error');
    });
  });

  describe('getTodoById', () => {
    it('should fetch a single todo by id', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockTodo });

      const result = await todoApi.getTodoById('1');

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/todos/1`);
      expect(result).toEqual(mockTodo);
    });

    it('should handle API errors', async () => {
      const error = new Error('Todo not found');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(todoApi.getTodoById('999')).rejects.toThrow('Todo not found');
    });
  });

  describe('createTodo', () => {
    const newTodo: Omit<Todo, 'id'> = {
      title: 'New Todo',
      completed: false,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    it('should create a new todo', async () => {
      const createdTodo = { ...newTodo, id: '2' };
      mockedAxios.post.mockResolvedValueOnce({ data: createdTodo });

      const result = await todoApi.createTodo(newTodo);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/todos`,
        newTodo
      );
      expect(result).toEqual(createdTodo);
    });

    it('should handle API errors', async () => {
      const error = new Error('Failed to create todo');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(todoApi.createTodo(newTodo)).rejects.toThrow('Failed to create todo');
    });
  });

  describe('updateTodo', () => {
    const update = { title: 'Updated Todo', completed: true };

    it('should update an existing todo', async () => {
      const updatedTodo = { ...mockTodo, ...update };
      mockedAxios.put.mockResolvedValueOnce({ data: updatedTodo });

      const result = await todoApi.updateTodo('1', update);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/todos/1`,
        update
      );
      expect(result).toEqual(updatedTodo);
    });

    it('should handle API errors', async () => {
      const error = new Error('Failed to update todo');
      mockedAxios.put.mockRejectedValueOnce(error);

      await expect(todoApi.updateTodo('1', update)).rejects.toThrow('Failed to update todo');
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: {} });

      const result = await todoApi.deleteTodo('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/todos/1`);
      expect(result).toBe('1');
    });

    it('should handle API errors', async () => {
      const error = new Error('Failed to delete todo');
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(todoApi.deleteTodo('1')).rejects.toThrow('Failed to delete todo');
    });
  });
}); 