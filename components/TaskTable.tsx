"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
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
import { PAGINATION } from "@/config";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { getTodos } from "@/app/actions/todos";
import { getUsers } from "@/app/actions/users";
import { useTodoStore } from "@/store/todoStore";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const todos = useTodoStore((state) => state.todos);
  const setInitialTodos = useTodoStore((state) => state.setInitialTodos);

  const fetchTodos = async (pageNum?: number) => {
    try {
      setIsFetchingNextPage(true);
      // Fetch all todos initially
      const result = await getTodos();
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.data) {
        setInitialTodos(result.data);
        setHasNextPage(false); // No more pages since we fetch all at once
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const result = await getUsers();
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.data) {
        setUsers(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchTodos(1),
        fetchUsers()
      ]);
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      const nextPage = Math.ceil(todos.length / pageSize) + 1;
      fetchTodos(nextPage);
    }
  };

  const { observerTarget } = useInfiniteScroll(loadMore);

  const handleDeleteClick = (todo: Todo) => setTodoToDelete(todo);
  const handleEditClick = (todo: Todo) => setTodoToEdit(todo);

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

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div>Error loading todos: {error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Todo
          </Button>
          <ThemeToggle />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-[200px]">
            <MultipleSelector
              value={assigneeFilter}
              onChange={setAssigneeFilter}
              options={users.map(user => ({
                label: user.name,
                value: String(user.id)
              }))}
              placeholder="Filter by assignee"
            />
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTodos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Link href={`/todos/${todo.id}`} className="hover:underline">
                    {todo.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={todo.completed ? "default" : "secondary"}>
                    {todo.completed ? "Completed" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{getUserName(todo.userId)}</TableCell>
                <TableCell className="text-right space-x-2">
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
                      Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!isMobile && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page === 1 ? "my-4 pointer-events-none opacity-50" : ""}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>
              {getPaginationItems(page, totalPages).map((item, index) => (
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      onClick={() => setPage(item)}
                      isActive={page === item}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {isMobile && hasNextPage && (
        <div ref={observerTarget} className="flex justify-center p-4">
          {isFetchingNextPage ? (
            <Skeleton className="h-8 w-[100px]" />
          ) : (
            <Button variant="ghost" onClick={loadMore}>
              Load More
            </Button>
          )}
        </div>
      )}

      <CreateTodoDialog
        users={users}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        isMobile={isMobile}
      />

      {todoToEdit && (
        <EditTodoDialog
          todo={todoToEdit}
          users={users}
          isOpen={!!todoToEdit}
          onOpenChange={() => setTodoToEdit(null)}
          isMobile={isMobile}
        />
      )}

      {todoToDelete && (
        <DeleteTodoDialog
          todoId={todoToDelete.id}
          todoTitle={todoToDelete.title}
          isOpen={!!todoToDelete}
          onOpenChange={() => setTodoToDelete(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}