import { create } from 'zustand'
import { Todo } from '@/types'

interface TodoStore {
  todos: Todo[];
  setInitialTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  setInitialTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => {
    const newTodos = [todo, ...state.todos];
    return { todos: newTodos };
  }),
  updateTodo: (todo) => set((state) => {
    const newTodos = state.todos.map((t) => t.id === todo.id ? todo : t);
    return { todos: newTodos };
  }),
  deleteTodo: (id) => set((state) => {
    const newTodos = state.todos.filter((t) => t.id !== id);
    return { todos: newTodos };
  })
})) 