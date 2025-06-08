import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo, getTodoBySlug } from '../todos';
import { todoApi } from '@/lib/api/todos';
import { generateSlug } from '@/lib/utils';
import { API_CONFIG } from '@/config';

// Mock the todoApi
jest.mock('@/lib/api/todos');
const mockedTodoApi = todoApi as jest.Mocked<typeof todoApi>;

// Mock fetch
global.fetch = jest.fn();
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('Todo Server Actions', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    userId: '1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should return todos successfully', async () => {
      mockedTodoApi.getTodos.mockResolvedValue([mockTodo]);

      const result = await getTodos();

      expect(result).toEqual({ data: [mockTodo], error: null });
      expect(mockedTodoApi.getTodos).toHaveBeenCalled();
    });

    it('should handle pagination parameters', async () => {
      mockedTodoApi.getTodos.mockResolvedValue([mockTodo]);

      await getTodos(1, 10);

      expect(mockedTodoApi.getTodos).toHaveBeenCalledWith(1, 10);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch todos');
      mockedTodoApi.getTodos.mockRejectedValue(error);

      const result = await getTodos();

      expect(result).toEqual({ data: null, error: 'Failed to fetch todos' });
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id successfully', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTodo)
      } as Response);

      const result = await getTodoById('1');

      expect(result).toEqual({ data: mockTodo, error: null });
      expect(mockedFetch).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/todos/1`);
    });

    it('should handle non-ok response', async () => {
      mockedFetch.mockResolvedValue({
        ok: false
      } as Response);

      const result = await getTodoById('1');

      expect(result).toEqual({ data: null, error: 'Failed to fetch todo' });
    });

    it('should handle network errors', async () => {
      mockedFetch.mockRejectedValue(new Error('Network error'));

      const result = await getTodoById('1');

      expect(result).toEqual({ data: null, error: 'Network error' });
    });
  });

  describe('createTodo', () => {
    const newTodo = {
      title: 'New Todo',
      completed: false,
      userId: '1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    it('should create a todo successfully', async () => {
      mockedTodoApi.createTodo.mockResolvedValue({ ...newTodo, id: '1000' });

      const result = await createTodo(newTodo);

      expect(result.data).toMatchObject({
        title: newTodo.title,
        completed: newTodo.completed,
        userId: newTodo.userId,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
      expect(result.error).toBeNull();
    });

    it('should handle API failure gracefully with mock data', async () => {
      mockedTodoApi.createTodo.mockRejectedValue(new Error('API Error'));

      const result = await createTodo(newTodo);

      expect(result.data).toMatchObject({
        title: newTodo.title,
        completed: newTodo.completed,
        userId: newTodo.userId,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
      expect(result.error).toBeNull();
    });
  });

  describe('updateTodo', () => {
    const todoUpdate = {
      title: 'Updated Todo',
      completed: true
    };

    it('should update a todo successfully', async () => {
      mockedTodoApi.updateTodo.mockResolvedValue({ ...mockTodo, ...todoUpdate });

      const result = await updateTodo('1', todoUpdate);

      expect(result.data).toMatchObject({
        id: '1',
        ...todoUpdate
      });
      expect(result.error).toBeNull();
    });

    it('should handle API failure gracefully with mock data', async () => {
      mockedTodoApi.updateTodo.mockRejectedValue(new Error('API Error'));

      const result = await updateTodo('1', todoUpdate);

      expect(result.data).toMatchObject({
        id: '1',
        ...todoUpdate
      });
      expect(result.error).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      mockedTodoApi.deleteTodo.mockResolvedValue('1');

      const result = await deleteTodo('1');

      expect(result).toEqual({ data: '1', error: null });
      expect(mockedTodoApi.deleteTodo).toHaveBeenCalledWith('1');
    });

    it('should handle API failure gracefully', async () => {
      mockedTodoApi.deleteTodo.mockRejectedValue(new Error('API Error'));

      const result = await deleteTodo('1');

      expect(result).toEqual({ data: '1', error: null });
    });
  });

  describe('getTodoBySlug', () => {
    const mockTodos = [
      {
        id: 1,
        title: 'Test Todo',
        completed: false,
        userId: 1
      }
    ];

    it('should return a todo by slug successfully', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTodos)
      } as Response);

      const slug = generateSlug(mockTodos[0].title);
      const result = await getTodoBySlug(slug);

      expect(result.data).toMatchObject({
        id: '1',
        title: 'Test Todo',
        completed: false,
        userId: '1'
      });
      expect(result.error).toBeNull();
    });

    it('should return error when todo is not found', async () => {
      mockedFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTodos)
      } as Response);

      const result = await getTodoBySlug('non-existent-slug');

      expect(result).toEqual({ data: null, error: 'Todo not found' });
    });

    it('should handle fetch errors', async () => {
      mockedFetch.mockRejectedValue(new Error('Network error'));

      const result = await getTodoBySlug('test-todo');

      expect(result).toEqual({ data: null, error: 'Network error' });
    });

    it('should handle non-ok response', async () => {
      mockedFetch.mockResolvedValue({
        ok: false
      } as Response);

      const result = await getTodoBySlug('test-todo');

      expect(result).toEqual({ data: null, error: 'Failed to fetch todos' });
    });
  });
}); 