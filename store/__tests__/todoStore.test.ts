import { useTodoStore } from '../todoStore';
import { Todo } from '@/types';

describe('Todo Store', () => {
  // Clear the store before each test
  beforeEach(() => {
    useTodoStore.setState({ todos: [], previousState: null });
  });

  // Helper function to create a mock todo
  const createMockTodo = (id: string): Todo => ({
    id,
    title: `Todo ${id}`,
    completed: false,
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  describe('setInitialTodos', () => {
    it('should set initial todos', () => {
      const mockTodos = [createMockTodo('1'), createMockTodo('2')];
      useTodoStore.getState().setInitialTodos(mockTodos);
      
      expect(useTodoStore.getState().todos).toHaveLength(2);
      expect(useTodoStore.getState().todos).toEqual(mockTodos);
    });
  });

  describe('addTodo', () => {
    it('should add a new todo to the beginning of the list', () => {
      const newTodo = createMockTodo('1');
      useTodoStore.getState().addTodo(newTodo);
      
      expect(useTodoStore.getState().todos).toHaveLength(1);
      expect(useTodoStore.getState().todos[0]).toEqual(newTodo);
    });

    it('should save previous state before adding', () => {
      const initialTodo = createMockTodo('1');
      useTodoStore.getState().addTodo(initialTodo);
      
      const newTodo = createMockTodo('2');
      useTodoStore.getState().addTodo(newTodo);
      
      expect(useTodoStore.getState().previousState).toHaveLength(1);
      expect(useTodoStore.getState().previousState![0]).toEqual(initialTodo);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', () => {
      const todo = createMockTodo('1');
      useTodoStore.getState().addTodo(todo);
      
      const updatedTodo = { ...todo, title: 'Updated Title', completed: true };
      useTodoStore.getState().updateTodo(updatedTodo);
      
      expect(useTodoStore.getState().todos[0].title).toBe('Updated Title');
      expect(useTodoStore.getState().todos[0].completed).toBe(true);
    });

    it('should save previous state before updating', () => {
      const originalTodo = createMockTodo('1');
      useTodoStore.getState().addTodo(originalTodo);
      
      const updatedTodo = { ...originalTodo, title: 'Updated Title' };
      useTodoStore.getState().updateTodo(updatedTodo);
      
      expect(useTodoStore.getState().previousState![0]).toEqual(originalTodo);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const todo = createMockTodo('1');
      useTodoStore.getState().addTodo(todo);
      
      useTodoStore.getState().deleteTodo(todo.id);
      
      expect(useTodoStore.getState().todos).toHaveLength(0);
    });

    it('should save previous state before deleting', () => {
      const todo = createMockTodo('1');
      useTodoStore.getState().addTodo(todo);
      
      useTodoStore.getState().deleteTodo(todo.id);
      
      expect(useTodoStore.getState().previousState).toHaveLength(1);
      expect(useTodoStore.getState().previousState![0]).toEqual(todo);
    });
  });

  describe('rollbackToPreviousState', () => {
    it('should restore the previous state', () => {
      const originalTodo = createMockTodo('1');
      useTodoStore.getState().addTodo(originalTodo);
      
      const newTodo = createMockTodo('2');
      useTodoStore.getState().addTodo(newTodo);
      
      useTodoStore.getState().rollbackToPreviousState();
      
      expect(useTodoStore.getState().todos).toHaveLength(1);
      expect(useTodoStore.getState().todos[0]).toEqual(originalTodo);
      expect(useTodoStore.getState().previousState).toBeNull();
    });

    it('should do nothing if there is no previous state', () => {
      const todo = createMockTodo('1');
      useTodoStore.getState().setInitialTodos([todo]);
      useTodoStore.getState().rollbackToPreviousState();
      
      expect(useTodoStore.getState().todos).toHaveLength(1);
      expect(useTodoStore.getState().todos[0]).toEqual(todo);
    });
  });
}); 