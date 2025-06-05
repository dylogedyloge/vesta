"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { TableSkeleton } from "./TableSkeleton";
import { Skeleton } from "./ui/skeleton";
import { DeleteTodoDialog } from "./DeleteTodoDialog";
import { EditTodoDialog } from "./EditTodoDialog";
import { CreateTodoDialog } from "./CreateTodoDialog";
import { Plus, Search } from "lucide-react";
import { Todo, User } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MultipleSelector, Option } from "./ui/multiple-selector";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useTodos } from "@/hooks/useTodos";
import { PAGINATION } from "@/config";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { userApi } from "@/lib/api/users";

export default function TaskTable() {
  const [page, setPage] = useState(1);
  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  const isMobile = useIsMobile();
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    todos,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleCreate,
    handleUpdate,
    handleDelete
  } = useTodos(isMobile, pageSize);

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: userApi.getUsers
  });

  const handleDeleteClick = (todo: Todo) => setTodoToDelete(todo);
  const handleEditClick = (todo: Todo) => setTodoToEdit(todo);
  const handleDeleteSuccess = async (todoId: number) => await handleDelete(todoId);
  const handleEditSuccess = async (editedTodo: Todo) => await handleUpdate(editedTodo.id, editedTodo);
  const handleCreateSuccess = async (newTodo: Omit<Todo, 'id'>) => await handleCreate(newTodo);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const { observerTarget } = useInfiniteScroll(loadMore);

  const getUserName = (userId: number): string => {
    const user = users.find((u: User) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  // Filter todos based on status and search query
  const filteredTodos = todos.filter(todo => {
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "completed" && todo.completed) ||
      (statusFilter === "pending" && !todo.completed);

    const matchesAssignee = assigneeFilter.length === 0 ||
      assigneeFilter.some(option => option.value === String(todo.userId));

    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesAssignee && matchesSearch;
  });

  // Calculate total pages based on filtered todos
  const totalPages = Math.ceil(filteredTodos.length / pageSize);

  // Helper to generate page numbers with ellipsis
  const getPaginationItems = (current: number, total: number) => {
    const items: (number | "ellipsis")[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) items.push(i);
    } else {
      if (current <= 4) {
        items.push(1, 2, 3, 4, 5, "ellipsis", total);
      } else if (current >= total - 3) {
        items.push(1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        items.push(1, "ellipsis", current - 1, current, current + 1, "ellipsis", total);
      }
    }
    return items;
  };

  // Get paginated todos for desktop view
  const paginatedTodos = !isMobile 
    ? filteredTodos.slice((page - 1) * pageSize, page * pageSize)
    : filteredTodos;

  if (isLoading || usersLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div>Error loading todos</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Todo
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <MultipleSelector
          value={assigneeFilter}
          onChange={setAssigneeFilter}
          options={users.map((user: User) => ({
            label: user.name,
            value: String(user.id)
          }))}
          placeholder="Filter by assignee"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Todo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTodos.map(todo => (
            <TableRow key={todo.id}>
              <TableCell>{todo.title}</TableCell>
              <TableCell>
                <Badge variant={todo.completed ? "default" : "secondary"}>
                  {todo.completed ? "Completed" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>{getUserName(todo.userId)}</TableCell>
              <TableCell className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditClick(todo)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteClick(todo)}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                >
                  <Link href={`/todos/${todo.id}`}>
                    Detail
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteTodoDialog
        todoId={todoToDelete?.id ?? 0}
        todoTitle={todoToDelete?.title ?? ""}
        isOpen={todoToDelete !== null}
        onOpenChange={(open) => !open && setTodoToDelete(null)}
        isMobile={isMobile}
        onDeleteSuccess={handleDeleteSuccess}
      />

      <EditTodoDialog
        todo={todoToEdit}
        users={users}
        isOpen={todoToEdit !== null}
        onOpenChange={(open) => !open && setTodoToEdit(null)}
        isMobile={isMobile}
        onEditSuccess={handleEditSuccess}
      />

      <CreateTodoDialog
        users={users}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        isMobile={isMobile}
        onCreateSuccess={handleCreateSuccess}
      />

      {/* Pagination or Infinite Scroll */}
      {isMobile ? (
        <div ref={observerTarget} className="w-full py-4">
          {isFetchingNextPage && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px] mx-auto" />
              <Skeleton className="h-4 w-[200px] mx-auto" />
              <Skeleton className="h-4 w-[150px] mx-auto" />
            </div>
          )}
          {!isFetchingNextPage && hasNextPage && (
            <div className="text-center prose-sm">Scroll for more</div>
          )}
          {!hasNextPage && (
            <div className="text-center prose-sm">No more todos</div>
          )}
        </div>
      ) : (
        filteredTodos.length > 0 && (
          <Pagination className="mt-4 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(page - 1)}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {getPaginationItems(page, totalPages).map((item, idx) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={page === item}
                      onClick={() => setPage(Number(item))}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(page + 1)}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )
      )}
    </div>
  );
}