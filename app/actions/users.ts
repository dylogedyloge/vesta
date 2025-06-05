'use server'


import { userApi } from "@/lib/api/users";

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

export async function getUserById(id: number) {
  try {
    const user = await userApi.getUserById(id);
    return { data: user, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch user'
    };
  }
} 