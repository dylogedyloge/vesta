'use server'

import { Todo } from "@/types";
import { todoApi } from "@/lib/api/todos";
import { userApi } from "@/lib/api/users";
import { revalidatePath } from "next/cache";

let mockTodoId = 1000;

export async function createTodo(todo: Omit<Todo, 'id'>) {
  try {
    // Try the API call (will fail for JSONPlaceholder)
    await todoApi.createTodo(todo);
    
    // Return mock data for UI
    const newTodo: Todo = {
      id: mockTodoId++,
      ...todo
    };
    
    revalidatePath('/');
    return { data: newTodo, error: null };
  } catch (error) {
    // Even if API fails, return mock data
    const newTodo: Todo = {
      id: mockTodoId++,
      ...todo
    };
    
    return { data: newTodo, error: null };
  }
}

export async function deleteTodo(id: number) {
  try {
    // Try the API call (will fail for JSONPlaceholder)
    await todoApi.deleteTodo(id);
    revalidatePath('/');
    return { data: id, error: null };
  } catch (error) {
    // Even if API fails, return success for UI
    return { data: id, error: null };
  }
}

export async function updateTodo(id: number, todo: Partial<Todo>) {
  try {
    // Try the API call (will fail for JSONPlaceholder)
    await todoApi.updateTodo(id, todo);
    
    // Return mock data for UI
    const updatedTodo: Todo = {
      id,
      title: todo.title || '',
      completed: todo.completed || false,
      userId: todo.userId || 0
    };
    
    revalidatePath('/');
    return { data: updatedTodo, error: null };
  } catch (error) {
    // Even if API fails, return mock data
    const updatedTodo: Todo = {
      id,
      title: todo.title || '',
      completed: todo.completed || false,
      userId: todo.userId || 0
    };
    
    return { data: updatedTodo, error: null };
  }
}

export async function getTodoById(id: string) {
  try {
    const todo = await todoApi.getTodoById(id);
    return { data: todo, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch todo'
    };
  }
}

export async function getTodos(page?: number, limit?: number) {
  try {
    const todos = await todoApi.getTodos(page, limit);
    return { data: todos, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch todos'
    };
  }
} 