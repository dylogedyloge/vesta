// Base Types
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// API Types
export interface TodoPage {
  todos: Todo[];
  nextPage: number | undefined;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Store Types
export interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  editTodo: (todo: Todo) => void;
  deleteTodo: (todoId: string) => void;
  setInitialTodos: (todos: Todo[]) => void;
}

// Component Props Types
export interface TodoDetailProps {
  id: string;
}

export interface CreateTodoDialogProps {
  users: User[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
}

export interface EditTodoDialogProps {
  todo: Todo;
  users: User[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
}

export interface DeleteTodoDialogProps {
  todoId: string;
  todoTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
}

// UI Component Types
export interface Option {
  label: string;
  value: string;
}

export interface MultipleSelectorProps {
  value?: Option[];
  onChange?: (value: Option[]) => void;
  placeholder?: string;
  options: Option[];
  className?: string;
}

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
} 

export interface TaskTableProps {
  initialData: {
    todos: Todo[];
    users: User[];
  };
}