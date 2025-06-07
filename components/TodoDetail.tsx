"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, UserCircle, Mail, Phone, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTodoById } from "@/app/actions/todos";
import { getUserById } from "@/app/actions/users";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TodoDetailProps, Todo, User } from "@/types";
import { useTodoStore } from "@/store/todoStore";

export default function TodoDetail({ id, initialData }: TodoDetailProps) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(initialData?.todo || null);
  const [user, setUser] = useState<User | null>(initialData?.user || null);
  const [error, setError] = useState<string | null>(initialData?.error || null);
  const [loading, setLoading] = useState(!initialData);
  
  const storeTodos = useTodoStore((state) => state.todos);

  useEffect(() => {
    // Try to find todo in store first
    const storeData = storeTodos.find(t => t.id === id);
    
    if (storeData) {
      setTodo(storeData);
      // Only fetch user data if not available
      if (!user) {
        fetchUserData(storeData.userId);
      }
    } else if (!initialData) {
      // Only fetch if we don't have data from any source
      fetchTodoData();
    }
  }, [id, initialData, storeTodos]);

  const fetchUserData = async (userId: string) => {
    try {
      const userResult = await getUserById(userId);
      if (userResult.error) {
        setError(userResult.error);
        return;
      }
      setUser(userResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const fetchTodoData = async () => {
    setLoading(true);
    try {
      const todoResult = await getTodoById(id);
      if (todoResult.error) {
        setError(todoResult.error);
        return;
      }
      
      setTodo(todoResult.data);
      
      if (todoResult.data) {
        await fetchUserData(todoResult.data.userId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Skeleton className="h-8 w-24 mb-4" />
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
    );
  }

  const handleBack = () => {
    router.back();
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Button variant="ghost" className="mb-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todos
        </Button>
        <Card className="bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Button variant="ghost" className="mb-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todos
        </Button>
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Todo Not Found</CardTitle>
            <CardDescription>The requested todo item could not be found.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todos
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{todo.title}</CardTitle>
            <Badge variant={todo.completed ? "default" : "secondary"}>
              {todo.completed ? "Completed" : "Pending"}
            </Badge>
          </div>
          <CardDescription className="mt-2">
            Task #{todo.id} • Created on {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {user && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Assignee Details
              </h3>
              <div className="pl-7 space-y-2">
                <p className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{user.name}</span>
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {user.company.name}
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Task Information
            </h3>
            <div className="pl-7 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                {todo.completed ? "Completed" : "Pending"}
              </p>
              <p className="text-sm">
                <span className="font-medium">ID:</span> {todo.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 