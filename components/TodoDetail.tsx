"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, UserCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { todoApi } from "@/lib/api/todos";
import { userApi } from "@/lib/api/users";
import { Todo, User, TodoDetailProps } from "@/types";
import { QUERY_KEYS } from "@/config";

export default function TodoDetail({ id }: TodoDetailProps) {
  // Fetch todo details
  const { data: todo, isLoading: todoLoading } = useQuery<Todo>({
    queryKey: QUERY_KEYS.TODO_DETAIL(id),
    queryFn: () => todoApi.getTodoById(id)
  });

  // Fetch user details if we have a todo
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: QUERY_KEYS.USER_DETAIL(todo?.userId || 0),
    queryFn: () => userApi.getUserById(todo?.userId || 0),
    enabled: !!todo?.userId,
  });

  if (todoLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <Skeleton className="h-4 w-24" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="prose">Todo Not Found</CardTitle>
              <CardDescription>
                The requested todo item could not be found.
                This app uses JSONPlaceholder as a mock API and does not persist data.So, the newly created todo does not exist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Todo List
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Button variant="ghost" asChild size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Todo List
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl tracking-tight prose">
                  {todo.title}
                </CardTitle>
                <CardDescription className="prose-sm">
                  Task Details
                </CardDescription>
              </div>
              <Badge variant={todo.completed ? "default" : "secondary"}>
                {todo.completed ? "Completed" : "Pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 !mt-0">
                  <UserCircle className="h-4 w-4" />
                  Assignee Details
                </h3>
                <div className="pl-6 space-y-1">
                  <p className="!mt-0">{user.name}</p>
                  <p className="text-muted-foreground !mt-0">{user.email}</p>
                  <p className="text-muted-foreground !mt-0">{user.phone}</p>
                  <p className="text-muted-foreground !mt-0">Company: {user.company.name}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 !mt-0">
                <CalendarIcon className="h-4 w-4" />
                Task Information
              </h3>
              <div className="pl-6 space-y-1">
                <p className="!mt-0">
                  <span className="font-medium">ID:</span> {todo.id}
                </p>
                <p className="!mt-0">
                  <span className="font-medium">Status:</span> {todo.completed ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 