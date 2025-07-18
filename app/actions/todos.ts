'use server'

import { Todo } from "@/types";
import { todoApi } from "@/lib/api/todos";
import { API_CONFIG } from "@/config";
import { generateSlug } from "@/lib/utils";

let mockTodoId = 1000;

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

export async function getTodoById(id: string) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    const data: Todo = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch todo' };
  }
}

export async function createTodo(todo: Omit<Todo, 'id'>) {
  try {
    // Try the API call (will fail for JSONPlaceholder)
    await todoApi.createTodo(todo);
    
    // Return mock data for UI
    const newTodo: Todo = {
      id: String(mockTodoId++),
      ...todo,
      userId: String(todo.userId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Revalidate after state update
    return { data: newTodo, error: null };
  } catch (error) {
    // Even if API fails, return mock data
    console.log(error);
    const newTodo: Todo = {
      id: String(mockTodoId++),
      ...todo,
      userId: String(todo.userId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { data: newTodo, error: null };
  }
}

export async function updateTodo(id: string, todo: Partial<Todo>) {
  try {
    // Try the API call (will fail for JSONPlaceholder)
    await todoApi.updateTodo(id, todo);
    
    // Return the complete todo object with required fields
    const updatedTodo: Todo = {
      id: String(id),
      title: todo.title || '',
      completed: todo.completed ?? false,
      userId: String(todo.userId || ''),
      createdAt: todo.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Return before revalidation
    return { data: updatedTodo, error: null };
  } catch (error) {
    console.log(error);

    // Even if API fails, return the complete todo object
    const updatedTodo: Todo = {
      id: String(id),
      title: todo.title || '',
      completed: todo.completed ?? false,
      userId: String(todo.userId || ''),
      createdAt: todo.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { data: updatedTodo, error: null };
  }
}

export async function deleteTodo(id: string) {
  try {
    // Try the API call (will fail for JSONPlaceholder)
    await todoApi.deleteTodo(id);
    // Return before revalidation
    return { data: id, error: null };
  } catch (error) {
    console.log(error);
    // Even if API fails, return success for UI
    return { data: id, error: null };
  }
}

export async function getTodoBySlug(slug: string) {
  try {
    // Get all todos
    const response = await fetch(`${API_CONFIG.BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    
    const todos = await response.json() as Array<{
      id: number;
      title: string;
      completed: boolean;
      userId: number;
    }>;
    
    // Find the todo with matching slug
    const todo = todos.find(t => generateSlug(t.title) === slug);
    if (!todo) {
      return { data: null, error: 'Todo not found' };
    }

    // Normalize the todo data
    const normalizedTodo: Todo = {
      ...todo,
      id: String(todo.id),
      userId: String(todo.userId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { data: normalizedTodo, error: null };
  } catch (error) {
    console.error('Error in getTodoBySlug:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch todo' };
  }
} 