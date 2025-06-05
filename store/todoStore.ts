import { create } from 'zustand'
import { Todo } from '@/types'

interface TodoStore {
  todos: Todo[];
  setInitialTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  setInitialTodos: (todos) => set({ todos: [...todos] }),
  addTodo: (todo) => set((state) => ({
    todos: [todo, ...state.todos]
  })),
  updateTodo: (todo) => set((state) => ({
    todos: state.todos.map((t) => 
      t.id === todo.id ? { ...t, ...todo } : t
    )
  })),
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((t) => t.id !== id)
  }))
})) 