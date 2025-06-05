'use server'

import { Todo } from "@/types";
import { todoApi } from "@/lib/api/todos";
import { revalidatePath } from "next/cache";

export async function createTodo(todo: Omit<Todo, 'id'>) {
  try {
    const newTodo = await todoApi.createTodo(todo);
    revalidatePath('/');
    return { data: newTodo, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Failed to create todo' 
    };
  }
}

export async function deleteTodo(id: number) {
  try {
    await todoApi.deleteTodo(id);
    revalidatePath('/');
    return { data: id, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to delete todo'
    };
  }
}

export async function updateTodo(id: number, todo: Partial<Todo>) {
  try {
    const updatedTodo = await todoApi.updateTodo(id, todo);
    revalidatePath('/');
    return { data: updatedTodo, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update todo'
    };
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