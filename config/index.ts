export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  MOBILE_INFINITE_SCROLL_SIZE: 10,
};

export const QUERY_KEYS = {
  TODOS: 'todos',
  USERS: 'users',
  TODO_DETAIL: (id: string) => ['todo', id],
  USER_DETAIL: (id: number) => ['user', id],
};

export const ERROR_MESSAGES = {
  FETCH_TODOS: 'Failed to fetch todos',
  CREATE_TODO: 'Failed to create todo',
  UPDATE_TODO: 'Failed to update todo',
  DELETE_TODO: 'Failed to delete todo',
  FETCH_USERS: 'Failed to fetch users',
}; 