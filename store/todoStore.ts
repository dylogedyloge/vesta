import { create } from 'zustand'
import { Todo } from '@/types'

interface TodoStore {
  todos: Todo[];
  previousState: Todo[] | null;
  setInitialTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  rollbackToPreviousState: () => void;
  savePreviousState: () => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  previousState: null,
  setInitialTodos: (todos) => set({ todos: [...todos] }),
  
  savePreviousState: () => {
    set({ previousState: [...get().todos] });
  },
  
  rollbackToPreviousState: () => {
    const { previousState } = get();
    if (previousState) {
      set({ todos: [...previousState], previousState: null });
    }
  },
  
  addTodo: (todo) => {
    get().savePreviousState();
    set((state) => ({
      todos: [todo, ...state.todos]
    }));
  },
  
  updateTodo: (todo) => {
    get().savePreviousState();
    set((state) => ({
      todos: state.todos.map((t) => 
        t.id === todo.id ? { ...t, ...todo } : t
      )
    }));
  },
  
  deleteTodo: (id) => {
    get().savePreviousState();
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id)
    }));
  }
})); 