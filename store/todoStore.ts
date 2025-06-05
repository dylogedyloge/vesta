import { create } from 'zustand'
import {Todo,TodoStore} from '@/types'


export const useTodoStore = create<TodoStore>()((set) => ({
  todos: [],
  
  addTodo: (todo: Todo) => 
    set((state) => ({
      todos: [todo, ...state.todos]
    })),
  
  editTodo: (updatedTodo: Todo) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    })),
  
  deleteTodo: (todoId: number) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== todoId)
    })),
    
  setInitialTodos: (todos: Todo[]) =>
    set(() => ({
      todos: todos
    }))
})) 