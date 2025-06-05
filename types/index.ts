// Base Types
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: {
    name: string;
  };
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
  deleteTodo: (todoId: number) => void;
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
  onCreateSuccess: (newTodo: Omit<Todo, 'id'>) => void;
}

export interface EditTodoDialogProps {
  todo: Todo | null;
  users: User[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  onEditSuccess: (editedTodo: Todo) => void;
}

export interface DeleteTodoDialogProps {
  todoId: number;
  todoTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  onDeleteSuccess: (todoId: number) => void;
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