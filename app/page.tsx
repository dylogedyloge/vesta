import TaskTable from "@/components/TaskTable";
import { getTodos } from "@/app/actions/todos";
import { getUsers } from "@/app/actions/users";
import { Suspense } from "react";

// Opt into background revalidation and route caching
export const revalidate = 60;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-cache';

export default async function Home() {
  // Fetch initial data on the server
  const [todosResult, usersResult] = await Promise.all([
    getTodos(),
    getUsers()
  ]);

  const initialData = {
    todos: todosResult.data || [],
    users: usersResult.data || []
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskTable initialData={initialData} />
      </Suspense>
    </main>
  );
}
