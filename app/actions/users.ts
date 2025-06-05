'use server'

import { userApi } from "@/lib/api/users";
import { User } from "@/types";
import { API_CONFIG } from "@/config";

export async function getUsers() {
  try {
    const users = await userApi.getUsers();
    return { data: users, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch users'
    };
  }
}

export async function getUserById(id: string) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data: User = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch user' };
  }
} 