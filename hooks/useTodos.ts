import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '@/lib/api/todos';
import { useTodoStore } from '@/store/todoStore';
import { Todo, TodoPage } from '@/types';
import { useEffect } from 'react';

export const useTodos = (isMobile: boolean, pageSize: number = 10) => {
  const queryClient = useQueryClient();
  const { todos, setInitialTodos, addTodo, editTodo, deleteTodo } = useTodoStore();

  const {
    data: todosData,
    isLoading: infiniteLoading,
    error: infiniteError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<TodoPage>({
    queryKey: ['todos', isMobile],
    queryFn: async ({ pageParam = 1 }) => {
      const todos = await todoApi.getTodos(pageParam, pageSize);
      return {
        todos,
        nextPage: todos.length === pageSize ? (pageParam as number) + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: isMobile,
  });

  const {
    data: regularTodos,
    isLoading: regularLoading,
    error: regularError
  } = useQuery<Todo[]>({
    queryKey: ['regularTodos'],
    queryFn: () => todoApi.getTodos(),
    enabled: !isMobile,
  });

  useEffect(() => {
    if (isMobile && todosData) {
      const allTodos = todosData.pages.flatMap(page => page.todos);
      setInitialTodos(allTodos);
    } else if (!isMobile && regularTodos) {
      setInitialTodos(regularTodos);
    }
  }, [isMobile, todosData, regularTodos, setInitialTodos]);

  const handleCreate = async (todo: Omit<Todo, 'id'>) => {
    const newTodo = await todoApi.createTodo(todo);
    addTodo(newTodo);
    return newTodo;
  };

  const handleUpdate = async (id: number, todo: Partial<Todo>) => {
    const updatedTodo = await todoApi.updateTodo(id, todo);
    editTodo(updatedTodo);
    return updatedTodo;
  };

  const handleDelete = async (id: number) => {
    await todoApi.deleteTodo(id);
    deleteTodo(id);
    return id;
  };

  return {
    todos,
    isLoading: isMobile ? infiniteLoading : regularLoading,
    error: isMobile ? infiniteError : regularError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}; 